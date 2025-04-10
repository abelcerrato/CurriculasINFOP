import {Router} from "express";
import {pool} from '../db.js'

import { procesarEstudiantes } from "../controllers/ApiExternaEstudiantes.controller.js";

const router=Router();


router.post('/EstudiantesExternos', procesarEstudiantes)//verifica si el usuario tiene permisos para hacer la accion de insertar estudiantes





export default router;
