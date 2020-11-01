import { Router } from 'express';
import ProveedorController from '../../controller/responsable/ProveedorController';

const router = Router();

router.get(
  '/prov-sin-calificar',
  ProveedorController.getProveedoresSinCalificar
);

router.get('/calificar/:idProvider', ProveedorController.calificaProveedor);

router.get(
  '/fechas-sin-calificar/:idProvider',
  ProveedorController.getFechasSinCalificar
);

export default router;
