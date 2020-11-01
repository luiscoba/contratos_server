import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tcanton } from '../../../entities/Tcanton';
import { Tinformacioncontacto } from '../../../entities/Tinformacioncontacto';
import { Tpais } from '../../../entities/Tpais';
import { Tparroquia } from '../../../entities/Tparroquia';
import { Tproveedor } from '../../../entities/Tproveedor';
import { Tprovincia } from '../../../entities/Tprovincia';
import { InfoContactoDto } from '../../../models/proveedor/dto/InfoContactoDto';
import {
  ParamCanton,
  ParamPais,
  ParamParroquia,
  ParamProvincia,
} from '../../../models/proveedor/parameters';
import QueryProv from '../../util/QueryProv';
import Util from '../../util/Util';

class InfoContactoFormCtrl {
  static saveInfoContacto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const {
      direccion,
      telefono,
      celular,
      mailproveedor,
      contactocomercial,
      telefonocontactocomercial,
      celular1,
      mail1,
      celular2,
      mail2,
      parroquia,
    } = req.body;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proveedorQuery: Tproveedor = await QueryProv.getProveedor(
        idProvider
      );

      let informacioncontacto: Tinformacioncontacto;

      if (proveedorQuery.idinformacioncontacto) {
        // actualiza la tabla 'tinformacioncontacto'
        informacioncontacto = await InfoContactoFormCtrl.updateTinformacioncontacto(
          proveedorQuery,
          direccion,
          telefono,
          celular,
          mailproveedor,
          contactocomercial,
          telefonocontactocomercial,
          celular1,
          mail1,
          celular2,
          mail2,
          parroquia
        );
      } else {
        // primera vez que registra 'tinformacioncontacto'
        informacioncontacto = await InfoContactoFormCtrl.saveNewTinformacioncontacto(
          proveedorQuery,
          direccion,
          telefono,
          celular,
          mailproveedor,
          contactocomercial,
          telefonocontactocomercial,
          celular1,
          mail1,
          celular2,
          mail2,
          parroquia
        );

        proveedorQuery.idinformacioncontacto = informacioncontacto.id;

        await queryRunner.manager.save(proveedorQuery);
      }

      informacioncontacto = await queryRunner.manager.save(informacioncontacto);

      await queryRunner.commitTransaction();
      // Send response
      return res.status(202).json(informacioncontacto); //enviamos solo el objeto sin {}
    } catch (err) {
      console.log('entra en el catch');
      await queryRunner.rollbackTransaction();
      return res.status(400).json('Cant save identification');
    } finally {
      await queryRunner.release();
    }
  };

  static saveNewTinformacioncontacto = async (
    proveedorQuery: Tproveedor,
    direccion,
    telefono,
    celular,
    mailproveedor,
    contactocomercial,
    telefonocontactocomercial,
    celular1,
    mail1,
    celular2,
    mail2,
    parroquia: ParamParroquia
  ) => {
    let informacioncontactoCliente: Tinformacioncontacto = new Tinformacioncontacto();

    console.log('entra aqui saveNewTinformacioncontacto');
    informacioncontactoCliente.idparroquia = parroquia.id;
    informacioncontactoCliente.direccion = direccion;
    informacioncontactoCliente.telefono = telefono;
    informacioncontactoCliente.celular = celular;
    informacioncontactoCliente.mailproveedor = mailproveedor;
    informacioncontactoCliente.contactocomercial = contactocomercial;
    informacioncontactoCliente.telefonocontactocomercial = telefonocontactocomercial;
    informacioncontactoCliente.celular1 = celular1;
    informacioncontactoCliente.mail1 = mail1;
    informacioncontactoCliente.celular2 = celular2;
    informacioncontactoCliente.mail2 = mail2;
    informacioncontactoCliente.estado = true;
    informacioncontactoCliente.fecharegistro = Util.fechaActual();
    informacioncontactoCliente.responsable = await (
      await QueryProv.getUsuarioSistema(proveedorQuery.id)
    ).correo;

    const informacioncontactoRepository = getRepository(Tinformacioncontacto);
    informacioncontactoCliente = await informacioncontactoRepository.save(
      informacioncontactoCliente
    );

    return informacioncontactoCliente;
  };

  static updateTinformacioncontacto = async (
    proveedorQuery: Tproveedor,
    direccion,
    telefono,
    celular,
    mailproveedor,
    contactocomercial,
    telefonocontactocomercial,
    celular1,
    mail1,
    celular2,
    mail2,
    parroquia: ParamParroquia
  ) => {
    // let informacioncontacto: Tinformacioncontacto;

    const informacioncontactoRepository = getRepository(Tinformacioncontacto);
    let informacioncontactoQuery: Tinformacioncontacto = await informacioncontactoRepository.findOne(
      {
        id: proveedorQuery.idinformacioncontacto,
      }
    );

    informacioncontactoQuery.idparroquia = parroquia.id;
    informacioncontactoQuery.direccion = direccion;
    informacioncontactoQuery.telefono = telefono;
    informacioncontactoQuery.celular = celular;
    informacioncontactoQuery.mailproveedor = mailproveedor;
    informacioncontactoQuery.contactocomercial = contactocomercial;
    informacioncontactoQuery.telefonocontactocomercial = telefonocontactocomercial;
    informacioncontactoQuery.celular1 = celular1;
    informacioncontactoQuery.mail1 = mail1;
    informacioncontactoQuery.celular2 = celular2;
    informacioncontactoQuery.mail2 = mail2;
    informacioncontactoQuery.estado = true;
    informacioncontactoQuery.fecharegistro = Util.fechaActual();
    informacioncontactoQuery.responsable = await (
      await QueryProv.getUsuarioSistema(proveedorQuery.id)
    ).correo;

    return informacioncontactoQuery;
  };

  static getInfoContacto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const infoContactoDto = new InfoContactoDto();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('llegando idProvider', idProvider);
      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);

      /*

      ////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

      PARA VERIFICAR EL ACCESO A LAS DIFERENTES PANTALLAS
      console.log('proveedorrrrrrrrrr', proveedor);

      const ruta = QueryProv.verificaSiContinua(proveedor);

      if (ruta !== 'ok') {
        return res.status(202).json(ruta);
      }

      ////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/
      const infoContacto = await getConnection()
        .createQueryBuilder()
        .select('Tinformacioncontacto')
        .from(Tinformacioncontacto, 'Tinformacioncontacto')
        .where('Tinformacioncontacto.id = :id', {
          id: proveedor.idinformacioncontacto,
        })
        .getOne();

      console.log('infoContactooooooooooo', infoContacto);

      if (infoContacto) {
        infoContactoDto.direccion = infoContacto.direccion;
        infoContactoDto.telefono = infoContacto.telefono;
        infoContactoDto.celular = infoContacto.celular;
        infoContactoDto.mailproveedor = infoContacto.mailproveedor;
        infoContactoDto.contactocomercial = infoContacto.contactocomercial;
        infoContactoDto.telefonocontactocomercial =
          infoContacto.telefonocontactocomercial;
        infoContactoDto.celular1 = infoContacto.celular1;
        infoContactoDto.mail1 = infoContacto.mail1;
        infoContactoDto.celular2 = infoContacto.celular2;
        infoContactoDto.mail2 = infoContacto.mail2;

        const {
          pais,
          provincia,
          canton,
          parroquia,
        } = await InfoContactoFormCtrl.getUbicacionTerritorial(
          infoContacto.idparroquia
        );
        const paisParam = new ParamPais();
        paisParam.id = pais.id;
        paisParam.code = pais.codigo;
        paisParam.name = pais.nombre;

        const provinciaParam = new ParamProvincia();
        provinciaParam.id = provincia.id;
        provinciaParam.idpais = pais.id;
        provinciaParam.name = provincia.nombre;

        const cantonParam = new ParamCanton();
        cantonParam.id = canton.id;
        cantonParam.idprovincia = provincia.id;
        cantonParam.name = canton.nombre;

        const parroquiaParam = new ParamParroquia();
        parroquiaParam.id = parroquia.id;
        parroquiaParam.idcanton = canton.id;
        parroquiaParam.name = parroquia.nombre;

        infoContactoDto.pais = paisParam;
        infoContactoDto.provincia = provinciaParam;
        infoContactoDto.canton = cantonParam;
        infoContactoDto.parroquia = parroquiaParam;
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    // Send response
    return res.status(202).json(infoContactoDto); //enviamos solo el objeto sin {}
  };

  static async getUbicacionTerritorial(idparroquia: number) {
    const parroquiaRepository = getRepository(Tparroquia);
    let parroquiaQuery: Tparroquia = await parroquiaRepository.findOne({
      id: idparroquia,
    });

    const cantonRepository = getRepository(Tcanton);
    let cantonQuery: Tcanton = await cantonRepository.findOne({
      id: parroquiaQuery.idcanton,
    });

    const provinciaRepository = getRepository(Tprovincia);
    let provinciaQuery: Tprovincia = await provinciaRepository.findOne({
      id: cantonQuery.idprovincia,
    });

    const paisRepository = getRepository(Tpais);
    let paisQuery: Tpais = await paisRepository.findOne({
      id: provinciaQuery.idpais,
    });

    return {
      pais: paisQuery,
      provincia: provinciaQuery,
      canton: cantonQuery,
      parroquia: parroquiaQuery,
    };
  }
}
export default InfoContactoFormCtrl;
