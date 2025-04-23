import { Router } from "express";

import { getMatriculasC, getMatriculasIdC, postMatriculasC, putMatriculasC } from "../controllers/matriculas.controller.js";

const router = Router();

router.get('/matriculas', getMatriculasC);

router.get('/matriculas/:id', getMatriculasIdC);

router.post('/matricular', postMatriculasC );

router.put('/matricula/:id', putMatriculasC );


export default router;