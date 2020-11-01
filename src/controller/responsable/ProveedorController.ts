import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tidentificacionproveedor } from '../../entities/Tidentificacionproveedor';
import { Tproveedor } from '../../entities/Tproveedor';
import { Trespuestaseleccionada } from '../../entities/Trespuestaseleccionada';
import QueryProv from '../util/QueryProv';
import { ReporteDto } from '../../models/responsable/dtos/ReporteDto';
import QueryResp from '../util/QueryResp';
import { Tperfilfinanciero } from '../../entities/Tperfilfinanciero';

class ProveedorController {
  static ID_PERFIL_EMPRESARIAL = 1;
  static ID_PERFIL_OPERATIVO = 2;
  static ID_PERFIL_COMERCIAL = 3;

  static getFechasSinCalificar = async (req: Request, res: Response) => {
    const { idProvider } = req.params;

    const identificacionProveedor = await QueryProv.getIdentificacionProveedor(
      +idProvider
    );

    const pesosPerfiles = await ProveedorController.getPesosTotalesEnPerfiles(
      +idProvider
    );

    const empresarial = await QueryProv.getPerfilEmpresarial(+idProvider);
    const lstActividades = await QueryProv.getLstActividades(+idProvider);

    const reporteDto = new ReporteDto();
    reporteDto.nombrerazonsocial = identificacionProveedor.nombrerazonsocial;
    reporteDto.nombrecomercial = identificacionProveedor.nombrecomercial;
    reporteDto.pesosPerfiles = pesosPerfiles;
    reporteDto.actividadeconomicaprincipal =
      empresarial.actividadeconomicaprincipal;
    reporteDto.actividadeconomicasecundaria =
      empresarial.actividadeconomicasecundaria;
    reporteDto.lstActividades = lstActividades;

    let calificacionburo = 0;

    const calificacion = await QueryProv.saveCalificacion(
      +idProvider,
      calificacionburo,
      pesosPerfiles.total
    );

    //    reporteDto.calificacion = calificacion

    return res.status(202).json(reporteDto); //enviamos solo el objeto sin {}
  };

  static calificaProveedor = async (req: Request, res: Response) => {
    const { idProvider } = req.params;

    const identificacionProveedor = await QueryProv.getIdentificacionProveedor(
      +idProvider
    );

    const pesosPerfiles = await ProveedorController.getPesosTotalesEnPerfiles(
      +idProvider
    );

    const empresarial = await QueryProv.getPerfilEmpresarial(+idProvider);
    const lstActividades = await QueryProv.getLstActividades(+idProvider);

    const reporteDto = new ReporteDto();
    reporteDto.nombrerazonsocial = identificacionProveedor.nombrerazonsocial;
    reporteDto.nombrecomercial = identificacionProveedor.nombrecomercial;
    reporteDto.pesosPerfiles = pesosPerfiles;
    reporteDto.actividadeconomicaprincipal =
      empresarial.actividadeconomicaprincipal;
    reporteDto.actividadeconomicasecundaria =
      empresarial.actividadeconomicasecundaria;
    reporteDto.lstActividades = lstActividades;

    let calificacionburo = 0;

    const calificacion = await QueryProv.saveCalificacion(
      +idProvider,
      calificacionburo,
      pesosPerfiles.total
    );

    //    reporteDto.calificacion = calificacion

    return res.status(202).json(reporteDto); //enviamos solo el objeto sin {}
  };

  static getPesosTotalesEnPerfiles = async (idProvider: number) => {
    /******************************************************************************* */
    // Al momento de solicitar el reporte, ese momento se calcula sus ratios
    // entonces se guarda el total del ratio en el peso del perfil financiero
    let perfilFinanciero = await QueryProv.getPerfilFinanciero(idProvider);
    const perfilFinancieroRepository = getRepository(Tperfilfinanciero);
    const pesoFinanciero = await QueryResp.getSumaDeRatios(
      'Vw_financiero_total',
      idProvider
    );
    perfilFinanciero.peso = pesoFinanciero.toString();
    await perfilFinancieroRepository.save(perfilFinanciero);
    /******************************************************************************* */
    const pesoPerfilDocumental = await QueryProv.getPesoPerfilDocumental(
      idProvider
    );
    const pesoPerfilEmpresarial = await ProveedorController.getPesoPorPerfilEnRespuestaSeleccionada(
      idProvider,
      ProveedorController.ID_PERFIL_EMPRESARIAL
    );
    const pesoPerfilOperativo = await ProveedorController.getPesoPorPerfilEnRespuestaSeleccionada(
      idProvider,
      ProveedorController.ID_PERFIL_OPERATIVO
    );

    const pesoPerfilComercial = await ProveedorController.getPesoPorPerfilEnRespuestaSeleccionada(
      idProvider,
      ProveedorController.ID_PERFIL_COMERCIAL
    );

    let totalDec =
      +pesoPerfilEmpresarial +
      +perfilFinanciero.peso +
      +pesoPerfilOperativo +
      +pesoPerfilComercial +
      +pesoPerfilDocumental;

    let total = (Math.round(totalDec * 100) / 100).toFixed(2);

    let pesosPerfiles = {
      empresarial: pesoPerfilEmpresarial,
      financiero: perfilFinanciero.peso,
      operativo: pesoPerfilOperativo,
      comercial: pesoPerfilComercial,
      documental: pesoPerfilDocumental,
      total: total,
    };

    return pesosPerfiles;
  };

  static getProveedoresSinCalificar = async (req: Request, res: Response) => {
    const lstProveedor: Tproveedor[] = await getConnection()
      .createQueryBuilder()
      .select('Tproveedor')
      .from(Tproveedor, 'Tproveedor')
      .where(
        'Tproveedor.estado = :estado and Tproveedor.calificaciontotal = :califica',
        {
          estado: true,
          califica: 0,
        }
      )
      .getMany();

    console.log('lstProveedor jejeje ', lstProveedor);

    let objLstProveedor = [];
    for (let proveedor of lstProveedor) {
      let identificacion: Tidentificacionproveedor = await QueryProv.getIdentificacionProveedor(
        proveedor.id
      );

      if (identificacion) {
        console.log('identificacion jojo', identificacion);

        objLstProveedor.push({
          id: proveedor.id,
          razonsocial: identificacion.nombrerazonsocial,
        });
      }
    }

    return res.status(202).json(objLstProveedor); //enviamos solo el objeto sin {}
  };

  static async getPesoPorPerfilEnRespuestaSeleccionada(
    idProvider,
    idPerfil
  ): Promise<number> {
    let pesoTotal = 0;

    const lstRespuestaSeleccionada: Trespuestaseleccionada[] = await getConnection()
      .createQueryBuilder()
      .select('Trespuestaseleccionada')
      .from(Trespuestaseleccionada, 'Trespuestaseleccionada')
      .where(
        'Trespuestaseleccionada.idtipoperfil = :idtipoperfil and Trespuestaseleccionada.idproveedor = :idproveedor',
        {
          idtipoperfil: idPerfil,
          idproveedor: idProvider,
        }
      )
      .getMany();
    // console.log('pesoooooTooootaaaalXXXXXX', lstRespuestaSeleccionada);
    pesoTotal = await QueryProv.obtenerPeso(lstRespuestaSeleccionada);

    return +pesoTotal;
  }
}

interface PesosPerfiles {
  empresarial: string;
  financiero: string;
  operativo: string;
  comercial: string;
  documental: string;
  filename: string;
  path: string;
  total: number;
}

export default ProveedorController;
