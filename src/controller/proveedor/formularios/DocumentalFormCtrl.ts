import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tdocumento } from '../../../entities/Tdocumento';
import { Tdocumentoperfildocumental } from '../../../entities/Tdocumentoperfildocumental';
import { Tperfildocumental } from '../../../entities/Tperfildocumental';
import { Tproveedor } from '../../../entities/Tproveedor';
import { DocumentalDto } from '../../../models/proveedor/dto/DocumentalDto';
import {
  ParamDocumento,
  ParamDocumentoPerfilDocumental,
} from '../../../models/proveedor/parameters';
import QueryProv from '../../util/QueryProv';
import Util from '../../util/Util';

const path = require('path');
const fs = require('fs');

const upload = require('../../../middlewares/upload');

class DocumentalFormCtrl {
  static multipleUpload = async (req, res) => {
    const { idProvider } = res.locals.jwtPayload;
    const idDocumento = req.query.idDocumento;

    console.log('aqui llega req.query.idDocumento ', req.query.idDocumento);
    console.log('reqqqqqqqqqqqqqqq', req.files);

    let perfilDocumental: Tperfildocumental = new Tperfildocumental();
    perfilDocumental = await QueryProv.getPerfilDocumental(idProvider);

    try {
      if (!perfilDocumental) {
        perfilDocumental = await DocumentalFormCtrl.saveFirstPerfilDocumental(
          idProvider
        );
      }

      console.log('perfilDocumental', perfilDocumental);

      const proveedor: Tproveedor = await QueryProv.getProveedor(idProvider);
      proveedor.idperfildocumental = perfilDocumental.id;

      const proveedorRepository = getRepository(Tproveedor);
      await proveedorRepository.save(proveedor);

      // guardamos el archivo
      await upload(req, res);

      if (req.files.length <= 0) {
        return res.send(`You must select at least 1 file.`);
      }

      console.log('req.files', req.files);

      DocumentalFormCtrl.saveDocumental(
        idProvider,
        perfilDocumental.id,
        idDocumento,
        req.files
      );

      return res.send(`Files has been uploaded.`);
    } catch (error) {
      console.log(error);

      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.send('Too many files to upload.');
      }
      return res.send(`Error when trying upload many files: ${error}`);
    }
  };

  static deleteFolderIfExist = async (
    idProvider: number,
    idDocumento: number
  ) => {
    // eliminamos la carpeta, si es que existe
    let idDocumentoPath = path.join(
      __dirname,
      `../../../../uploads/${idProvider}-idProvider/${idDocumento}-idDocumento`
    );

    let perfildocumental: Tperfildocumental = new Tperfildocumental();

    if (fs.existsSync(idDocumentoPath)) {
      console.log('Directory exists.');

      let files = fs.readdirSync(idDocumentoPath);

      for (const file of files) {
        fs.unlinkSync(path.join(idDocumentoPath, file));
      }
      perfildocumental = await QueryProv.getPerfilDocumental(idProvider);
    } else {
      perfildocumental = await DocumentalFormCtrl.saveFirstPerfilDocumental(
        idProvider
      );
    }

    return perfildocumental;
  };

  static saveFirstPerfilDocumental = async (
    idProvider
  ): Promise<Tperfildocumental> => {
    const correoQuery: string = (await QueryProv.getUsuarioSistema(idProvider))
      .correo;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let perfildocumental = await QueryProv.getPerfilDocumental(idProvider);

    if (!perfildocumental) perfildocumental = new Tperfildocumental();

    try {
      perfildocumental.fecharegistro = Util.fechaActual();
      perfildocumental.estado = true;
      perfildocumental.responsable = correoQuery;

      perfildocumental = await queryRunner.manager.save(perfildocumental);

      await queryRunner.commitTransaction();

      return perfildocumental;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  static getDocumentalDto = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    const providerRepository = getRepository(Tproveedor);
    const providerQuery: Tproveedor = await providerRepository.findOne({
      id: idProvider,
    });

    console.log('providerQuerysss', providerQuery);

    const documentalDto: DocumentalDto = new DocumentalDto();

    if (providerQuery.idperfildocumental) {
      const perfilDocumental: Tperfildocumental = await QueryProv.getPerfilDocumental(
        idProvider
      );
      console.log('perfilDocumental vcvcvcv', perfilDocumental);

      let lstDocumentos: Tdocumento[] = await QueryProv.getDocumento();
      //console.log('t lstDocumentos ->->->', lstDocumentos);
      const lstParamDocumento: ParamDocumento[] = [];

      if (perfilDocumental) {
        let lstDocumentoPerfilDocumental: Tdocumentoperfildocumental[] = await QueryProv.DocumentoPerfilDocumentalByIdPerfilDocumental(
          perfilDocumental.id
        );
        let lstParamDocumentoPerfilDocumentalDto: ParamDocumentoPerfilDocumental[] = [];

        for (let element of lstDocumentoPerfilDocumental) {
          let paramDocumentoPerfilDocumental: ParamDocumentoPerfilDocumental = new ParamDocumentoPerfilDocumental();

          let nombreSinFechaProv = element.nombre.split('-')[2];

          paramDocumentoPerfilDocumental.id = element.id;
          paramDocumentoPerfilDocumental.iddocumento = element.iddocumento;
          paramDocumentoPerfilDocumental.name = nombreSinFechaProv;
          paramDocumentoPerfilDocumental.size = element.tamanio;

          lstParamDocumentoPerfilDocumentalDto.push(
            paramDocumentoPerfilDocumental
          );
        }
        //console.log(      't lstDocumentoPerfilDocumental ->->->',      lstDocumentoPerfilDocumental    );
        for (let documento of lstDocumentos) {
          let paramDocumento: ParamDocumento = new ParamDocumento();
          paramDocumento.id = documento.id;
          console.log('documento', documento);
          let found = lstParamDocumentoPerfilDocumentalDto.filter(
            (element) => element.iddocumento === documento.id
          );
          console.log('found', found);
          if (found) {
            paramDocumento.lstDocumentoPerfilDocumental = found;
          }
          lstParamDocumento.push(paramDocumento);
        }

        console.log('lstParamDocumento', lstParamDocumento);

        documentalDto.lstDocumento = lstParamDocumento;
      } else {
      }
    } else {
      // se registra la primera vez que ingresa a perfil documental, se genera el id de perfilDocumental
      let perfilDocumental = new Tperfildocumental();
      const perfilDocumentalRepository = getRepository(Tperfildocumental);

      const correoQuery: string = (
        await QueryProv.getUsuarioSistema(providerQuery.id)
      ).correo;

      perfilDocumental.estado = true;
      perfilDocumental.fecharegistro = Util.fechaActual();
      perfilDocumental.responsable = correoQuery;

      perfilDocumental = await perfilDocumentalRepository.save(
        perfilDocumental
      );

      providerQuery.idperfildocumental = perfilDocumental.id;
      await providerRepository.save(providerQuery);
    }

    console.log('documentalDtooooo', documentalDto);

    return res.status(202).json(documentalDto);
  };

  static downloadDocumento = async (req: Request, res: Response) => {
    const { idDocumentoPerfilDocumental } = req.params;

    const file = await DocumentalFormCtrl.getDocumentoPerfilDocumentalById(
      +idDocumentoPerfilDocumental
    );

    res.download(file.ruta + '/' + file.nombre);
  };

  static removeDocumento = async (req: Request, res: Response) => {
    const { idDocumentoPerfilDocumental } = req.params;
    const id = idDocumentoPerfilDocumental;

    console.log('llega el id', idDocumentoPerfilDocumental);

    if (idDocumentoPerfilDocumental !== 'undefined') {
      try {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(Tdocumentoperfildocumental)
          .where('id = :id', {
            id: id,
          })
          .execute();

        res.status(201).send({ message: 'ok' });
      } catch (e) {
        res.status(400).send({
          message: 'ocurrio error al intentar eliminar documento ' + e,
        });
      }
    }
    res.status(201).send({ message: 'ok' });
  };

  static async getDocumentoPerfilDocumentalById(
    id: number
  ): Promise<Tdocumentoperfildocumental> {
    const documentoperfildocumental: Tdocumentoperfildocumental = await getConnection()
      .createQueryBuilder()
      .select('Tdocumentoperfildocumental')
      .from(Tdocumentoperfildocumental, 'Tdocumentoperfildocumental')
      .where(
        'Tdocumentoperfildocumental.id = :id and Tdocumentoperfildocumental.estado = :estado',
        {
          id: id,
          estado: true,
        }
      )
      .getOne();

    return documentoperfildocumental;
  }

  static saveDocumental = async (
    idProvider,
    idPerfilDocumental,
    idDocumento,
    lstFiles
  ) => {
    console.log('lstFiles', lstFiles);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const correoQuery: string = (await QueryProv.getUsuarioSistema(idProvider))
      .correo;

    try {
      for (let element of lstFiles) {
        let documentoperfildocumental: Tdocumentoperfildocumental = new Tdocumentoperfildocumental();

        documentoperfildocumental.idperfildocumental = idPerfilDocumental;
        documentoperfildocumental.iddocumento = idDocumento;
        documentoperfildocumental.nombre = element.filename;
        documentoperfildocumental.tamanio = element.size;
        documentoperfildocumental.ruta = element.destination;
        documentoperfildocumental.fecharegistro = Util.fechaActual();
        documentoperfildocumental.estado = true;
        documentoperfildocumental.responsable = correoQuery;

        await queryRunner.manager.save(documentoperfildocumental);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('entra en el catch');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }; 
}

interface Archivo {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export default DocumentalFormCtrl;
