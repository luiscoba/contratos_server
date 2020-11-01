import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Tperfilempresarial } from '../../../entities/Tperfilempresarial';
import { Tproveedor } from '../../../entities/Tproveedor';
import { Trespuestaseleccionada } from '../../../entities/Trespuestaseleccionada';
import { EmpresarialDto } from '../../../models/proveedor/dto/EmpresarialDto';
import { ParamRespuestaSeleccionada } from '../../../models/proveedor/parameters';
import QueryProv from '../../util/QueryProv';
import Util from '../../util/Util';

class EmpresarialFormCtrl {
  // es el valor que 'Empresarial' tiene en la tabla 'ttipoperfil'
  static idTipoPerfil = 1;

  static getEmpresarialDto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    console.log('idTipoPerfil', EmpresarialFormCtrl.idTipoPerfil);

    let empresarialDto: EmpresarialDto = new EmpresarialDto();

    let perfilempresarial: Tperfilempresarial = await QueryProv.getPerfilEmpresarial(
      idProvider
    );
    console.log('perfilempresarial ooooooo', perfilempresarial);

    console.log(
      'FormEmpresarialCtrl.isEmpty(perfilempresarial)',
      EmpresarialFormCtrl.isEmpty(perfilempresarial)
    );

    if (EmpresarialFormCtrl.isEmpty(perfilempresarial)) {
      console.log('entra aqui');
      empresarialDto.idtipoperfil = EmpresarialFormCtrl.idTipoPerfil;
      return res.status(202).json(empresarialDto); //enviamos solo el objeto sin {}
    } else {
      // si 'perfilempresarial' está lleno
      let respuestaseleccionada: Trespuestaseleccionada[] = await QueryProv.getRespuestaSeleccionada(
        idProvider,
        EmpresarialFormCtrl.idTipoPerfil
      );

      empresarialDto.idtipoperfil = EmpresarialFormCtrl.idTipoPerfil;

      empresarialDto.actividadeconomicaprincipal =
        perfilempresarial.actividadeconomicaprincipal;
      empresarialDto.actividadeconomicasecundaria =
        perfilempresarial.actividadeconomicasecundaria;
      empresarialDto.fechaaperturaruc = perfilempresarial.fechaaperturaruc;

      empresarialDto.lstRespuestaSeleccionada = await QueryProv.llenarRespuestaSeleccionada(
        respuestaseleccionada
      );

      return res.status(202).json(empresarialDto);
    }
  };

  static isEmpty = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  static saveEmpresarialDto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const {
      idtipoperfil,
      fechaaperturaruc,
      actividadeconomicaprincipal,
      actividadeconomicasecundaria,
      lstRespuestaSeleccionada,
    } = req.body;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log('req.body empr', req.body);

    try {
      const proveedorQuery: Tproveedor = await QueryProv.getProveedor(
        idProvider
      );

      const correoQuery: string = (
        await QueryProv.getUsuarioSistema(idProvider)
      ).correo;

      console.log('idtipoperfil', idtipoperfil);

      if (lstRespuestaSeleccionada[0].idrespuestaseleccionada) {
        // actualizamos
        lstRespuestaSeleccionada.forEach(
          async (respuestaSeleccionada: ParamRespuestaSeleccionada) => {
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
        );
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

      let perfilempresarial: Tperfilempresarial = await QueryProv.getPerfilEmpresarial(
        idProvider
      );

      console.log('fechaaperturaruc', fechaaperturaruc);

      let date_ob = new Date(fechaaperturaruc);
      let day = date_ob.getDate() + 1;
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();

      const newFechaAperturaRuc = year + '-' + month + '-' + day;

      console.log('newFechaAperturaRuc', newFechaAperturaRuc);

      perfilempresarial.fechaaperturaruc = newFechaAperturaRuc;
      perfilempresarial.actividadeconomicaprincipal = actividadeconomicaprincipal;
      perfilempresarial.actividadeconomicasecundaria = actividadeconomicasecundaria;
      perfilempresarial.peso = pesoTotal.toString(); // <=====
      perfilempresarial.estado = true;
      perfilempresarial.fecharegistro = Util.fechaActual();
      perfilempresarial.responsable = correoQuery;

      perfilempresarial = await queryRunner.manager.save(perfilempresarial);

      proveedorQuery.idperfilempresarial = perfilempresarial.id;

      await queryRunner.manager.save(proveedorQuery);

      await queryRunner.commitTransaction();

      return res.status(202).json(perfilempresarial); //enviamos solo el objeto sin {}
    } catch (err) {
      console.log('entra en el catch emp');
      await queryRunner.rollbackTransaction();
      return res.status(400).json('Cant save identification');
    } finally {
      await queryRunner.release();
    }
  };
}

export default EmpresarialFormCtrl;
