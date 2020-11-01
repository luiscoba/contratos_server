import { Router } from 'express';
import denarius from '../responsable/denarius';
import param from '../responsable/param';
import proveedor from '../responsable/proveedor';
import reporte from '../responsable/reporte';

const routes = Router();

routes.use('/parameters', param);

routes.use('/denarius', denarius);

routes.use('/proveedor', proveedor);

routes.use('/reporte', reporte);

export default routes;
