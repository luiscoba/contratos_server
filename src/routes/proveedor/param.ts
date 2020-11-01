import { Router } from 'express';
import ParamController from '../../controller/proveedor/ParamController';

const router = Router();

// getParameters
router.get('/', ParamController.getParameters);

export default router;
