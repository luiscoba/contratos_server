import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet'; // Ayuda a proteger las aplicaciones Express/Connect con varios encabezados HTTP.
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import routesProveedor from './routes/proveedor/index';
import routesResponsable from './routes/responsable/index';

const port = process.env.PORT || 3005;

createConnection()
  .then(async () => {
    // create express app
    const app = express();

    // middlewares
    app.use(cors());
    //const corsOptions = { origin: '*' };
    //app.use(cors(corsOptions));
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/proveedor-api/v1', routesProveedor);
    app.use('/responsable-api/v1', routesResponsable);

    // start express server
    // se crea el servidor para escuchar peticiones http
    app.listen(port, function () {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log('error', error));
