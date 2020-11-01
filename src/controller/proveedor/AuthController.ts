import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Tperfilsistema } from '../../entities/Tperfilsistema';
import { Tproveedor } from '../../entities/Tproveedor';
import { Tusuarioperfilsistema } from '../../entities/Tusuarioperfilsistema';
import { Tusuariosistema } from '../../entities/Tusuariosistema';

require('dotenv').config();

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log(' email, password', email, password);

    // validate
    if (!(email && password)) {
      res.status(400).json({ message: 'Email & password are requerid!' });
    }

    const userRepository = getRepository(Tusuariosistema);
    let userQuery: Tusuariosistema;

    try {
      userQuery = await userRepository.findOneOrFail({
        correo: email,
      });
    } catch (e) {
      console.log('AuthController e', e);
      return res
        .status(404)
        .json({ message: 'Email or password are incorrect!' });
    }

    const { esValida, usoTemp } = await AuthController.pasaLaRevisionDeClave(
      userQuery,
      password
    );

    if (esValida) {
      const providerRepository = getRepository(Tproveedor);

      let provider: Tproveedor = await providerRepository.findOne({
        idusuariosistema: userQuery.id,
      });

      const usuario = userQuery.nombre + ' ' + userQuery.apellidos;

      if (usoTemp) {
        const token = jwt.sign(
          { idProvider: provider.id, usuario, usoTemp: usoTemp },
          // ingreso introduciendo una clave temporal
          process.env.ACCESS_TOKEN_SECRET || 'tokensecret',
          { expiresIn: '1h' }
        );

        return res.json({ token: token });
      } else {
        const token = jwt.sign(
          { idProvider: provider.id, usuario, usoTemp: usoTemp },
          // ingreso introduciendo una clave temporal
          process.env.ACCESS_TOKEN_SECRET || 'tokensecret',
          { expiresIn: '1h' }
        );

        return res.json({ token: token });
      }
    } else {
      return res.status(400).json({ message: 'Password is invalid' });
    }
  };

  /*       res.json({ token: token });
  } else if (pasa === 'invalida') {
   
  } else if (pasa === 'caduco_clave_temporal') {
    const token = jwt.sign({ usoTemp: 'caduco_clave_temporal' });
*/

  static async pasaLaRevisionDeClave(
    userQuery: Tusuariosistema,
    password
  ): Promise<any> {
    console.log('userQueryyyyyy ', userQuery);

    if (userQuery.usaclavetemporal) {
      if (userQuery.checkPasswordTemporal(password)) {
        return { esValida: true, usoTemp: true }; // clave valida
      } else {
        if (userQuery.clave)
          if (userQuery.checkPassword(password)) {
            return { esValida: true, usoTemp: false }; // clave valida
          }
        return { esValida: false }; // clave invalida
      }
    } else {
      // Check password
      if (userQuery.checkPassword(password)) {
        return { esValida: true, usoTemp: false }; // clave valida
      } else {
        return { esValida: false }; // clave invavlida
      }
    }
  }

  static getProfileByEmail = async (email: string) => {
    const userRepository = getRepository(Tusuariosistema);
    let user: Tusuariosistema;
    const profileRepository = getRepository(Tperfilsistema);
    let profile: Tperfilsistema;
    const userprofileRepository = getRepository(Tusuarioperfilsistema);
    let userprofile: Tusuarioperfilsistema;

    try {
      user = await userRepository.findOneOrFail({
        where: { correo: email },
      });
      console.log('uuuuuuuu', user);
      userprofile = await userprofileRepository.findOneOrFail({
        where: { idusuariosistema: user.id },
      });
      console.log('uuuuuuuupppppp', userprofile);
      profile = await profileRepository.findOneOrFail({
        where: { idperfilsistema: userprofile.idperfilsistema },
      });
      console.log('ppppppp', profile);

      return profile;
    } catch (e) {
      console.log('error getProfileByEmail', e);
    }
  };
}

export default AuthController;
