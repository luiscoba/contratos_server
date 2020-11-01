import { Router } from 'express';
import SendMailController from '../../controller/util/sendMail/SendMailController';

const router = Router();

// sendMail
router.post('/sendMail/:correo', SendMailController.enviarCorreo);

// fogot-pass
router.post('/forgot-pass/', SendMailController.forgotPassword);

export default router;
