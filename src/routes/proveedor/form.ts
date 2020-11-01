import { Router } from 'express';
import AceptacionFormCtrl from '../../controller/proveedor/formularios/AceptacionFormCtrl';
import ComercialFormCtrl from '../../controller/proveedor/formularios/ComercialFormCtrl';
import DocumentalFormCtrl from '../../controller/proveedor/formularios/DocumentalFormCtrl';
import EmpresarialFormCtrl from '../../controller/proveedor/formularios/EmpresarialFormCtrl';
import FinancieroFormCtrl from '../../controller/proveedor/formularios/FinancieroFormCtrl';
import IdentificacionFormCtrl from '../../controller/proveedor/formularios/IdentificacionFormCtrl';
import InfoContactoFormCtrl from '../../controller/proveedor/formularios/InfoContactoFormCtrl';
import OperativoFormCtrl from '../../controller/proveedor/formularios/OperativoFormCtrl';
import { addRes } from '../../middlewares/addRes';
import { checkJwt } from '../../middlewares/verifyjwt';

const router = Router();

// IDENTIFICACION
router.get(
  '/get-identifica/',
  [addRes, checkJwt],
  IdentificacionFormCtrl.getIdentification
);

router.get(
  '/delete-actividad/:id',
  [addRes, checkJwt],
  IdentificacionFormCtrl.deleteActividad
);

router.post(
  '/save-identification/',
  [addRes, checkJwt],
  IdentificacionFormCtrl.saveIdentificacion
);

// INFO-CONTACTO
router.get(
  '/get-info-contacto/',
  [addRes, checkJwt],
  InfoContactoFormCtrl.getInfoContacto
);

router.post(
  '/save-info-contacto/',
  [addRes, checkJwt],
  InfoContactoFormCtrl.saveInfoContacto
);

//  EMPRESARIAL
router.get(
  '/get-empresarial/',
  [addRes, checkJwt],
  EmpresarialFormCtrl.getEmpresarialDto
);

router.post(
  '/save-empresarial/',
  [addRes, checkJwt],
  EmpresarialFormCtrl.saveEmpresarialDto
);

// OPERATIVO
router.get(
  '/get-operativo/',
  [addRes, checkJwt],
  OperativoFormCtrl.getOperativoDto
);

router.post(
  '/save-operativo/',
  [addRes, checkJwt],
  OperativoFormCtrl.saveOperativo
);

// FINANCIERO
router.get(
  '/get-financiero/',
  [addRes, checkJwt],
  FinancieroFormCtrl.getFinancieroDto
);

router.put(
  '/update-perfilFinanciero/',
  [addRes, checkJwt],
  FinancieroFormCtrl.updateFinanciero
);

// COMERCIAL
router.get(
  '/get-comercial/',
  [addRes, checkJwt],
  ComercialFormCtrl.getComercialDto
);

router.post(
  '/save-comercial/',
  [addRes, checkJwt],
  ComercialFormCtrl.saveComercial
);

// DOCUMENTAL
router.post(
  '/upload-pdf',
  [addRes, checkJwt],
  DocumentalFormCtrl.multipleUpload
);

router.get(
  '/get-documental/',
  [addRes, checkJwt],
  DocumentalFormCtrl.getDocumentalDto
);

router.get(
  '/download-proveedor-pdf/:idDocumentoPerfilDocumental',
  [addRes, checkJwt],
  DocumentalFormCtrl.downloadDocumento
);

router.get(
  '/remove-proveedor-pdf/:idDocumentoPerfilDocumental',
  [addRes, checkJwt],
  DocumentalFormCtrl.removeDocumento
);

// ACEPTACION
// router.get('/download-pdf', AceptacionFormCtrl.downloadDocumentoAceptacion);

router.get(
  '/get-aceptacion/',
  [addRes, checkJwt],
  AceptacionFormCtrl.getAceptacion
);

router.post(
  '/save-aceptacion/',
  [addRes, checkJwt],
  AceptacionFormCtrl.saveAceptacion
);

export default router;
