import {Router} from "express";
import { getModulosCurriculaIdC, getModulosCurriculasC, getModulosIdCurriculaC, postModulosCurriculaC, putModulosCurriculaC } from "../controllers/modulosCurriculas.controller.js";

const router=Router();
router.get('/modulosCurriculas', getModulosCurriculasC)
router.get('/modulosCurriculas/:id', getModulosCurriculaIdC)
router.get('/modulosCurriculas/curricula/:id', getModulosIdCurriculaC)
router.post('/modulosCurriculas', postModulosCurriculaC)
router.put('/modulosCurriculas/:id', putModulosCurriculaC)



export default router;
