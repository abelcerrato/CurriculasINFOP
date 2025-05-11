import { Router } from "express";

import { deleteSeguimientoEstudianteC, getSegumientoC, getSegumientoIdAccFormC, getSegumientoIdC, postSeguimientoC, putSeguimientoC } from "../controllers/seguimiento.controller.js";

const router = Router();

router.get('/seguimientos', getSegumientoC);

router.get('/seguimiento/:id', getSegumientoIdC);

router.get('/seguimientoAccForm/:id', getSegumientoIdAccFormC);

router.post('/seguimientos', postSeguimientoC );

router.put('/seguimiento/:id', putSeguimientoC );

router.delete('/seguimiento/:idestudiante/:idaccionformativa', deleteSeguimientoEstudianteC);



export default router;