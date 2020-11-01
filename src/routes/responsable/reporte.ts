import { Router } from 'express';
import ReporteController from '../../controller/responsable/ReporteController';

const router = Router();

router.post('/upload_buro', ReporteController.multipleUpload);

router.post('/save-calificacion', ReporteController.saveCalificacion);

export default router;
