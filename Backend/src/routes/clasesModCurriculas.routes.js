import {Router} from "express";
import { getClasesModulosCurriculasC, getIdClasesModulosCurriculasC, getClasesIdModulosCurriculasC, getClasesModulosIdCurriculasC, postClasesModulosCurriculasC, putClasesModulosCurriculasC } from "../controllers/clasesModCurriculas.controller.js";

const router=Router();

router.get('/clasesModCurriculas', getClasesModulosCurriculasC);
router.get('/clasesMC/:id', getIdClasesModulosCurriculasC);
router.get('/clasesModulosC/:id', getClasesIdModulosCurriculasC);
router.get('/clasesModulosCurriculas/:id', getClasesModulosIdCurriculasC);
router.post('/clasesModulosCurriculas', postClasesModulosCurriculasC);
router.put('/clasesModulosCurriculas/:id', putClasesModulosCurriculasC)


export default router;
