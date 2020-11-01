import { getRepository } from 'typeorm';
import { Tproveedor } from '../../../entities/Tproveedor';
import { Tusuariosistema } from '../../../entities/Tusuariosistema';
import IdentificacionFormCtrl from './IdentificacionFormCtrl';

class Provider {
  // esta funcion guarda un nuevo proveedor
  static saveNewProveedor = async (
    correo: string,
    idusuariosistema: number
  ): Promise<Tproveedor> => {
    // no existe el proveedor => es primera vez que se registra
    let newProvider: Tproveedor = new Tproveedor();
    newProvider.idusuariosistema = idusuariosistema;
    newProvider.pesototal = '0';
    newProvider.calificacionburo = '0';
    newProvider.calificaciontotal = '0';
    newProvider.estado = true;
    newProvider.fecharegistro = IdentificacionFormCtrl.fechaActual();
    newProvider.responsable = correo;
    // guardamos el nuevo proveedor
    const providerRepository = getRepository(Tproveedor);
    const provider = await providerRepository.save(newProvider);
    // Send response
    return provider;
  };

  static getProveedor = async (correo: string) => {
    console.log('getProveedor correo', correo);
    const userRepository = getRepository(Tusuariosistema);

    const userQuery: Tusuariosistema = await userRepository.findOne({ correo });
    console.log('userQueryyyy', userQuery);
    const proveedorRepository = getRepository(Tproveedor);

    const providerQuery: Tproveedor = await proveedorRepository.findOne({
      idusuariosistema: userQuery.id,
    });
    console.log('providerQuery ddd', providerQuery);
    return providerQuery;
  };
}
export default Provider;
