import { Router } from 'express';
import FindController from '../../controller/proveedor/FindController';
import { checkJwt } from '../../middlewares/verifyjwt';

const router = Router();

// find-by-email
router.get('/:email', [checkJwt], FindController.findByEmail);

// find-usuario
router.get('/', [checkJwt], FindController.findUsuario);

export default router;
