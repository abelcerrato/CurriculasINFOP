import { Router } from "express";

import { getSegumientoC, getSegumientoIdC, postSeguimientoC, putSeguimientoC } from "../controllers/seguimiento.controller.js";

const router = Router();

router.get('/seguimientos', getSegumientoC);

router.get('/seguimiento/:id', getSegumientoIdC);

router.post('/seguimientos', postSeguimientoC );

router.put('/seguimiento/:id', putSeguimientoC );


export default router;