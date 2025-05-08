import {Router} from "express";
import { deleteModuloC, getModulosCurriculaIdC, getModulosCurriculasC, getModulosIdCurriculaC, postModulosCurriculaC, putModulosCurriculaC } from "../controllers/modulosCurriculas.controller.js";

const router=Router();
router.get('/modulosCurriculas', getModulosCurriculasC)
router.get('/modulosCurriculas/:id', getModulosCurriculaIdC)
router.get('/modulosCurriculas/curricula/:id', getModulosIdCurriculaC)
router.post('/modulosCurriculas', postModulosCurriculaC)
router.put('/modulosCurriculas/:id', putModulosCurriculaC)
router.delete('/moduloscurriculas/:id', deleteModuloC);



export default router;
