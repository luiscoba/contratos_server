import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Taceptacion } from '../../../entities/Taceptacion';
import { Tperfildocumental } from '../../../entities/Tperfildocumental';
import { AceptacionDto } from '../../../models/proveedor/dto/AceptacionDto';
import QueryProv from '../../util/QueryProv';

class AceptacionFormCtrl {
  static downloadDocumentoAceptacion = async (req: Request, res: Response) => {
    console.log('__dirname', __dirname);

    const file = `${__dirname}/download/declaracion y autorizacion.docx`;

    res.download(file); // Set disposition and send it.
  };

  static getAceptacion = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    console.log('entra en documental');

    const perfilDocumental: Tperfildocumental = await QueryProv.getPerfilDocumental(
      idProvider
    );

    const aceptacionDto: AceptacionDto = new AceptacionDto();

    if (perfilDocumental.idaceptacion) {
      // datos de tperfildocumental
      let aceptacionHistorico: Taceptacion = await QueryProv.getAceptacionHistorico(
        perfilDocumental.idaceptacion
      );

      aceptacionDto.idperfildocumental = perfilDocumental.id;
      aceptacionDto.sideclaro = perfilDocumental.sideclaro;
      aceptacionDto.siautorizo = perfilDocumental.siautorizo;

      aceptacionDto.autorizacion = aceptacionHistorico.autorizacion;
      aceptacionDto.declaracion = aceptacionHistorico.declaracion;
    } else {
      // primera vez que entra en ACEPTACION
      let aceptacion: Taceptacion = await QueryProv.getAceptacion();

      perfilDocumental.idaceptacion = aceptacion.id;

      const perfilDocumentalRepository = getRepository(Tperfildocumental);
      await perfilDocumentalRepository.save(perfilDocumental);

      aceptacionDto.idperfildocumental = perfilDocumental.id;
      aceptacionDto.sideclaro = perfilDocumental.sideclaro;
      aceptacionDto.siautorizo = perfilDocumental.siautorizo;

      aceptacionDto.autorizacion = aceptacion.autorizacion;
      aceptacionDto.declaracion = aceptacion.declaracion;
    }

    return res.status(202).json(aceptacionDto);
  };

  static saveAceptacion = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    console.log('req.bodygggg aceptacion', req.body);

    const { acepta, autoriza } = req.body;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const correoQuery: string = (
        await QueryProv.getUsuarioSistema(idProvider)
      ).correo;

      const perfilDocumental = await QueryProv.getPerfilDocumental(idProvider);

      perfilDocumental.estado = true;
      perfilDocumental.siautorizo = autoriza;
      perfilDocumental.sideclaro = acepta;
      perfilDocumental.responsable = correoQuery;

      const perfildocumentalRepository = getRepository(Tperfildocumental);
      await perfildocumentalRepository.save(perfilDocumental);

      await queryRunner.commitTransaction();

      return res.status(202).json('ok'); //enviamos solo el objeto sin {}
    } catch (err) {
      console.log('entra en el catch');
      await queryRunner.rollbackTransaction();
      return res.status(400).json('Cant save identification');
    } finally {
      await queryRunner.release();
    }
  };
}

export default AceptacionFormCtrl;
