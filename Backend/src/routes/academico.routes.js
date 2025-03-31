import {Router} from "express";
import { getGradoAcademicoIdC, getGradoAcademicoIdNivelC, getGradosAcademicosC, getNivelAcademicoIdC, getNivelesAcademicosC, postGradoAcademicoC, postNivelAcademicoC, putGradoAcademicoC, putNivelAcademicoC } from "../controllers/academico.controller.js";

const router=Router();



//////////////////////////////////////////////////////////////////////////////////////////////
//                                      NIVELES ACADEMICOS
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/nivelesAcademicos', getNivelesAcademicosC)
router.get('/nivelAcademico/:id', getNivelAcademicoIdC)
router.post('/nivelAcademico', postNivelAcademicoC)
router.put('/nivelAcademico/:id', putNivelAcademicoC)



//////////////////////////////////////////////////////////////////////////////////////////////
//                                      GRADOS ACADEMICOS
//////////////////////////////////////////////////////////////////////////////////////////////

router.get('/gradosAcademicos', getGradosAcademicosC)
router.get('/gradoAcademico/:id', getGradoAcademicoIdC)
router.get('/gradoAcademicoNivel/:IdNivel', getGradoAcademicoIdNivelC)
router.post('/gradoAcademico', postGradoAcademicoC)
router.put('/gradoAcademico/:id', putGradoAcademicoC)







export default router;