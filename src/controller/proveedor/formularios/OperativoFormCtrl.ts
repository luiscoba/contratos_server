import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Tproveedor } from '../../../entities/Tproveedor';
import { Trespuestaseleccionada } from '../../../entities/Trespuestaseleccionada';
import { OperativoDto } from '../../../models/proveedor/dto/OperativoDto';
import QueryProv from '../../util/QueryProv';
import Util from '../../util/Util';

class OperativoFormCtrl {
  // es el valor que 'Operativo' tiene en la tabla 'ttipoperfil'
  static idTipoPerfil = 2;
  static getOperativoDto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    console.log('entra en operativo');
    console.log('idTipoPerfil', OperativoFormCtrl.idTipoPerfil);

    const operativoDto: OperativoDto = new OperativoDto();

    let respuestaseleccionada: Trespuestaseleccionada[] = await QueryProv.getRespuestaSeleccionada(
      idProvider,
      OperativoFormCtrl.idTipoPerfil
    );

    console.log('respuestaseleccionada ggggggg', respuestaseleccionada);

    operativoDto.lstRespuestaSeleccionada = await QueryProv.llenarRespuestaSeleccionada(
      respuestaseleccionada
    );

    operativoDto.idtipoperfil = OperativoFormCtrl.idTipoPerfil;

    return res.status(202).json(operativoDto);
  };

  static saveOperativo = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const { idtipoperfil, lstRespuestaSeleccionada } = req.body;

    console.log('lstRespuestaSeleccionada', lstRespuestaSeleccionada);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proveedorQuery: Tproveedor = await QueryProv.getProveedor(
        idProvider
      );

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

export default OperativoFormCtrl;
