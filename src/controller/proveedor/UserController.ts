import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tusuarioperfilsistema } from '../../entities/Tusuarioperfilsistema';
import { Tusuariosistema } from '../../entities/Tusuariosistema';
import Util from '../util/Util';
import Provider from './formularios/Provider';

class UserController {
  static getAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(Tusuariosistema);
    let users;
    try {
      users = await userRepository.find();
    } catch (e) {
      res.status(404).json({ message: 'Something goes wrong!' });
    }
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepository = getRepository(Tusuariosistema);
    try {
      const user = await userRepository.findOneOrFail(id);
      res.send(user);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static newUser = async (req: Request, res: Response) => {
    const { nombre, apellidos, telefono, correo } = req.body;
    const usuario = nombre + ' ' + apellidos;
    // ============   VALIDAMOS si el existe usuario para no guardarlo
    const userRepository = getRepository(Tusuariosistema);

    // generamos cadena aleatoria
    const cadenaAleatoria: string = Util.cadenaAleatoria(4);

    try {
      let userQuery: Tusuariosistema = await userRepository.findOne({
        correo: correo,
      });

      if (userQuery) {
        return res.status(400).json({ error: 'Correo already exist' });
      } else {
        // nuevo usuario
        const userprofileRepository = getRepository(Tusuarioperfilsistema);

        const idperfilUsuario = 1; // id de 'usuario normal'

        const user = new Tusuariosistema();
        user.nombre = nombre;
        user.apellidos = apellidos;
        user.telefono = telefono;
        user.correo = correo;
        user.estado = 'activado'; // de activacion
        user.usaclavetemporal = true;
        user.clavetemporal = cadenaAleatoria;
        user.fecharegistro = Util.fechaActual();
        //  user.fechacaducaclavetemp = new Date(Util.fechaYhoraActual(HORAS_QUE_DURA_LA_CLAVE)); //  horas de validez del password temporal
        user.responsable = correo;
        // se guarda el usuario
        let newUser: Tusuariosistema;

        try {
          let envioCorreo;
          // enviamos el correo con una clave temporal
          await UserController.enviarClaveTemporal(
            correo,
            usuario,
            cadenaAleatoria
          )
            .then(function (respuesta) {
              console.log('jojo entra al then', respuesta);
              envioCorreo = respuesta;
            })
            .catch(function (error) {
              console.log(
                'entra en el catch de error al enviar mensaje',
                error
              ); // "oh, no!"
              envioCorreo = error;
            });

          user.hashPasswordTemporal();
          if (envioCorreo === 'ok') {
            newUser = await userRepository.save(user);
          } else {
            return res.status(409).json({
              message: 'Error al registrar el correo, no se crea el usuario',
            });
          }
        } catch (e) {
          return res.status(409).json({ message: 'Usuario already exist' });
        }
        const userprofile = new Tusuarioperfilsistema();
        userprofile.idperfilsistema = idperfilUsuario;
        userprofile.idusuariosistema = newUser.id;
        userprofile.fecharegistro = Util.fechaActual();
        userprofile.estado = false;
        userprofile.responsable = correo;
        // se guarda en la tabla usuario-perfil el id_usuario
        await userprofileRepository.save(userprofile);
        // se guarda en la tabla proveedor
        let proveedor = await Provider.saveNewProveedor(correo, newUser.id);
        console.log('proveedorrrxzr', proveedor);
      }
    } catch (e) {
      return res.status(409).json({ message: 'newUser ' + e });
    }

    res.status(201).send({ correo });
  };
  // comentario
  static enviarClaveTemporal = async (
    correo: string,
    usuario: string,
    cadenaAleatoria: string
  ): Promise<string> => {
    const port = process.env.PORT || 3005;

    var axios = require('axios');
    var body = { cadenaAleatoria: cadenaAleatoria, usuario: usuario };
    var config = {
      method: 'post',
      url:
        `http://localhost:${port}/proveedor-api/v1/process/sendMail/` + correo,
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
    };

    return axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        return 'ok';
      })
      .catch(function (error) {
        console.log('metodo enviarClaveTemporal', error);
        return 'ocurrio error';
      });
  };

  static editUser = async (req: Request, res: Response) => {
    const { nombre, apellidos, correo, telefono } = req.body;

    let userQuery: Tusuariosistema;
    const userRepository = getRepository(Tusuariosistema);

    try {
      userQuery = await userRepository.findOneOrFail({ correo });
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Try to save user
    userQuery.nombre = nombre;
    userQuery.apellidos = apellidos;
    userQuery.telefono = telefono;
    userQuery.correo = correo;

    try {
      await userRepository.save(userQuery);
    } catch (e) {
      return res.status(409).json({ message: 'Something goes wrong!' });
    }

    res.status(202).json({ message: 'User update' });
  };

  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepository = getRepository(Tusuariosistema);
    let user: Tusuariosistema;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove user
    userRepository.delete(id);
    res.status(201).json({ message: 'User deleted' });
  };

  static validateEmailUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    const userRepository = getRepository(Tusuariosistema);
    let user: Tusuariosistema;

    try {
      user = await userRepository.findOneOrFail(email);

      console.log('respuesta u', user);
    } catch (e) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user
    res.send(user);
  };
}
export default UserController;
