import { Router } from "express";
import { getMunicipioIdC, getMunicipiosC, postMunicipiosC, putMunicipioC } from "../controllers/municipios.controller.js";

const router = Router();

router.get('/municipios', getMunicipiosC);

router.get('/municipios/:id', getMunicipioIdC);

router.post('/municipios', postMunicipiosC);

router.put('/municipios/:id', putMunicipioC);


export default router;