import {Router} from "express";
import { getClasesIdModulosCursosC, getClasesModulosCursoIdCurriculaC, getClasesModulosCursosC, getClasesModulosIdCursoC, getIdClasesModulosCursosC, postClasesModulosCursosC, putClasesModulosCursosC } from "../controllers/clasesModCursos.controller.js";

const router=Router();


router.get('/clasesModCursos', getClasesModulosCursosC) //get de todas los clases
router.get('/IdclasesModCursos/:id', getIdClasesModulosCursosC)//get de todos los datos de la clase por id de la clase
router.get('/clasesIdModCursos/:id', getClasesIdModulosCursosC) //get de todos los datos de la clase por id del modulo
router.get('/clasesModIdCursos/id', getClasesModulosIdCursoC)//get de todas los clases por id del curso
router.get('/clasesModCursosIdCurricula/:id', getClasesModulosCursoIdCurriculaC) //get de todas los clases por id de la curricula
router.post('/clasesModulosCursos', postClasesModulosCursosC);
router.put('/clasesModulosCursos/:id', putClasesModulosCursosC)

export default router;
