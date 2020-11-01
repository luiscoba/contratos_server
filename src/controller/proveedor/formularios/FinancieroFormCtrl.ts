import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Tperfilfinanciero } from "../../../entities/Tperfilfinanciero";
import { Ttipopersona } from "../../../entities/Ttipopersona";
import { FinancieroDto } from "../../../models/proveedor/dto/FinancieroDto";
import QueryProv from "../../util/QueryProv";
import { ParamPerfilFinanciero } from "../../../models/proveedor/parameters";

class FinancieroFormCtrl {
  static getFinancieroDto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    console.log("req.body llega financiero", req.body);

    const financieroDto: FinancieroDto = new FinancieroDto();

    const perfilFinanciero: Tperfilfinanciero = await QueryProv.getPerfilFinanciero(
      idProvider
    );

    console.log("perfilFinancieroccccc", perfilFinanciero);

    const tipopersona: Ttipopersona = await QueryProv.getTipoPersona(
      idProvider
    );

    if (tipopersona) {
      console.log("tipopersona rrrr", tipopersona);
      const d = new Date();
      financieroDto.anioActual = d.getFullYear();
      financieroDto.idTipoPersona = tipopersona.id;
      financieroDto.tipoPersona = tipopersona.nombre;

      const lstCuentaPerfilFinanciero = await QueryProv.getLstCuentaPerfilFinanciero(
        idProvider
      );
      console.log("lstCuentaPerfilFinanciero", lstCuentaPerfilFinanciero);

      let lstParamPerfilFinanciero: ParamPerfilFinanciero[] = [];
      if (lstCuentaPerfilFinanciero.length > 0) {
        lstCuentaPerfilFinanciero.forEach((cuentaPerfilFinanciero) => {
          let paramPerfilFinanciero = new ParamPerfilFinanciero();

          paramPerfilFinanciero.idcuenta = cuentaPerfilFinanciero.idcuenta;
          paramPerfilFinanciero.resultadoPenultimo = +cuentaPerfilFinanciero.resultadoaniopenultimo;
          paramPerfilFinanciero.resultadoUltimo = +cuentaPerfilFinanciero.resultadoanioultimo;

          lstParamPerfilFinanciero.push(paramPerfilFinanciero);
        });
      }

      financieroDto.lstCuentas = lstParamPerfilFinanciero;
    }

    return res.status(202).json(financieroDto);
  };

  static updateFinanciero = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    let { idcuenta, resultadoPenultimo, resultadoUltimo } = req.body;

    console.log("ha llegado req.body", req.body);

    // agregamos 2 ceros como decimal
    resultadoPenultimo = "" + parseFloat(resultadoPenultimo).toFixed(2);
    resultadoUltimo = "" + parseFloat(resultadoUltimo).toFixed(2);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let perfilfinanciero: Tperfilfinanciero = await QueryProv.getPerfilFinanciero(
        idProvider
      );

      console.log("perfilfinancieroxxx--->>>>", perfilfinanciero);

      const cuentaPerfilFinanciero = await QueryProv.getCuentaPerfilFinanciero(
        idProvider,
        idcuenta
      );

      console.log("cuentaPerfilFinanciero antes", cuentaPerfilFinanciero);

      cuentaPerfilFinanciero.resultadoaniopenultimo = resultadoPenultimo;
      cuentaPerfilFinanciero.resultadoanioultimo = resultadoUltimo;

      /*         let pesoTotal: number = await QueryProv.obtenerPesoPorRatioFinanciero(
          
         ); */

      //  cuentaPerfilFinanciero.peso = resultadoUltimo;

      console.log("cuentaPerfilFinanciero xxxxxxwwwww", cuentaPerfilFinanciero);

      await queryRunner.manager.save(cuentaPerfilFinanciero);

      await queryRunner.commitTransaction();

      return res.status(202).json(cuentaPerfilFinanciero);
    } catch (err) {
      console.log("entra en el catch", err);
      await queryRunner.rollbackTransaction();
      return res.status(400).json("Cant save financiero natural");
    } finally {
      await queryRunner.release();
    }
  };
}
export default FinancieroFormCtrl;
