import {Router} from "express";
import { getMaestroIdC, getMaestrosC, postMaestroC, putMaestroC } from "../controllers/instructores.controller.js";

const router=Router();

router.get('/maestros', getMaestrosC)
router.get('/maestro/:id', getMaestroIdC)
router.post('/maestros', postMaestroC)
router.put('/maestro/:id', putMaestroC)



export default router;
