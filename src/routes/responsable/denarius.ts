import { Router } from 'express';
import DenariusController from '../../controller/responsable/DenariusController';

const router = Router();

// oficina de usuario en denarius
router.get('/oficina/:loginUsuario', DenariusController.validarUsuario);
// perfil de usuario en denarius
router.get('/perfil/:usuario', DenariusController.perfilUsuario);

export default router;
