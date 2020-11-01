import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tactividad } from '../../entities/Tactividad';
import { Tcanton } from '../../entities/Tcanton';
import { Tcatalogocategoria } from '../../entities/Tcatalogocategoria';
import { Tcategoria } from '../../entities/Tcategoria';
import { Tcuenta } from '../../entities/Tcuenta';
import { Tdocumento } from '../../entities/Tdocumento';
import { Tpais } from '../../entities/Tpais';
import { Tparroquia } from '../../entities/Tparroquia';
import { Tpregunta } from '../../entities/Tpregunta';
import { Tprovincia } from '../../entities/Tprovincia';
import { Trespuesta } from '../../entities/Trespuesta';
import { Ttipocontribuyente } from '../../entities/Ttipocontribuyente';
import { Ttipopersona } from '../../entities/Ttipopersona';
import { Ttipoproveedor } from '../../entities/Ttipoproveedor';
import { Ttiporatio } from '../../entities/Ttiporatio';
import { Ttiporatiocuenta } from '../../entities/Ttiporatiocuenta';
import {
  ParamCanton,
  ParamCatalogoCategoria,
  ParamCategoria,
  ParamContribuyente,
  ParamCuenta,
  ParamDocumento,
  Parameter, ParamPais, ParamParroquia,
  ParamPregunta,
  ParamProvincia,
  ParamRespuesta
} from '../../models/proveedor/parameters';

class ParamController {
  static getParameters = async (req: Request, res: Response) => {
    // pantalla 'identificacion'
    const tipopersonaRepository = getRepository(Ttipopersona);
    const tipoproveedorRepository = getRepository(Ttipoproveedor);
    const tipocontribuyenteRepository = getRepository(Ttipocontribuyente);
    const actividadRepository = getRepository(Tactividad);
    const categoriaRepository = getRepository(Tcategoria);
    const catalogocategoriaRepository = getRepository(Tcatalogocategoria);
    // pantalla 'informacion contacto'
    const paisRepository = getRepository(Tpais);
    const cantonRepository = getRepository(Tcanton);
    const provinciaRepository = getRepository(Tprovincia);
    const parroquiaRepository = getRepository(Tparroquia);
    // empresarial
    const preguntaRepository = getRepository(Tpregunta);
    const respuestaRepository = getRepository(Trespuesta);
    // documental
    const documentoRepository = getRepository(Tdocumento);
    // financiero
    const cuentaRepository = getRepository(Tcuenta);

    // consultas
    const lstTipoPersona: Ttipopersona[] = await tipopersonaRepository.find({
      estado: true,
    });

    const lstTipoProveedor: Ttipoproveedor[] = await tipoproveedorRepository.find(
      {
        estado: true,
      }
    );

    const lstTipocontribuyente: Ttipocontribuyente[] = await tipocontribuyenteRepository.find(
      {
        estado: true,
      }
    );

    const lstActividad: Tactividad[] = await actividadRepository.find({
      estado: true,
    });

    const lstCategoria: Tcategoria[] = await categoriaRepository.find({
      estado: true,
    });

    const lstCatalogocategoria: Tcatalogocategoria[] = await catalogocategoriaRepository.find(
      {
        estado: true,
      }
    );
    // info-contacto
    const lstPais: Tpais[] = await paisRepository.find({
      estado: true,
    });

    const lstCanton: Tcanton[] = await cantonRepository.find({
      estado: true,
    });

    const lstProvincia: Tprovincia[] = await provinciaRepository.find({
      estado: true,
    });

    const lstParroquia: Tparroquia[] = await parroquiaRepository.find({
      estado: true,
    });

    // empresarial
    const lstPregunta: Tpregunta[] = await preguntaRepository.find({
      estado: true,
    });

    const lstRespuesta: Trespuesta[] = await respuestaRepository.find({
      estado: true,
    });

    // documental
    const lstDocumento: Tdocumento[] = await documentoRepository.find({
      estado: true,
    });

    // financiero
    const lstCuenta: Tcuenta[] = await cuentaRepository.find({
      estado: true,
    });

    // generacion de Dtos --------------------------------------------
    const lstTipoPersonaDto: Parameter[] = ParamController.loadParameter(
      lstTipoPersona
    );

    const lstTipoProveedorDto: Parameter[] = ParamController.loadParameter(
      lstTipoProveedor
    );

    const lstTipocontribuyenteDto: ParamContribuyente[] = ParamController.loadParameterContribuyente(
      lstTipocontribuyente
    );

    const lstActividadDto: Parameter[] = ParamController.loadParameter(
      lstActividad
    );

    const lstCategoriaDto: Parameter[] = ParamController.loadParameterCategoria(
      lstCategoria
    );

    const lstCatalogocategoriaDto: Parameter[] = ParamController.loadParameterCatalogocategoria(
      lstCatalogocategoria
    );

    const lstPaisDto: ParamPais[] = ParamController.loadParameterPais(lstPais);

    const lstProvinciaDto: ParamProvincia[] = ParamController.loadParameterProvincia(
      lstProvincia
    );

    const lstCantonDto: ParamCanton[] = ParamController.loadParameterCanton(
      lstCanton
    );

    const lstParroquiaDto: ParamParroquia[] = ParamController.loadParameterParroquia(
      lstParroquia
    );

    const lstPreguntaDto: ParamPregunta[] = ParamController.loadParameterPregunta(
      lstPregunta
    );

    const lstRespuestaDto: ParamRespuesta[] = await ParamController.loadParameterRespuesta(
      lstRespuesta
    );

    const lstDocumentoDto: ParamDocumento[] = await ParamController.loadParameterDocumento(
      lstDocumento
    );

    const lstCuentaDto: ParamCuenta[] = await ParamController.loadParameterCuenta(
      lstCuenta
    );

    return res.status(202).json({
      lstTipoPersonaDto,
      lstTipoProveedorDto,
      lstTipocontribuyenteDto,
      lstActividadDto,
      lstCategoriaDto,
      lstCatalogocategoriaDto,
      lstPaisDto,
      lstProvinciaDto,
      lstCantonDto,
      lstParroquiaDto,
      lstPreguntaDto,
      lstRespuestaDto,
      lstDocumentoDto,
      lstCuentaDto,
    });
  };

  static getAllParameters = async (req: Request, res: Response) => {
    const tipopersonaRepository = getRepository(Ttipopersona);

    const lstTipoPersona: Ttipopersona[] = await tipopersonaRepository.find({
      estado: true,
    });

    ParamController.loadParameter(lstTipoPersona);

    return res.status(202).json({ lstTipoPersona });
  };

  static loadParameter = (lista) => {
    let lstParameters: Parameter[] = [];

    lista.forEach((element) => {
      let parameter = new Parameter(element.id, element.nombre);
      lstParameters.push(parameter);
    });

    return lstParameters;
  };

  static loadParameterPais = (lista: Tpais[]) => {
    let lstParameters: ParamPais[] = [];

    lista.forEach((element) => {
      let parameter = new ParamPais(element.id, element.codigo, element.nombre);
      lstParameters.push(parameter);
    });

    return lstParameters;
  };

  static loadParameterDocumento = (lista: Tdocumento[]) => {
    let lstParameters: ParamDocumento[] = [];

    lista.forEach((element) => {
      let parameter = new ParamDocumento(
        element.id,
        element.nombre,
        element.numero
      );
      lstParameters.push(parameter);
    });

    return lstParameters;
  };

  static loadParameterCuenta = async (lista: Tcuenta[]) => {
    let lstParameters: ParamCuenta[] = [];

    for (const element of lista) {
      let idTipoRatio: number = await ParamController.obtenerIdTipoRatioCuentaPorIdCuenta(
        element.id
      );

      let idtipopersona: number = await ParamController.obtenerIdTipoPersonaPoridTipoRatio(
        idTipoRatio
      );
      let parameter = new ParamCuenta(
        element.id,
        element.nombre,
        idTipoRatio,
        idtipopersona
      );

      lstParameters.push(parameter);
    }

    return lstParameters;
  };

  static async obtenerIdTipoPersonaPoridTipoRatio(idTipoRatio: number) {
    const tiporatio: Ttiporatio = await getConnection()
      .createQueryBuilder()
      .select('Ttiporatio')
      .from(Ttiporatio, 'Ttiporatio')
      .where('Ttiporatio.id = :idTipoRatio', {
        idTipoRatio: idTipoRatio,
      })
      .getOne();

    return tiporatio.idtipopersona;
  }

  static async obtenerIdTipoRatioCuentaPorIdCuenta(idCuenta: number) {
    const tipoRatioCuenta: Ttiporatiocuenta = await getConnection()
      .createQueryBuilder()
      .select('Ttiporatiocuenta')
      .from(Ttiporatiocuenta, 'Ttiporatiocuenta')
      .where('Ttiporatiocuenta.idcuenta = :idcuenta', {
        idcuenta: idCuenta,
      })
      .getOne();

    return tipoRatioCuenta.idtiporatio;
  }

  static loadParameterContribuyente = (lista) => {
    let lstParameters: ParamContribuyente[] = [];

    lista.forEach((element) => {
      let parameter = new ParamContribuyente(
        element.id,
        element.idtipopersona,
        element.nombre
      );
      lstParameters.push(parameter);
    });

    return lstParameters;
  };

  static loadParameterCategoria = (lista) => {
    let lstParameters: ParamCategoria[] = [];

    lista.forEach((element) => {
      let parameter = new ParamCategoria(
        element.id,
        element.idactividad,
        element.nombre
      );
      lstParameters.push(parameter);
    });
    return lstParameters;
  };

  static loadParameterCatalogocategoria = (lista) => {
    let lstParameters: ParamCatalogoCategoria[] = [];

    lista.forEach((element) => {
      let parameter = new ParamCatalogoCategoria(
        element.id,
        element.idcategoria,
        element.nombre
      );
      lstParameters.push(parameter);
    });
    return lstParameters;
  };

  static loadParameterProvincia = (lista: Tprovincia[]) => {
    let lstParameters: ParamProvincia[] = [];

    lista.forEach((element: Tprovincia) => {
      let parameter = new ParamProvincia(
        element.id,
        element.idpais,
        element.nombre
      );
      lstParameters.push(parameter);
    });
    return lstParameters;
  };

  static loadParameterCanton = (lista: Tcanton[]) => {
    let lstParameters: ParamCanton[] = [];

    lista.forEach((element: Tcanton) => {
      let parameter = new ParamCanton(
        element.id,
        element.idprovincia,
        element.nombre
      );
      lstParameters.push(parameter);
    });
    return lstParameters;
  };

  static loadParameterParroquia = (lista: Tparroquia[]) => {
    let lstParameters: ParamParroquia[] = [];

    lista.forEach((element: Tparroquia) => {
      let parameter = new ParamParroquia(
        element.id,
        element.idcanton,
        element.nombre
      );
      lstParameters.push(parameter);
    });
    return lstParameters;
  };

  static loadParameterPregunta = (lista: Tpregunta[]) => {
    let lstParameters: ParamPregunta[] = [];

    lista.forEach((element: Tpregunta) => {
      let parameter = new ParamPregunta(
        element.id,
        element.nombre,
        element.idtipoperfil
      );
      lstParameters.push(parameter);
    });
    return lstParameters;
  };

  static loadParameterRespuesta = async (lista: Trespuesta[]) => {
    let lstParameters: ParamRespuesta[] = [];

    for (const element of lista) {
      let idtipoperfil: number = await ParamController.obtenerIdPerfilPorIdPregunta(
        element.idpregunta
      );
      let parameter = new ParamRespuesta(
        element.id,
        element.idpregunta,
        element.nombre,
        idtipoperfil
      );

      lstParameters.push(parameter);
    }

    return lstParameters;
  };

  static async obtenerIdPerfilPorIdPregunta(idpregunta: number) {
    const pregunta: Tpregunta = await getConnection()
      .createQueryBuilder()
      .select('Tpregunta')
      .from(Tpregunta, 'Tpregunta')
      .where('Tpregunta.id = :id', {
        id: idpregunta,
      })
      .getOne();

    return pregunta.idtipoperfil;
  }
}

export default ParamController;
