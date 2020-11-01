import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tusuariosistema } from '../../entities/Tusuariosistema';
import UtilQuery from '../util/QueryProv';

class ChangeController {
  static changePass = async (req: Request, res: Response) => {
    const { clave } = req.body;
    console.log('req.bodyyy', req.body);
    console.log('clavee', clave);
    const { idProvider } = res.locals.jwtPayload;

    console.log('idProviderdd', idProvider);

    let userQuery: Tusuariosistema = await UtilQuery.getUsuarioSistema(
      idProvider
    );

    console.log('userQuery dd', userQuery);

    try {
      const userRepository = getRepository(Tusuariosistema);
      userQuery.clave = clave;
      userQuery.usaclavetemporal = false;
      userQuery.clavetemporal = null;
      // se encripta la clave
      userQuery.hashPassword();
      // se guarda el usuario
      await userRepository.save(userQuery);
      // send response
      res.status(202).send(new Boolean(true));
    } catch (e) {
      return res.status(409).json({ message: 'Password is requerid ' + e });
    }
  };
}

export default ChangeController;
