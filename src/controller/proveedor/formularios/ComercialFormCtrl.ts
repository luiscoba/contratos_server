import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Trespuestaseleccionada } from '../../../entities/Trespuestaseleccionada';
import { ComercialDto } from '../../../models/proveedor/dto/ComercialDto';
import { ParamRespuestaSeleccionada } from '../../../models/proveedor/parameters';
import QueryProv from '../../util/QueryProv';
import Util from '../../util/Util';

class ComercialFormCtrl {
  // es el valor que 'Comercial' tiene en la tabla 'ttipoperfil'
  static idTipoPerfil = 3;
  static getComercialDto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const comercialDto: ComercialDto = new ComercialDto();

    let respuestaseleccionada: Trespuestaseleccionada[] = await QueryProv.getRespuestaSeleccionada(
      idProvider,
      ComercialFormCtrl.idTipoPerfil
    );

    comercialDto.lstRespuestaSeleccionada = await QueryProv.llenarRespuestaSeleccionada(
      respuestaseleccionada
    );

    comercialDto.idtipoperfil = ComercialFormCtrl.idTipoPerfil;

    return res.status(202).json(comercialDto);
  };

  static saveComercial = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const { idtipoperfil, lstRespuestaSeleccionada } = req.body;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const correoQuery: string = (
        await QueryProv.getUsuarioSistema(idProvider)
      ).correo;

      if (lstRespuestaSeleccionada[0].idrespuestaseleccionada) {
        // actualizamos
        for (let respuestaSeleccionada of lstRespuestaSeleccionada) {
          console.log('element', respuestaSeleccionada);
          await getConnection()
            .createQueryBuilder()
            .update(Trespuestaseleccionada)
            .set({
              idrespuesta: respuestaSeleccionada.idrespuesta,
            })
            .where('id = :id and idproveedor= :idproveedor', {
              id: respuestaSeleccionada.idrespuestaseleccionada,
              idproveedor: idProvider,
            })
            .execute();
        }
      } else {
        // guardamos por primera vez
        for (let respSeleccionada of lstRespuestaSeleccionada) {
          let respuestaseleccionada: Trespuestaseleccionada = new Trespuestaseleccionada();
          respuestaseleccionada.idrespuesta = respSeleccionada.idrespuesta;
          respuestaseleccionada.idproveedor = idProvider;
          respuestaseleccionada.idtipoperfil = idtipoperfil;
          respuestaseleccionada.fecharegistro = Util.fechaActual();
          respuestaseleccionada.estado = true;
          respuestaseleccionada.responsable = correoQuery;

          await queryRunner.manager.save(respuestaseleccionada);
        }
      }

      let pesoTotal: number = await QueryProv.obtenerPeso(
        lstRespuestaSeleccionada
      );

      console.log('pesoTotal', pesoTotal);

      await queryRunner.commitTransaction();

      return res.status(202).json(); //enviamos solo el objeto sin {}
    } catch (err) {
      console.log('entra en el catch');
      await queryRunner.rollbackTransaction();
      return res.status(400).json('Cant save identification');
    } finally {
      await queryRunner.release();
    }
  };
}

export default ComercialFormCtrl;
