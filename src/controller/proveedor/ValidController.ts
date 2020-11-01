import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tusuariosistema } from '../../entities/Tusuariosistema';
import UtilQuery from '../util/QueryProv';

class ValidController {
  static validateEmailUser = async (req: Request, res: Response) => {
    const { email } = req.params;

    console.log('que llega email', email);

    const userRepository = getRepository(Tusuariosistema);

    let user: Tusuariosistema;
    let data: number = 1; // retorna 1 si existe el correo
    try {
      user = await userRepository.findOne({ correo: email });

      if (!user) data = 0; // retorna 0 cuando no existe el correo
    } catch (e) {
      data = 0; // retorna 0 cuando no existe el correo
    }
    // Send response
    res.send(new Number(data));
  };

  static validatePassword = async (req: Request, res: Response) => {
    const { clave } = req.body;
    const { idProvider } = res.locals.jwtPayload;

    let userQuery: Tusuariosistema = await UtilQuery.getUsuarioSistema(
      idProvider
    );

    if (!userQuery) {
      // si la consulta me devuelve undefined
      return res.status(409).json({ message: 'Usuario does not exist! ' });
    }

    if (userQuery.usaclavetemporal) {
      if (userQuery.checkPasswordTemporal(clave)) {
        res.status(201).send(new Boolean(true));
      } else {
        res.status(201).send(new Boolean(false));
      }
    } else {
      if (userQuery.checkPassword(clave)) {
        res.status(201).send(new Boolean(true));
      } else {
        res.status(201).send(new Boolean(false));
      }
    }
  };
}

export default ValidController;
