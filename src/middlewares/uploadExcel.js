const multer = require('multer');

// devuelve un valor de cadena que es el directorio de trabajo actual del proceso Node.js.
const route_of_uploads =
  process.cwd() + process.env.RUTA_UPLOAD || '/src/assets/upload';

// https://bezkoder.com/node-js-upload-excel-file-database/
const excelFilter = (req, file, cb) => {
  console.log('entra a filter', file);

  if (
    file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml')
  ) {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, route_of_uploads);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-param-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;
