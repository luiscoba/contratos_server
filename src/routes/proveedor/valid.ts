import { Router } from 'express';
import ValidProvController from '../../controller/proveedor/ValidController';
import { checkJwt } from '../../middlewares/verifyjwt';

const router = Router();

// Validate-email
router.get('/:email', ValidProvController.validateEmailUser);

// Validate-pass
router.post('/', [checkJwt], ValidProvController.validatePassword);

export default router;
