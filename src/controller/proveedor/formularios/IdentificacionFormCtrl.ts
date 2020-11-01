import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tcatalogocategoria } from '../../../entities/Tcatalogocategoria';
import { Tcategoria } from '../../../entities/Tcategoria';
import { Tidentificacionproveedor } from '../../../entities/Tidentificacionproveedor';
import { Tproveedor } from '../../../entities/Tproveedor';
import { Tproveedoractividad } from '../../../entities/Tproveedoractividad';
import { Ttipocontribuyente } from '../../../entities/Ttipocontribuyente';
import { Ttipopersona } from '../../../entities/Ttipopersona';
import {
  IdentificacionDto,
  ListaActividades,
} from '../../../models/proveedor/dto/IdentificacionDto';
import { Parameter } from '../../../models/proveedor/parameters';
import { Tperfilfinanciero } from '../../../entities/Tperfilfinanciero';
import Util from '../../util/Util';
import QueryProv from '../../util/QueryProv';

class IdentificacionFormCtrl {
  // sacado de https://usefulangle.com/post/187/nodejs-get-date-time
  static fechaActual = () => {
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let day = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    // prints date & time in YYYY-MM-DD format
    //console.log(year + '-' + month + '-' + day);
    return year + '-' + month + '-' + day;
  };

  static saveIdentificacion = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;
    console.log('idProviderjejeje', idProvider);
    const {
      rucrise,
      nombrerazonsocial,
      nombrecomercial,
      persona,
      proveedor,
      contribuyente,
      lstActividades,
    } = req.body;

    console.log('req.body identificacion', req.body);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const identificacionProveedorCliente: Tidentificacionproveedor = new Tidentificacionproveedor();
      identificacionProveedorCliente.rucrise = rucrise;
      identificacionProveedorCliente.nombrecomercial = nombrecomercial;
      identificacionProveedorCliente.nombrerazonsocial = nombrerazonsocial;
      identificacionProveedorCliente.idtipoproveedor = proveedor.id;

      const providerRepository = getRepository(Tproveedor);
      const providerQuery: Tproveedor = await providerRepository.findOne({
        id: idProvider,
      });

      let identification: IdentificacionDto;

      if (providerQuery.ididentificacionproveedor) {
        // actualiza la tabla 'identificacion'
        identification = await IdentificacionFormCtrl.updateTidentificacionProveedor(
          providerQuery,
          identificacionProveedorCliente,
          proveedor,
          contribuyente
        );
      } else {
        // primera vez que registra 'identificacion'
        identification = await IdentificacionFormCtrl.saveNewTidentificacionProveedor(
          providerQuery,
          identificacionProveedorCliente,
          contribuyente
        );
      }

      // guardamos el tipoPersona en Financiero -------------------------------------
      if (providerQuery.idperfilfinanciero) {
        if (providerQuery.idperfilfinanciero) {
          // actualizar la tabla 'perfilfinanciero'
          await IdentificacionFormCtrl.updateTperfilfinanciero(
            providerQuery,
            persona
          );
        } else {
          // primera vez que registra 'perfilfinanciero'
          await IdentificacionFormCtrl.saveNewTperfilfinanciero(
            providerQuery,
            persona
          );
        }
      } else {
        // primera vez que registra 'perfilfinanciero'
        await IdentificacionFormCtrl.saveNewTperfilfinanciero(
          providerQuery,
          persona
        );
      }

      console.log('lstActividades llega', lstActividades);

      // traigo lo que tengo en la base de datos
      const providerActivityQuery = await getConnection()
        .createQueryBuilder()
        .select('tproveedoractividad')
        .from(Tproveedoractividad, 'tproveedoractividad')
        .where(
          'tproveedoractividad.ididentificacionproveedor = :id and tproveedoractividad.estado = :estado',
          {
            id: identification.id,
            estado: true,
          }
        )
        .getMany();

      console.log('providerActivityQueryxxxxx', providerActivityQuery);
      // si la consulta de la base datos me trae datos
      if (providerActivityQuery.length > 0) {
        // actualiza la tabla Tproveedoractividad

        for (let element of lstActividades) {
          console.log('lement.id', element.id);

          if (element.id) {
            await getConnection()
              .createQueryBuilder()
              .update(Tproveedoractividad)
              .set({
                idcatalogocategoria: element['detalle'].id,
              })
              .where(
                'id = :id and ididentificacionproveedor= :ididentificacionproveedor',
                {
                  id: element.id,
                  ididentificacionproveedor: identification.id,
                }
              )
              .execute();
          } else {
            let providerActivity: Tproveedoractividad = new Tproveedoractividad();
            providerActivity.ididentificacionproveedor = identification.id;
            providerActivity.idcatalogocategoria = element['detalle'].id;
            providerActivity.estado = true;

            await queryRunner.manager.save(providerActivity);
          }
        }
      } else {
        // primera vez que registra Tproveedoractividad
        console.log('llega al caso contrario lstActividades', lstActividades);

        for (let element of lstActividades) {
          let providerActivity: Tproveedoractividad = new Tproveedoractividad();
          providerActivity.ididentificacionproveedor = identification.id;
          providerActivity.idcatalogocategoria = element['detalle'].id;
          providerActivity.estado = true;

          let datoAlmacenado: Tproveedoractividad = await queryRunner.manager.save(
            providerActivity
          );

          console.log('datoAlmacenadooooo', datoAlmacenado);
        }
      }

      const i: IdentificacionDto = new IdentificacionDto();
      // i.idinformacioncontacto
      i.idtipopersona = identification.idtipopersona;
      i.idtipoproveedor = identification.idtipoproveedor;
      i.idtipocontribuyente = identification.idtipocontribuyente;
      i.rucrise = identification.rucrise;
      i.nombrerazonsocial = identification.nombrerazonsocial;
      i.nombrecomercial = identification.nombrecomercial;
      i.estado = identification.estado;
      i.lstActividades = lstActividades;

      await queryRunner.commitTransaction();
      return res.status(202).json(i); // respondemos con 'identificacionDto'
    } catch (err) {
      console.log('entra en el catch err ', err);
      await queryRunner.rollbackTransaction();
      return res.status(400).json('Cant save identification');
    } finally {
      await queryRunner.release();
    }
  };

  static saveNewTperfilfinanciero = async (
    providerQuery: Tproveedor,
    persona: Parameter
  ) => {
    const perfilfinanciero = new Tperfilfinanciero();
    perfilfinanciero.estado = true;
    perfilfinanciero.fecharegistro = Util.fechaActual();
    perfilfinanciero.peso = '0';
    perfilfinanciero.idtipopersona = persona.id;

    const perfilFinancieroRepository = getRepository(Tperfilfinanciero);
    const newPerfilfinanciero = await perfilFinancieroRepository.save(
      perfilfinanciero
    );

    const providerRepository = getRepository(Tproveedor);
    providerQuery.idperfilfinanciero = newPerfilfinanciero.id;
    await providerRepository.save(providerQuery);
  };

  static updateTperfilfinanciero = async (
    providerQuery: Tproveedor,
    persona: Parameter
  ) => {
    let perfilfinanciero: Tperfilfinanciero = await QueryProv.getPerfilFinanciero(
      providerQuery.id
    );

    console.log('perfilfinancieroqqqqqq', perfilfinanciero);

    perfilfinanciero.estado = true;
    perfilfinanciero.fecharegistro = Util.fechaActual();
    perfilfinanciero.peso = '0';
    perfilfinanciero.idtipopersona = persona.id;

    const perfilFinancieroRepository = getRepository(Tperfilfinanciero);
    await perfilFinancieroRepository.save(perfilfinanciero);
  };

  static saveNewTidentificacionProveedor = async (
    providerQuery: Tproveedor,
    identificacionProveedorCliente: Tidentificacionproveedor,
    contribuyente
  ): Promise<Tidentificacionproveedor> => {
    const correoQuery: string = (
      await QueryProv.getUsuarioSistema(providerQuery.id)
    ).correo;

    identificacionProveedorCliente.idtipocontribuyente = contribuyente.id;
    identificacionProveedorCliente.estado = true;
    identificacionProveedorCliente.fecharegistro = IdentificacionFormCtrl.fechaActual();
    identificacionProveedorCliente.responsable = correoQuery;

    // guardamos la identificacion
    const identificationRepository = getRepository(Tidentificacionproveedor);
    const identification = await identificationRepository.save(
      identificacionProveedorCliente
    );
    console.log('identificationiiiiiii', identification);
    console.log('providerQuery antes', providerQuery);
    // guardamos el 'ididentificacionproveedor' en Tproveedor
    const providerRepository = getRepository(Tproveedor);
    providerQuery.ididentificacionproveedor = identification.id;
    await providerRepository.save(providerQuery);

    console.log('providerQuery despues', providerQuery);

    return identification;
  };

  static updateTidentificacionProveedor = async (
    providerQuery: Tproveedor,
    identificacionProveedorCliente: Tidentificacionproveedor,
    proveedor: Parameter,
    contribuyente: Parameter
  ) => {
    const correoQuery: string = (
      await QueryProv.getUsuarioSistema(providerQuery.id)
    ).correo;

    console.log('llega contribuyente', contribuyente);

    const identificationRepository = getRepository(Tidentificacionproveedor);
    let identificationQuery: Tidentificacionproveedor = await identificationRepository.findOne(
      {
        id: providerQuery.ididentificacionproveedor,
      }
    );
    identificationQuery.rucrise = identificacionProveedorCliente.rucrise;
    identificationQuery.nombrecomercial =
      identificacionProveedorCliente.nombrecomercial;
    identificationQuery.nombrerazonsocial =
      identificacionProveedorCliente.nombrerazonsocial;
    identificationQuery.idtipoproveedor = proveedor.id;
    identificationQuery.idtipocontribuyente = contribuyente.id;
    identificationQuery.estado = true;
    identificationQuery.fecharegistro = IdentificacionFormCtrl.fechaActual();
    identificationQuery.responsable = correoQuery;

    // guardamos la identificacion
    const identification = await identificationRepository.save(
      identificationQuery
    );

    // guardamos el 'ididentificacionproveedor' en Tproveedor
    const providerRepository = getRepository(Tproveedor);
    providerQuery.ididentificacionproveedor = identification.id;
    await providerRepository.save(providerQuery);

    console.log('identificationvvvvvvv', identification);

    return identification;
  };

  static getIdentification = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const identificacionDto = new IdentificacionDto();

    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    // establish real database connection using our new query runner
    await queryRunner.connect();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      // we can also access entity manager that works with connection created by a query runner:
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

        const ttipocontribuyenteQuery: Ttipocontribuyente = await getConnection()
          .createQueryBuilder()
          .select('Ttipocontribuyente')
          .from(Ttipocontribuyente, 'Ttipocontribuyente')
          .where('Ttipocontribuyente.id = :id', {
            id: identificationQuery.idtipocontribuyente,
          })
          .getOne();

        console.log(
          'raw query ttipocontribuyenteQuery',
          ttipocontribuyenteQuery.idtipopersona
        );
        console.log(
          'ttipocontribuyenteQuery.idtipopersona',
          ttipocontribuyenteQuery.idtipopersona
        );

        const ttipopersonaQuery: Ttipopersona = await getConnection()
          .createQueryBuilder()
          .select('Ttipopersona')
          .from(Ttipopersona, 'Ttipopersona')
          .where('Ttipopersona.id = :id', {
            id: ttipocontribuyenteQuery.idtipopersona,
          })
          .getOne();

        console.log('raw query ttipopersonaQuery', ttipopersonaQuery);

        identificacionDto.id = identificationQuery.id;
        identificacionDto.estado = identificationQuery.estado;
        identificacionDto.rucrise = identificationQuery.rucrise;
        identificacionDto.nombrerazonsocial =
          identificationQuery.nombrerazonsocial;
        identificacionDto.nombrecomercial = identificationQuery.nombrecomercial;
        identificacionDto.idtipopersona = ttipopersonaQuery.id;
        identificacionDto.idtipoproveedor = identificationQuery.idtipoproveedor;
        identificacionDto.idtipocontribuyente =
          identificationQuery.idtipocontribuyente;

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
        let lstListaActividades: ListaActividades[] = [];
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

          console.log('tcategoriaQuery 22', tcategoriaQuery);

          let listaActividades = new ListaActividades();
          listaActividades.id = tproveedoractividadQuery[i].id;
          listaActividades.ididentificacionproveedor =
            tproveedoractividadQuery[i].ididentificacionproveedor;
          listaActividades.idcatalogocategoria =
            tproveedoractividadQuery[i].idcatalogocategoria;
          listaActividades.idcategoria = tcategoriaQuery.id;
          listaActividades.idactividad = tcategoriaQuery.idactividad;

          lstListaActividades.push(listaActividades);
        }
        console.log('lstListaActividades xxx ', lstListaActividades);
        identificacionDto.lstActividades = lstListaActividades;

        console.log('identificacionDto xxx ', identificacionDto);
      } else {
      }
      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
    // Send response
    return res.status(202).json(identificacionDto); //enviamos solo el objeto sin {}
  };

  static deleteActividad = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;
    const { id } = req.params;

    console.log('id que viene', id);
    console.log('idProvider', idProvider);

    if (!id) {
      return res.status(202).json('error vacio');
    }

    const identificacionDto = new IdentificacionDto();

    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      const provider = await connection
        .createQueryBuilder()
        .select('Tproveedor')
        .from(Tproveedor, 'Tproveedor')
        .where('Tproveedor.id = :id', { id: idProvider })
        .getOne();

      console.log('provider', provider);
      // we can also access entity manager that works with connection created by a query runner:
      await connection
        .createQueryBuilder()
        .update(Tproveedoractividad)
        .set({ estado: false })
        .where(
          'id = :id and ididentificacionproveedor= :ididentificacionproveedor',
          {
            id: id,
            ididentificacionproveedor: provider.ididentificacionproveedor,
          }
        )
        .execute();

      // commit transaction now:
      await queryRunner.commitTransaction();
      // Send response
      return res.status(202).json('Ok');
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();

      // Send response
      return res.status(400).json('Cant change state');
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  };
}
export default IdentificacionFormCtrl;
