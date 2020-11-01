import { Request, Response } from 'express';
import { getRepository, Entity, getConnection } from 'typeorm';
import { Parameter } from '../../models/responsable/parameter';
import QueryResp from '../util/QueryResp';

const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

// __dirname para ver el directorio actual
const RUTA_FOLDER_PARAMETERS = __dirname + '/parameters'; // archivos json
const RUTA_UPLOAD = process.cwd() + process.env.RUTA_UPLOAD;

export class ParamController {
  static getCountries = (req: Request, res: Response) => {
    // console.log('__dirname', __dirname);
    try {
      let rawdata = fs.readFileSync(
        __dirname + '/parameters/ciudades.json',
        'utf8'
      );
      let student = JSON.parse(rawdata);
      console.log(student);
      res.send(student);
    } catch (e) {
      res.status(404).json({ message: 'Not result' + e });
    }
  };

  static putSaveOrUpdateDataParameters = (req: Request, res: Response) => {
    // almacenamos en JSON
    const { nameParameter } = req.params;
    const bodyDataParameter: any = req.body;

    if (!bodyDataParameter) {
      res.status(400).json({ message: 'DataParameter are requerid!' });
    }
    //console.log('bodyDataParameter', bodyDataParameter);
    let dataParameter = JSON.stringify(bodyDataParameter);
    try {
      fs.writeFile(
        __dirname + `/parameters/${nameParameter}.json`,
        dataParameter,
        (err) => {
          if (err) throw err;
          console.log(`The file ${nameParameter}.json has been saved!`);
          res.status(200).json({
            message: `File ${nameParameter}.json saved successfully`,
          });
        }
      );
    } catch (e) {
      res.status(404).json({ message: 'Not result' + e });
    }
  };

  static putSaveOrUpdateParameters = async (req: Request, res: Response) => {
    let { entidad } = req.params;
    const registro: Parameter = req.body;

    if (entidad == 'detalle') {
      entidad = 'catalogocategoria';
    }

    console.log('entidad', entidad);
    console.log('registro', registro);

    if (!registro) {
      res.status(400).json({ message: 'DataParameter are requerid!' });
    }

    var Tentidad = 'T' + entidad.toString();

    try {
      ParamController.crudRecord(Tentidad, registro);
    } catch (e) {
      res.status(404).json({ message: 'Not result' + e });
    }
  };

  static crudRecord = async (Tentidad, record: Parameter) => {
    const repository = getRepository(Tentidad);

    let firstRecord: any;

    if (record.action === 'Actualizar') {
      firstRecord = await repository.findOne({ id: record.id });
      firstRecord.nombre = record.name;
      firstRecord.codigo = record.code;

      await repository.save(firstRecord);
    } else if (record.action === 'Eliminar') {
      firstRecord = await repository.findOne({ id: record.id });
      firstRecord.estado = false;
      await repository.save(firstRecord);
    } else if (record.action === 'Agregar') {
      //firstRecord.estado = true;
      await ParamController.saveAddRegistro(Tentidad, record);

      //  await repository.save(firstRecord);
    }
  };

  static saveAddRegistro = async (entidad, registro: Parameter) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let newEntidad: any = await getConnection()
        .createQueryBuilder()
        .select(entidad)
        .from(entidad, entidad)
        .where(entidad + '.estado = :estado', {
          estado: true,
        })
        .getOne();

      newEntidad.id = null;
      newEntidad.nombre = registro.name;
      newEntidad.codigo = registro.code;

      console.log('NEWENTIDAD_AKI', newEntidad);

      await queryRunner.manager.save(newEntidad);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('entra en el catch');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getAllParameters = async (req: Request, res: Response) => {
    let lstParameterDto: any = [];
    try {
      lstParameterDto = await ParamController.getEntities();

      console.log('lstParameterDto ', lstParameterDto);
      res.send(lstParameterDto);
    } catch (e) {
      res.status(404).json({ message: 'Not result' + e });
    }
  };

  static getAllParameters1 = (req: Request, res: Response) => {
    let lstFilesJson = {};
    try {
      // leemos todos los archivos que estan en RUTA_FOLDER
      fs.readdir(RUTA_FOLDER_PARAMETERS, function (err, archivos) {
        if (err) {
          Error(err);
          return;
        }
        archivos.forEach((element) => {
          //console.log(element);
          let rawData = fs.readFileSync(
            RUTA_FOLDER_PARAMETERS + '/' + element,
            'utf8'
          );
          let jsonData = JSON.parse(rawData);
          lstFilesJson[element] = jsonData;
        });
        //console.log('lstFilesJson ', lstFilesJson);
        res.send(lstFilesJson);
      });
    } catch (e) {
      res.status(404).json({ message: 'Not result' + e });
    }
  };

  static async getEntities(): Promise<any[]> {
    let lstParameterDto: any = [];

    const lstActividad: Parameter[] = await QueryResp.getEntity('Tactividad');
    const lstCategoria: Parameter[] = await QueryResp.getEntity('Tcategoria');
    const lstCatalogocategoria: Parameter[] = await QueryResp.getEntity(
      'Tcatalogocategoria'
    );
    const lstTipopersona: Parameter[] = await QueryResp.getEntity(
      'Ttipopersona'
    );
    const lstTipoproveedor: Parameter[] = await QueryResp.getEntity(
      'Ttipoproveedor'
    );
    const lstTipocontribuyente: Parameter[] = await QueryResp.getEntity(
      'Ttipocontribuyente'
    );

    //Contacto
    const lstPais: Parameter[] = await QueryResp.getEntity('Tpais');
    const lstProvincia: Parameter[] = await QueryResp.getEntity('Tprovincia');
    const lstCanton: Parameter[] = await QueryResp.getEntity('Tcanton');
    const lstParroquia: Parameter[] = await QueryResp.getEntity('Tparroquia');

    //Comercial
    const lstComercialPregunta: Parameter[] = await QueryResp.getComercialPregunta(
      'Comercial'
    );
    const lstComercialRespuesta: Parameter[] = await QueryResp.getComercialRespuesta(
      'Comercial'
    );

    const lstOperativoPregunta: Parameter[] = await QueryResp.getComercialPregunta(
      'Operativo'
    );
    const lstOperativoRespuesta: Parameter[] = await QueryResp.getComercialRespuesta(
      'Operativo'
    );

    //Documental
    const lstDocumento: Parameter[] = await QueryResp.getEntity('Tdocumento');
    //Financiero
    const lstCuenta: Parameter[] = await QueryResp.getEntity('Tcuenta');
    const lstTiporatio: Parameter[] = await QueryResp.getEntity('Ttiporatio');

    lstParameterDto = {
      //seccion Identificacion
      Identificacion_Actividad: lstActividad,
      Identificacion_Categoria: lstCategoria,
      Identificacion_Detalle: lstCatalogocategoria,
      Identificacion_Tipopersona: lstTipopersona,
      Identificacion_Tipoproveedor: lstTipoproveedor,
      Identificacion_Tipocontribuyente: lstTipocontribuyente,

      //Seccion contacto
      Contacto_Pais: lstPais,
      Contacto_Provincia: lstProvincia,
      Contacto_Canton: lstCanton,
      Contacto_Parroquia: lstParroquia,

      // Comercial
      Comercial_Preguntas: lstComercialPregunta,
      Comercial_Respuesta: lstComercialRespuesta,

      Operativo_Preguntas: lstOperativoPregunta,
      Operativo_Respuesta: lstOperativoRespuesta,

      //Documental
      Documental_documentos: lstDocumento,
      // Financiero
      Financiero_cuentas: lstCuenta,
      Financiero_tiporatio: lstTiporatio,
    };

    return lstParameterDto;
  }

  // sacado de https://bezkoder.com/node-js-upload-excel-file-database/
  static saveParametersXLSX = (req, res: Response) => {
    try {
      console.log('reqsssssss', req);

      if (req.file == undefined) {
        return res.status(400).send('Please upload an excel file!');
      }
      // IMPORTANTE SOLO SE SUBEN ARCHIVOS .xlsx
      let path = RUTA_UPLOAD + req.file.filename;

      console.log('pathxxx', path);

      readXlsxFile(path).then((rows) => {
        console.log('rows', rows);
        // skip header
        rows.shift(); // salta la cabecera

        let tutorials = [];

        rows.forEach((row) => {
          console.log('row', row);
          /*let tutorial = {
          id: row[0],
          title: row[1],
          description: row[2],
          published: row[3],
        };

        tutorials.push(tutorial);
        */
        });

        /*Tutorial.bulkCreate(tutorials)
        .then(() => {
          res.status(200).send({
            message: 'Uploaded the file successfully: ' + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: 'Fail to import data into database!',
            error: error.message,
          });
        });
       */
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Could not upload the file: ' + req.file.originalname,
      });
    }
  };
}
