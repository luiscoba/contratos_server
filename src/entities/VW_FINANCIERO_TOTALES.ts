import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `SELECT "IDRATIO","IDPERFILFINANCIERO","ID_PROVEEDOR"
  ,"NOMBRERATIO"
  ,"ACTIVO"
  ,"PASIVO"
  ,"PATRIMONIO"
  ,"ACTIVO_CORRIENTE"
  ,"PASIVO_CORRIENTE"
  ,"UTILIDAD_NETA"
  ,"GASTOS"
  ,"CALCULORATIO"
  ,"PORCENTAJE"
  ,"estado"
FROM "VW_FINANCIERO_TOTALES"`,
  schema: 'Proveedores_test',
})

//@ViewEntity("VW_FINANCIERO_TOTALES", { schema: "Proveedores_test" })
export class Vw_financiero_total {
  @ViewColumn()
  IDRATIO: number;
  @ViewColumn()
  IDPERFILFINANCIERO: number;
  @ViewColumn()
  ID_PROVEEDOR: number;
  @ViewColumn()
  NOMBRERATIO: string;
  @ViewColumn()
  ACTIVO: number;
  @ViewColumn()
  PASIVO: number;
  @ViewColumn()
  ACTIVO_CORRIENTE: number;
  @ViewColumn()
  PASIVO_CORRIENTE: number;
  @ViewColumn()
  UTILIDAD_NETA: number;
  @ViewColumn()
  GASTOS: number;
  @ViewColumn()
  CALCULORATIO: number;
  @ViewColumn()
  PORCENTAJE: number;
  @ViewColumn()
  estado: boolean;
  // IDRATIO	IDPERFILFINANCIERO	NOMBRERATIO	ACTIVO	PASIVO	PATRIMONIO	ACTIVO_CORRIENTE	PASIVO_CORRIENTE	UTILIDAD_NETA	GASTOS	CALCULORATIO	PORCENTAJE
}
