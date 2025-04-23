import { Router } from "express";

import { getCalificacionesC, getCalificacionesIdC, postCalificacionesC, putCalificacionesC } from "../controllers/calificaciones.controller.js";

const router = Router();

router.get('/calificaciones', getCalificacionesC);

router.get('/calificaciones/:id', getCalificacionesIdC);

router.post('/calificaciones', postCalificacionesC );

router.put('/calificaciones/:id', putCalificacionesC );


export default router;