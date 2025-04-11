import { Router } from "express";
import { getNacionalidadesC, getNacionalidadesIdC, postNacionalidadesC, putNacionalidadesC } from "../controllers/nacionalidades.controller.js";

const router = Router();

router.get('/nacionalidades', getNacionalidadesC);

router.get('/nacionalidad/:id', getNacionalidadesIdC);

router.post('/nacionalidades', postNacionalidadesC);

router.put('/nacionalidad/:id', putNacionalidadesC);


export default router;