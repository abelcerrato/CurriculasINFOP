import {Router} from "express";
import { getEstudianteIdC, getEstudiantesC, postEstudianteC, putEstudianteC } from "../controllers/estudiantes.controller.js";

const router=Router();

router.get('/estudiantes', getEstudiantesC)
router.get('/estudiantes/:id', getEstudianteIdC)
router.post('/estudiantes', postEstudianteC)
router.put('/estudiante/:id', putEstudianteC)

export default router;
