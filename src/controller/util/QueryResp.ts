import { getConnection } from "typeorm";
import { Tcatalogocategoria } from "../../entities/Tcatalogocategoria";
import { Tpregunta } from "../../entities/Tpregunta";
import { Trespuesta } from "../../entities/Trespuesta";
import { Ttipoperfil } from "../../entities/Ttipoperfil";
import { Parameter } from "../../models/responsable/parameter";
import { Vw_financiero_total } from "../../entities/VW_FINANCIERO_TOTALES";

class QueryResp {
  static async getComercialPregunta(perfil): Promise<Parameter[]> {
    const lstTEntidad = await QueryResp.getTcomercialPregunta(perfil);

    const lstEntidad: Parameter[] = [];

    lstTEntidad.forEach((element) => {
      let parameter = new Parameter();

      parameter.id = element.id;
      parameter.code = element.codigo;
      parameter.name = element.nombre;

      lstEntidad.push(parameter);
    });

    return lstEntidad;
  }
  //getComercialRespuesta

  static async getComercialRespuesta(perfil): Promise<Parameter[]> {
    const lstTEntidad = await QueryResp.getTcomercialRespuesta(perfil);

    console.log("lstTEntidad", lstTEntidad);

    const lstEntidad: Parameter[] = [];

    lstTEntidad.forEach((element) => {
      let parameter = new Parameter();

      parameter.id = element.id;
      parameter.code = element.codigo;
      parameter.name = element.nombre;

      lstEntidad.push(parameter);
    });

    return lstEntidad;
  }

  static async getEntity(entidad): Promise<Parameter[]> {
    const lstTEntidad = await QueryResp.getTentidad(entidad);

    const lstEntidad: Parameter[] = [];

    lstTEntidad.forEach((element) => {
      let parameter = new Parameter();

      parameter.id = element.id;
      parameter.code = element.codigo;
      parameter.name = element.nombre;

      lstEntidad.push(parameter);
    });

    return lstEntidad;
  }

  static async getSumaDeRatios(entidad, idproveedor): Promise<number> {
    const lstTentidad = await QueryResp.getViewentidad(entidad, idproveedor);
    //console.log("vlstratiXXXXXXXX", lstTentidad);

    let acumulador = 0;

    lstTentidad.forEach((element: Vw_financiero_total) => {
      acumulador = acumulador + element.PORCENTAJE;
    });
    return acumulador;
  }

  static async getTcatalogoCategoria(): Promise<Tcatalogocategoria[]> {
    let lstTcatalogoCategoria: Tcatalogocategoria[] = [];

    lstTcatalogoCategoria = await getConnection()
      .createQueryBuilder()
      .select("Tcatalogocategoria")
      .from(Tcatalogocategoria, "Tcatalogocategoria")
      .where("Tcatalogocategoria.estado = :estado", {
        estado: true,
      })
      .getMany();

    return lstTcatalogoCategoria;
  }
  static async getTcomercialPregunta(perfil): Promise<any[]> {
    let tipoperfil: Ttipoperfil = await getConnection()
      .createQueryBuilder()
      .select("Ttipoperfil")
      .from(Ttipoperfil, "Ttipoperfil")
      .where("Ttipoperfil.estado = :estado and Ttipoperfil.nombre = :nombre", {
        estado: true,
        nombre: perfil,
      })
      .getOne();

    let lstTpregunta: Tpregunta[] = [];
    lstTpregunta = await getConnection()
      .createQueryBuilder()
      .select("Tpregunta")
      .from(Tpregunta, "Tpregunta")
      .where(
        "Tpregunta.estado = :estado and Tpregunta.idtipoperfil = :idtipoperfil1",
        {
          estado: true,
          idtipoperfil1: tipoperfil.id,
        }
      )
      .getMany();
    return lstTpregunta;
  }

  //

  static async getTcomercialRespuesta(perfil): Promise<any[]> {
    let lstTrespuesta1: any[] = [];
    const lstPregunta: any[] = await QueryResp.getTcomercialPregunta(perfil);

    for (const element of lstPregunta) {
      let lstRespuesta: any[] = await QueryResp.getTrespuesta(element);

      lstTrespuesta1.push.apply(lstTrespuesta1, lstRespuesta);
    }

    return lstTrespuesta1;
  }

  static async getTrespuesta(entidad): Promise<any[]> {
    let lstTrespuesta: any[] = [];
    lstTrespuesta = await getConnection()
      .createQueryBuilder()
      .select("Trespuesta")
      .from("Trespuesta", "Trespuesta")
      .where(
        "Trespuesta.estado = :estado and Trespuesta.idpregunta = :idpregunta",
        {
          estado: true,
          idpregunta: entidad.id,
        }
      )
      .getMany();
    return lstTrespuesta;
  }

  static async getTentidad(entidad): Promise<any[]> {
    let lstTentidad: any[] = [];
    lstTentidad = await getConnection()
      .createQueryBuilder()
      .select(entidad)
      .from(entidad, entidad)
      .where(entidad + ".estado = :estado", {
        estado: true,
      })
      .getMany();
    return lstTentidad;
  }

  static async getViewentidad(entidad, idproveedor): Promise<any[]> {
    let lstTentidad: any[] = [];
    lstTentidad = await getConnection()
      .createQueryBuilder()
      .select(entidad)
      .from(entidad, entidad)
      .where(entidad + ".estado = :estado and id_proveedor = :idproveedor", {
        estado: true,
        idproveedor: idproveedor,
      })
      .getMany();
    return lstTentidad;
  }
}

export default QueryResp;
