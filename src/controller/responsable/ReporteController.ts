import { Request, Response } from 'express';

class ReporteController {
  static saveCalificacion = async (req, res) => {
    

    
  };

  static multipleUpload = async (req, res) => {
    const idHeader = <string>req.headers['auth'];
    const idDocumento = req.query.idDocumento;

    return res.status(202).json('Ok'); //enviamos solo el objeto sin {}
  };
}

export default ReporteController;
