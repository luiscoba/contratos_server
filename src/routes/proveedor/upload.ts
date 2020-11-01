import { Router } from 'express';
import Upload from '../../controller/util/Upload';

const router = Router();

// upload
router.post('/upload-one/', Upload.oneDrive);

export default router;
