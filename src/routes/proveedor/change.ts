import { Router } from 'express';
import ChangeController from '../../controller/proveedor/ChangeController';
import { checkJwt } from '../../middlewares/verifyjwt';

const router = Router();

// Change password
router.put('/', [checkJwt], ChangeController.changePass);

export default router;
