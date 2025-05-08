import {Router} from "express";
import { getCurriculaIdC, getCurriculasC, postCurriculaC, postCurriculaModulosClasesC, putCurriculaC, putCurriculaModulosClasesC } from "../controllers/curriculas.controller.js";

const router=Router();


router.get('/curriculas', getCurriculasC)
router.get('/curriculas/:id', getCurriculaIdC)
router.post('/curriculas', postCurriculaC)
router.put('/curriculas/:id', putCurriculaC)


router.post('/curriculasModulosClases', postCurriculaModulosClasesC)
router.put('/curriculasModulosClases', putCurriculaModulosClasesC)


export default router;
