import { Request, Response } from 'express';
import { PerfilUsuarioDenarius } from '../../models/responsable/PerfilUsuarioDenarius';
import { ValidarUsuarioDenarius } from '../../models/responsable/ValidarUsuarioDenarius';

const axios = require('axios').default;
const https = require('https');

const baseURL = 'https://192.168.29.4:4431/bus29/ServiciosSeguridades';

class DenariusController {
  static validarUsuario = async (req: Request, res: Response) => {
    const headers = {
      aplicacioncliente: 'Canal29',
      nombreservicio: 'ServiciosSeguridades',
      aplicacionservidor: 'Denarius',
      nombreClase: 'ValidarUsuario',
      nombreMetodo: 'meConsulta',
      nombreSubMetodo: '',
      'Content-Type': 'application/json',
    };

    const { loginUsuario } = req.params;

    var body = JSON.stringify({
      ServiciosSeguridades: {
        ValidarUsuario: {
          meConsulta: {
            LoginUsuario: loginUsuario,
          },
        },
      },
    });
    //const body = req.body; // tambien se puede neviar por el body
    const config = {
      method: 'post', // denarius recibe una peticion POST
      url: baseURL,
      headers: headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      data: body, // se puede reemplazar por 'data' para pruebas
    };

    let validarUsuarioDenarius: ValidarUsuarioDenarius;

    try {
      axios(config)
        .then(async function (response) {
          validarUsuarioDenarius = await response.data;
          //console.log(JSON.stringify(response.data));
          res.send(validarUsuarioDenarius);
        })
        .catch(function (error) {
          //console.log(error);
          return res.status(400).json({ message: 'Error ' + error });
        });
    } catch (e) {
      return res.status(400).json({ message: 'validarUsuario ' + e });
    }
  };

  static perfilUsuario = async (req: Request, res: Response) => {
    const headers = {
      aplicacioncliente: 'Canal29',
      nombreservicio: 'ServiciosSeguridades',
      aplicacionservidor: 'Denarius',
      nombreClase: 'ConsultarPerfilesUsuario',
      nombreMetodo: 'meConsulta',
      nombreSubMetodo: '',
      'Content-Type': 'application/json',
    };

    const { usuario } = req.params;

    var body = JSON.stringify({
      ServiciosSeguridades: {
        ConsultarPerfilesUsuario: {
          meConsulta: {
            Usuario: usuario,
          },
        },
      },
    });
    //const body = req.body; // tambien se puede neviar por el body
    const config = {
      method: 'post', // denarius recibe una peticion POST
      url: baseURL,
      headers: headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      data: body, // se puede reemplazar por 'data' para pruebas
    };

    let perfilUsuarioDenarius: PerfilUsuarioDenarius;

    try {
      axios(config)
        .then(async function (response) {
          perfilUsuarioDenarius = await response.data;
          res.send(perfilUsuarioDenarius);
        })
        .catch(function (error) {
          //console.log(error);
          return res.status(400).json({ message: 'perfilUsuario ' + error });
        });
    } catch (e) {
      return res.status(400).json({ message: 'perfilUsuario ' + e });
    }
  };
}
export default DenariusController;
