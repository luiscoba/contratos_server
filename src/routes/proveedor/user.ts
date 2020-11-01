import { Router } from 'express';
import UserProvController from '../../controller/proveedor/UserController';

const router = Router();
// Create a new user
router.post('/', UserProvController.newUser);
// Edit user, se usa patch porque actualiza, en cambio PUT actualiza, pero crea el recurso en el caso de no encontrarlo
router.patch('/', UserProvController.editUser);

export default router;
