import { Router } from 'express';
import auth from './auth';
import change from './change';
import find from './find';
import form from './form';
import param from './param';
import send from './send';
import user from './user';
import valid from './valid';

const routes = Router();

routes.use('/users', user);

routes.use('/users/change-pass', change);

routes.use('/users/find-user', find);

// este metodo controla el campo 'correo', si un email existe desde el formulario 'registro'
routes.use('/valid/validate-email', valid);

routes.use('/valid/validate-pass', valid);

routes.use('/auth', auth);

// envio de correos
routes.use('/process', send);

// formularios
routes.use('/forms', form);

// obtencion de los parámetros del sistema
routes.use('/process/get-param', param);

// upload OneDrive
//routes.use('/upload', Upload);

export default routes;
