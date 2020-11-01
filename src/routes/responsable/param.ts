import { Router } from 'express';
import { ParamController } from '../../controller/responsable/ParamController';

const upload = require('../../middlewares/uploadExcel.js');

const router = Router();

router.get('/getCountries', ParamController.getCountries);

// getAllParameters trae todos los archivos al responsable
router.get('/getAllParameters', ParamController.getAllParameters);

router.put(
  '/putSaveOrUpdateParameters/:entidad',
  ParamController.putSaveOrUpdateParameters
);

router.put(
  '/putSaveOrUpdateDataParameters/:nameDataParameter',
  ParamController.putSaveOrUpdateDataParameters
);

// para cargar desde archivo excel
router.post(
  '/uploadFileParameters',
  upload.single('file'),
  ParamController.saveParametersXLSX
);

export default router;
