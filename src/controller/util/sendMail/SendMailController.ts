import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tusuariosistema } from '../../../entities/Tusuariosistema';
import UserController from '../../proveedor/UserController';
import Util from '../Util';
import GetTokenGraph from './GetTokenGraph';
import SendMailGraph from './SendMailGraph';

class SendMailController {
  static enviarCorreo = async (
    req: Request,
    res: Response
  ): Promise<string> => {
    const { correo } = req.params;
    const { cadenaAleatoria, usuario } = req.body; // desde UserController se agrega al body la cadenaAleatoria

    let getTokenGraph = new GetTokenGraph();
    let sendMailGraph = new SendMailGraph();

    try {
      await getTokenGraph.getToken().then(async (access_token) => {
        if (access_token) {
          let dataResponse;
          //console.log('entra a access token');
          await sendMailGraph
            .sendMail(access_token, correo, usuario, cadenaAleatoria)
            .then((data) => {
              dataResponse = data;
              // console.log('data llegaaaaaaa', data);
              if (data === 'OK') {
                res.status(200).json({ message: 'Mail successfully sent!' });
              } else {
                console.log('error en el metodo: sendMail', data);
                res
                  .status(400)
                  .json({ message: 'Error when trying to send mail :(' });
              }
            });
          return 'va el er1' + dataResponse;
        } else {
          res
            .status(400)
            .json({ message: 'Error when trying to get graph token :(' });
        }
      });
    } catch (e) {
      return 'va el er2';
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { correo } = req.body;
    // ============   VALIDAMOS si existe el correo para enviarle una clave temporal
    let userQuery: Tusuariosistema;
    const userRepository = getRepository(Tusuariosistema);

    try {
      userQuery = await userRepository.findOne({ correo: correo });
      console.log('userQuery', userQuery);
      if (userQuery == undefined) {
        // no existe el usuario
        return res.status(200).json({ message: 'Correo does not exist' });
      } else {
        const usuario = userQuery.nombre + ' ' + userQuery.apellidos;
        const clavealeatoria: string = Util.cadenaAleatoria(4);
        userQuery.clavetemporal = clavealeatoria;
        userQuery.usaclavetemporal = true;
        // se encripta la clave
        userQuery.hashPasswordTemporal();
        // se guarda el usuario
        await userRepository.save(userQuery);

        // enviamos al correo la cadena aleatoria
        UserController.enviarClaveTemporal(correo, usuario, clavealeatoria);
        // SOLO EN ESTE CASO ES VÁLIDO ENVIAR EL CORREO
        return res.status(200).json({ correo });
      }
    } catch (e) {
      return res.status(409).json({ message: 'forgotPassword ' + e });
    }
  };
}
export default SendMailController;
