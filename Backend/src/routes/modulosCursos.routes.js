import {Router} from "express";
import { getModulosCursoIdC, getModulosCursosC, postModulosCursoC, putModulosCursoC } from "../controllers/modulosCursoscontroller.js";

const router=Router();
router.get('/modulosCursos', getModulosCursosC)
router.get('/moduloCurso/:id', getModulosCursoIdC)
router.post('/modulosCursos', postModulosCursoC)
router.put('/moduloCurso/:id', putModulosCursoC)



export default router;
