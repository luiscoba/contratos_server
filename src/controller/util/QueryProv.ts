import { createQueryBuilder, getConnection, getRepository } from 'typeorm';
import { Taceptacion } from '../../entities/Taceptacion';
import { Tcuentaperfilfinanciero } from '../../entities/Tcuentaperfilfinanciero';
import { Tdocumento } from '../../entities/Tdocumento';
import { Tdocumentoperfildocumental } from '../../entities/Tdocumentoperfildocumental';
import { Tidentificacionproveedor } from '../../entities/Tidentificacionproveedor';
import { Tperfildocumental } from '../../entities/Tperfildocumental';
import { Tperfilempresarial } from '../../entities/Tperfilempresarial';
import { Tperfilfinanciero } from '../../entities/Tperfilfinanciero';
import { Tproveedor } from '../../entities/Tproveedor';
import { Trespuesta } from '../../entities/Trespuesta';
import { Trespuestaseleccionada } from '../../entities/Trespuestaseleccionada';
import { Ttipocontribuyente } from '../../entities/Ttipocontribuyente';
import { Ttipopersona } from '../../entities/Ttipopersona';
import { Tusuariosistema } from '../../entities/Tusuariosistema';
import { ParamRespuestaSeleccionada } from '../../models/proveedor/parameters';
import Util from './Util';
import { Taceptacionhistorico } from '../../entities/Taceptacionhistorico';
import { Tproveedoractividad } from '../../entities/Tproveedoractividad';

import { Tcatalogocategoria } from '../../entities/Tcatalogocategoria';
import { Tcategoria } from '../../entities/Tcategoria';
import { ListaActividadesResponsable } from '../../models/responsable/dtos/LstActividadDto';
import { Tactividad } from '../../entities/Tactividad';
import { Calificacion } from '../../models/responsable/dtos/ReporteDto';
import { Tcalificacion } from '../../entities/Tcalificacion';

class QueryProv {
  static ID_PERFIL_OPERATIVO = 2;
  static ID_PERFIL_COMERCIAL = 3;

  static async saveCalificacion(idProvider: number,calificacionburo, pesoTotal: string) {
    let objCalificacion: Calificacion = new Calificacion();
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // se almacena el correo de la persona responsable, que califica
    // const correoQuery: string = (await QueryProv.getUsuarioSistema(idProvider)).correo;
    try {
      // calculamos la calificacion
      const rango = await getRepository(Tcalificacion)
        .createQueryBuilder('tcalificacion')
        .select('MAX(tcalificacion.rango)', 'max')
        .where('tcalificacion.rango <= :rango', {
          rango: Math.floor(+pesoTotal),
        })
        .getRawOne();

      console.log('pesoTotal va ', Math.floor(+pesoTotal));
      console.log('rango va ', rango);

      const calificacion = await getConnection()
        .createQueryBuilder()
        .select('Tcalificacion')
        .from(Tcalificacion, 'Tcalificacion')
        .where(
          'Tcalificacion.estado = :estado and Tcalificacion.rango = :rango',
          {
            estado: true,
            rango: rango,
          }
        )
        .getOne();

      objCalificacion.calificacion = calificacion.calificacion;
      objCalificacion.riesgo = calificacion.riesgo;
      objCalificacion.resultado = calificacion.resultado;

      const proveedor = await QueryProv.getProveedor(idProvider);
      proveedor.pesototal = pesoTotal;
      proveedor.calificaciontotal =
        calificacionburo + calificacion.calificacion;

      await queryRunner.manager.save(proveedor);

      await queryRunner.commitTransaction();

      return objCalificacion;
    } catch (err) {
      console.log('entra en el catch saveCalificacion');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  static async getPesoPerfilDocumental(idProvider: number): Promise<number> {
    const perfilDocumental = await QueryProv.getPerfilDocumental(idProvider);
    const lstDocumentoPerfilDocumental = await QueryProv.DocumentoPerfilDocumentalByIdPerfilDocumental(
      perfilDocumental.id
    );

    let lstIdDocumento = [];
    lstDocumentoPerfilDocumental.forEach((element) => {
      lstIdDocumento.push(element.iddocumento);
    });

    let lstUniq = lstIdDocumento.reduce(function (a, b) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);

    let peso = 0;
    for (let iddocumento of lstUniq) {
      let doc = await QueryProv.getDocumentoPorIdDocumento(iddocumento);
      peso = +doc.peso + peso;
      console.log('doc.peso', doc.peso);
    }
    console.log('peso ', peso);
    const pesoTotal = (Math.round(peso * 100) / 100).toFixed(2);
    console.log('pesoTotal', pesoTotal);

    return +pesoTotal;
  }

  static async getLstActividades(idProvider: number) {
    const provider = await getConnection()
      .createQueryBuilder()
      .select('Tproveedor')
      .from(Tproveedor, 'Tproveedor')
      .where('Tproveedor.id = :id', { id: idProvider })
      .getOne();

    console.log('providerrrrr', provider);

    // para saber si es nuevo osea la primera vez que ingresa al sistema
    if (provider.estado) {
      const identificationQuery = await getConnection()
        .createQueryBuilder()
        .select('Tidentificacionproveedor')
        .from(Tidentificacionproveedor, 'Tidentificacionproveedor')
        .where('Tidentificacionproveedor.id = :id', {
          id: provider.ididentificacionproveedor,
        })
        .getOne();

      console.log('identificationQueryyyy', identificationQuery);

      const tproveedoractividadQuery: Tproveedoractividad[] = await getConnection()
        .createQueryBuilder()
        .select('Tproveedoractividad')
        .from(Tproveedoractividad, 'Tproveedoractividad')
        .where(
          'Tproveedoractividad.ididentificacionproveedor = :id and tproveedoractividad.estado = :estado',
          {
            id: identificationQuery.id,
            estado: true,
          }
        )
        .getMany();

      console.log('tproveedoractividadQuery 333', tproveedoractividadQuery);
      let lstListaActividades: ListaActividadesResponsable[] = [];
      for (let i = 0; i < tproveedoractividadQuery.length; i++) {
        const tcatalogocategoriaQuery: Tcatalogocategoria = await getConnection()
          .createQueryBuilder()
          .select('Tcatalogocategoria')
          .from(Tcatalogocategoria, 'Tcatalogocategoria')
          .where(
            'Tcatalogocategoria.id = :id and Tcatalogocategoria.estado = :estado',
            {
              id: tproveedoractividadQuery[i].idcatalogocategoria,
              estado: true,
            }
          )
          .getOne();

        console.log('tcatalogocategoriaQuery 11', tcatalogocategoriaQuery);

        const tcategoriaQuery: Tcategoria = await getConnection()
          .createQueryBuilder()
          .select('Tcategoria')
          .from(Tcategoria, 'Tcategoria')
          .where('Tcategoria.id = :id and Tcategoria.estado = :estado', {
            id: tcatalogocategoriaQuery.idcategoria,
            estado: true,
          })
          .getOne();

        const tactividadQuery: Tactividad = await getConnection()
          .createQueryBuilder()
          .select('Tactividad')
          .from(Tactividad, 'Tactividad')
          .where('Tactividad.id = :id and Tactividad.estado = :estado', {
            id: tcategoriaQuery.idactividad,
            estado: true,
          })
          .getOne();

        console.log('tcategoriaQuery 22', tcategoriaQuery);

        let listaActividades = new ListaActividadesResponsable();
        listaActividades.categoria = tcategoriaQuery.nombre;
        listaActividades.catalogocategoria = tcatalogocategoriaQuery.nombre;
        listaActividades.actividad = tactividadQuery.nombre;

        lstListaActividades.push(listaActividades);
      }
      console.log('lstListaActividades xxx ', lstListaActividades);

      return lstListaActividades;
    }
  }

  static async DocumentoPerfilDocumentalByIdPerfilDocumental(
    idPerfilDocumental
  ): Promise<Tdocumentoperfildocumental[]> {
    const lstdocumentoperfildocumental: Tdocumentoperfildocumental[] = await getConnection()
      .createQueryBuilder()
      .select('Tdocumentoperfildocumental')
      .from(Tdocumentoperfildocumental, 'Tdocumentoperfildocumental')
      .where(
        'Tdocumentoperfildocumental.idperfildocumental = :idperfildocumental',
        { idperfildocumental: idPerfilDocumental }
      )
      .getMany();

    return lstdocumentoperfildocumental;
  }

  static verificaSiContinua(proveedor: Tproveedor): string {
    if (!proveedor.ididentificacionproveedor) return '/identificacion';

    if (!proveedor.idinformacioncontacto) return '/infocontacto';

    if (!proveedor.idperfilempresarial) return '/empresarial';

    if (!proveedor.idperfilfinanciero) return '/financiero';

    if (!QueryProv.verficaOperativo(proveedor.id)) return '/operativo'; // vamos a ver si hay datos en Operativo

    if (!QueryProv.verficaComercial(proveedor.id)) return '/comercial'; // vamos a ver si hay datos en Comercial

    if (!proveedor.idperfildocumental) return '/documental';
  }

  static async verficaOperativo(idProvider): Promise<boolean> {
    const lstRespuestaSeleccionada: Trespuestaseleccionada[] = await QueryProv.getRespuestaSeleccionada(
      idProvider,
      this.ID_PERFIL_OPERATIVO
    );

    if (lstRespuestaSeleccionada.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  static async verficaComercial(idProvider): Promise<boolean> {
    const lstRespuestaSeleccionada: Trespuestaseleccionada[] = await QueryProv.getRespuestaSeleccionada(
      idProvider,
      this.ID_PERFIL_COMERCIAL
    );

    if (lstRespuestaSeleccionada.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  static async DocumentoPerfilDocumental(
    idPerfilDocumental,
    idDocumento
  ): Promise<Tdocumentoperfildocumental[]> {
    const lstdocumentoperfildocumental: Tdocumentoperfildocumental[] = await getConnection()
      .createQueryBuilder()
      .select('Tdocumentoperfildocumental')
      .from(Tdocumentoperfildocumental, 'Tdocumentoperfildocumental')
      .where(
        'Tdocumentoperfildocumental.idperfildocumental = :idperfildocumental and Tdocumentoperfildocumental.iddocumento',
        { idperfildocumental: idPerfilDocumental, iddocumento: idDocumento }
      )
      .getMany();

    return lstdocumentoperfildocumental;
  }

  static async getDocumento(): Promise<Tdocumento[]> {
    const lstDocumento = await getConnection()
      .createQueryBuilder()
      .select('Tdocumento')
      .from(Tdocumento, 'Tdocumento')
      .where('Tdocumento.estado = :estado', { estado: true })
      .getMany();

    return lstDocumento;
  }

  static async getDocumentoPorIdDocumento(id: number): Promise<Tdocumento> {
    const documento = await getConnection()
      .createQueryBuilder()
      .select('Tdocumento')
      .from(Tdocumento, 'Tdocumento')
      .where('Tdocumento.estado = :estado and Tdocumento.id = :id', {
        estado: true,
        id: id,
      })
      .getOne();

    return documento;
  }

  static async getPerfilDocumental(
    idProvider: number
  ): Promise<Tperfildocumental> {
    let perfildocumental = new Tperfildocumental();
    const proveedor = await getConnection()
      .createQueryBuilder()
      .select('Tproveedor')
      .from(Tproveedor, 'Tproveedor')
      .where('Tproveedor.id = :id', { id: idProvider })
      .getOne();

    console.log('t provveeedooor ->->->', proveedor);

    if (proveedor.idperfildocumental) {
      perfildocumental = await getConnection()
        .createQueryBuilder()
        .select('Tperfildocumental')
        .from(Tperfildocumental, 'Tperfildocumental')
        .where(
          'Tperfildocumental.estado = :estado and Tperfildocumental.id = :idperfildocumental',
          {
            estado: true,
            idperfildocumental: proveedor.idperfildocumental,
          }
        )

        .getOne();
    }

    return perfildocumental;
  }

  static async getAceptacion(): Promise<Taceptacion> {
    const aceptacion: Taceptacion = await getConnection()
      .createQueryBuilder()
      .select('Taceptacion')
      .from(Taceptacion, 'Taceptacion')
      .where('Taceptacion.estado = :estado', {
        estado: true,
      })
      .getOne();

    return aceptacion;
  }

  static async getAceptacionHistorico(
    idaceptacion: number
  ): Promise<Taceptacionhistorico> {
    const aceptacionHistorico: Taceptacionhistorico = await getConnection()
      .createQueryBuilder()
      .select('Taceptacionhistorico')
      .from(Taceptacionhistorico, 'Taceptacionhistorico')
      .where(
        'Taceptacionhistorico.estado = :estado and Taceptacionhistorico.idaceptacion = :idaceptacion',
        {
          estado: true,
          idaceptacion: idaceptacion,
        }
      )
      .getOne();

    return aceptacionHistorico;
  }

  static llenarRespuestaSeleccionada = async (
    respuestaseleccionada: Trespuestaseleccionada[]
  ): Promise<ParamRespuestaSeleccionada[]> => {
    const lstParamRespuestaSeleccionada: ParamRespuestaSeleccionada[] = [];
    for (let i = 0; i < respuestaseleccionada.length; i++) {
      let paramRespuestaSeleccionada: ParamRespuestaSeleccionada = new ParamRespuestaSeleccionada();
      paramRespuestaSeleccionada.idrespuestaseleccionada =
        respuestaseleccionada[i].id;
      paramRespuestaSeleccionada.idrespuesta =
        respuestaseleccionada[i].idrespuesta;

      let idPregunta = await QueryProv.obtenerIdPregunta(
        respuestaseleccionada[i].idrespuesta
      );

      paramRespuestaSeleccionada.idpregunta = idPregunta;

      lstParamRespuestaSeleccionada.push(paramRespuestaSeleccionada);
    }

    return lstParamRespuestaSeleccionada;
  };

  static async obtenerIdPregunta(idrespuesta: number): Promise<number> {
    const respuesta: Trespuesta = await getConnection()
      .createQueryBuilder()
      .select('Trespuesta')
      .from(Trespuesta, 'Trespuesta')
      .where('Trespuesta.id = :id', {
        id: idrespuesta,
      })
      .getOne();

    return respuesta.idpregunta;
  }

  static obtenerPeso = async (
    lstRespuestaSeleccionada: ParamRespuestaSeleccionada[]
  ): Promise<number> => {
    let pesoTotal = 0;

    for (let respuestaSeleccionada of lstRespuestaSeleccionada) {
      const respuesta: Trespuesta = await getConnection()
        .createQueryBuilder()
        .select('Trespuesta')
        .from(Trespuesta, 'Trespuesta')
        .where('Trespuesta.id = :id', {
          id: respuestaSeleccionada.idrespuesta,
        })
        .getOne();

      pesoTotal = pesoTotal + +respuesta.peso;
    }

    console.log('pesoooooTooootaaaal', pesoTotal);

    return pesoTotal;
  };

  static getRespuestaSeleccionada = async (
    idProvider: number,
    idTipoPerfil: number
  ): Promise<Trespuestaseleccionada[]> => {
    let lstRespuestaSeleccionada: Trespuestaseleccionada[] = [];

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      lstRespuestaSeleccionada = await getConnection()
        .createQueryBuilder()
        .select('Trespuestaseleccionada')
        .from(Trespuestaseleccionada, 'Trespuestaseleccionada')
        .where(
          'Trespuestaseleccionada.idproveedor = :idproveedor and Trespuestaseleccionada.idtipoperfil = :idtipoperfil',
          {
            idproveedor: idProvider,
            idtipoperfil: idTipoPerfil,
          }
        )
        .getMany();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return lstRespuestaSeleccionada;
  };

  static getPerfilEmpresarial = async (
    idProvider: number
  ): Promise<Tperfilempresarial> => {
    let perfilempresarial: Tperfilempresarial = new Tperfilempresarial();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor = await getConnection()
        .createQueryBuilder()
        .select('Tproveedor')
        .from(Tproveedor, 'Tproveedor')
        .where('Tproveedor.id = :id', { id: idProvider })
        .getOne();

      perfilempresarial = await getConnection()
        .createQueryBuilder()
        .select('Tperfilempresarial')
        .from(Tperfilempresarial, 'Tperfilempresarial')
        .where('Tperfilempresarial.id = :id', {
          id: proveedor.idperfilempresarial,
        })
        .getOne();

      if (!perfilempresarial) {
        perfilempresarial = new Tperfilempresarial();
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return perfilempresarial;
  };

  // obtenemos el correo del usuario a partir del idProvider
  static getUsuarioSistema = async (
    idProvider: number
  ): Promise<Tusuariosistema> => {
    const providerRepository = getRepository(Tproveedor);
    const providerQuery: Tproveedor = await providerRepository.findOne({
      id: idProvider,
    });

    const userRepository = getRepository(Tusuariosistema);
    const userQuery: Tusuariosistema = await userRepository.findOne({
      id: providerQuery.idusuariosistema,
    });

    return userQuery;
  };

  static getProveedor = async (idProvider: number) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor = await getConnection()
        .createQueryBuilder()
        .select('Tproveedor')
        .from(Tproveedor, 'Tproveedor')
        .where('Tproveedor.id = :id', { id: idProvider })
        .getOne();

      await queryRunner.commitTransaction();
      return proveedor;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getLstCuentaPerfilFinanciero = async (
    idProvider
  ): Promise<Tcuentaperfilfinanciero[]> => {
    let perfilfinanciero: Tperfilfinanciero = new Tperfilfinanciero();
    let lstCuentaPerfilFinanciero: Tcuentaperfilfinanciero[] = [];

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      perfilfinanciero = await getConnection()
        .createQueryBuilder()
        .select('Tperfilfinanciero')
        .from(Tperfilfinanciero, 'Tperfilfinanciero')
        .where('Tperfilfinanciero.id = :id', {
          id: proveedor.idperfilfinanciero,
        })
        .getOne();

      lstCuentaPerfilFinanciero = await getConnection()
        .createQueryBuilder()
        .select('Tcuentaperfilfinanciero')
        .from(Tcuentaperfilfinanciero, 'Tcuentaperfilfinanciero')
        .where(
          'Tcuentaperfilfinanciero.idperfilfinanciero = :idperfilfinanciero',
          {
            idperfilfinanciero: perfilfinanciero.id,
          }
        )
        .getMany();

      if (!lstCuentaPerfilFinanciero) {
        lstCuentaPerfilFinanciero = [];
      }

      await queryRunner.commitTransaction();
      return lstCuentaPerfilFinanciero;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getCuentaPerfilFinanciero = async (
    idProvider,
    idCuenta
  ): Promise<Tcuentaperfilfinanciero> => {
    let perfilfinanciero: Tperfilfinanciero = new Tperfilfinanciero();
    let cuentaPerfilFinanciero: Tcuentaperfilfinanciero = new Tcuentaperfilfinanciero();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      perfilfinanciero = await getConnection()
        .createQueryBuilder()
        .select('Tperfilfinanciero')
        .from(Tperfilfinanciero, 'Tperfilfinanciero')
        .where('Tperfilfinanciero.id = :id', {
          id: proveedor.idperfilfinanciero,
        })
        .getOne();

      cuentaPerfilFinanciero = await getConnection()
        .createQueryBuilder()
        .select('Tcuentaperfilfinanciero')
        .from(Tcuentaperfilfinanciero, 'Tcuentaperfilfinanciero')
        .where(
          'Tcuentaperfilfinanciero.idcuenta = :idcuenta and Tcuentaperfilfinanciero.idperfilfinanciero = :idperfilfinanciero',
          {
            idcuenta: idCuenta,
            idperfilfinanciero: perfilfinanciero.id,
          }
        )
        .getOne();

      if (!cuentaPerfilFinanciero) {
        cuentaPerfilFinanciero = new Tcuentaperfilfinanciero();
      }
      const correoQuery: string = (
        await QueryProv.getUsuarioSistema(idProvider)
      ).correo;

      cuentaPerfilFinanciero.idcuenta = idCuenta;
      cuentaPerfilFinanciero.idperfilfinanciero = perfilfinanciero.id;
      cuentaPerfilFinanciero.peso = '0';
      cuentaPerfilFinanciero.estado = true;
      cuentaPerfilFinanciero.fecharegistro = Util.fechaActual();
      cuentaPerfilFinanciero.responsable = correoQuery;

      await queryRunner.commitTransaction();
      return cuentaPerfilFinanciero;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getPerfilFinanciero = async (
    idProvider
  ): Promise<Tperfilfinanciero> => {
    let perfilfinanciero: Tperfilfinanciero = new Tperfilfinanciero();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      perfilfinanciero = await getConnection()
        .createQueryBuilder()
        .select('Tperfilfinanciero')
        .from(Tperfilfinanciero, 'Tperfilfinanciero')
        .where('Tperfilfinanciero.id = :id', {
          id: proveedor.idperfilfinanciero,
        })
        .getOne();

      if (!perfilfinanciero) {
        perfilfinanciero = new Tperfilfinanciero();
      }

      await queryRunner.commitTransaction();
      return perfilfinanciero;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getIdentificacionProveedor = async (idProvider) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      const identificacionproveedor = await getConnection()
        .createQueryBuilder()
        .select('Tidentificacionproveedor')
        .from(Tidentificacionproveedor, 'Tidentificacionproveedor')
        .where(
          'Tidentificacionproveedor.id = :id and Tidentificacionproveedor.estado = :estado',
          {
            id: proveedor.ididentificacionproveedor,
            estado: true,
          }
        )
        .getOne();

      await queryRunner.commitTransaction();
      return identificacionproveedor;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getTipocontribuyente = async (
    idProvider
  ): Promise<Ttipocontribuyente> => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      const identificacionproveedor: Tidentificacionproveedor = await QueryProv.getIdentificacionProveedor(
        idProvider
      );

      const tipocontribuyente = await getConnection()
        .createQueryBuilder()
        .select('Ttipocontribuyente')
        .from(Ttipocontribuyente, 'Ttipocontribuyente')
        .where('Ttipocontribuyente.id = :id', {
          id: identificacionproveedor.idtipocontribuyente,
        })
        .getOne();

      await queryRunner.commitTransaction();
      return tipocontribuyente;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getTipoPersona = async (idProvider): Promise<Ttipopersona> => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      const identificacionproveedor: Tidentificacionproveedor = await QueryProv.getIdentificacionProveedor(
        idProvider
      );

      const tipocontribuyente = await getConnection()
        .createQueryBuilder()
        .select('Ttipocontribuyente')
        .from(Ttipocontribuyente, 'Ttipocontribuyente')
        .where('Ttipocontribuyente.id = :id', {
          id: identificacionproveedor.idtipocontribuyente,
        })
        .getOne();

      const tipopersona = await getConnection()
        .createQueryBuilder()
        .select('Ttipopersona')
        .from(Ttipopersona, 'Ttipopersona')
        .where('Ttipopersona.id = :id', {
          id: tipocontribuyente.idtipopersona,
        })
        .getOne();

      await queryRunner.commitTransaction();
      return tipopersona;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}

export default QueryProv;
