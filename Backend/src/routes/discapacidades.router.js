import {Router} from "express";
import { getDiscapacidadesC, getDiscapacidadIdC, postDiscapacidadesC, putDiscapacidadC } from "../controllers/discapacidades.controller.js";

const router=Router();

router.get('/discapacidades', getDiscapacidadesC)
router.get('/discapacidad/:id', getDiscapacidadIdC)
router.post('/discapacidades', postDiscapacidadesC)
router.put('/discapacidades/:id', putDiscapacidadC)



export default router;
