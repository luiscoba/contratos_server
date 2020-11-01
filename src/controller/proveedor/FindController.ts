import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tproveedor } from '../../entities/Tproveedor';
import { Tusuariosistema } from '../../entities/Tusuariosistema';

class FindController {
  static findUsuario = async (req: Request, res: Response) => {
    const { idProvider } = res.locals.jwtPayload;

    console.log('eeeesss req.idProvider que debia tener', idProvider);

    const providerRepository = getRepository(Tproveedor);
    let userSystem: Tusuariosistema;
    try {
      let provider = await providerRepository.findOne({
        id: idProvider,
      });

      console.log('provider find', provider);

      const userSystemRepository = getRepository(Tusuariosistema);

      userSystem = await userSystemRepository.findOne({
        id: provider.idusuariosistema,
      });

      console.log('userSystem find', userSystem);
      return res.send({
        nombre: userSystem.nombre,
        apellidos: userSystem.apellidos,
        correo: userSystem.correo,
        telefono: userSystem.telefono,
      });
    } catch (e) {
      return res.status(404).json({ message: 'findUsuario ' + e });
    }
  };

  static findByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    console.log('coorreo find', email);
    const userRepository = getRepository(Tusuariosistema);
    try {
      let user = await userRepository.findOne({ correo: email });

      console.log('user find', user);

      res.send({
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        telefono: user.telefono,
      });
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  };
}
export default FindController;
