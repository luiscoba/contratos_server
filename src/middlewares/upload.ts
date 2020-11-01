const util = require('util');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

import * as jwt from 'jsonwebtoken';

let idProvider, idDocumento;

var verifyFolderExist = async (
  idProvider: number,
  idDocumento: number
): Promise<any[]> => {
  let lstArchivos: any[] = [];

  try {
    let uploadsPath = path.join(__dirname, '../../uploads/');
    let providerPath = path.join(
      __dirname,
      `../../uploads/${idProvider}-idProvider`
    );
    let idDocumentoPath = path.join(
      __dirname,
      `../../uploads/${idProvider}-idProvider/${idDocumento}-idDocumento`
    );

    if (!fs.existsSync(`${providerPath}`)) {
      fs.mkdir(path.join(uploadsPath, `${idProvider}-idProvider`), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory 1 created successfully!');
      });

      fs.mkdir(path.join(providerPath, `${idDocumento}-idDocumento`), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory 2 created successfully!');
      });
    } else {
      if (!fs.existsSync(`${idDocumentoPath}`)) {
        fs.mkdir(
          path.join(providerPath, `${idDocumento}-idDocumento`),
          (err) => {
            if (err) {
              return console.error(err);
            }
            console.log('Directory 2 created successfully!');
          }
        );
      }
    }
  } catch (e) {
    console.log('An error occurred.');
  }

  return lstArchivos;
};

var setIdProviderIdDocumento = (req) => {
  idDocumento = req.query.idDocumento;

  const authHeader = req.headers.auth;
  const token = authHeader && authHeader.split(' ')[1];
  const jwtPayload = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || 'tokensecret'
  );

  idProvider = jwtPayload.idProvider;
};

// sacado de https://bezkoder.com/node-js-upload-multiple-files/
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    setIdProviderIdDocumento(req);

    callback(
      null,
      path.join(
        `${__dirname}/../../uploads/${idProvider}-idProvider/${idDocumento}-idDocumento`
      )
    );
  },
  filename: async (req, file, callback) => {
    let lstArchivos: any[] = [];

    lstArchivos = await verifyFolderExist(idProvider, idDocumento);

    var filename = `${Date.now()}-prov-${file.originalname}`; // aqui guarda el archivo en el servidor
    callback(null, filename);
  },
});

var uploadFiles = multer({ storage: storage }).array('multi-files', 10); // maximo 10 archivos en una subida
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
