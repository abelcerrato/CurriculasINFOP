import {Router} from "express";
import { getCursoIdC, getCursosC, postCursosC, putCursoC } from "../controllers/cursos.controller.js";

const router=Router();

router.get('/cursos', getCursosC)
router.get('/curso/:id', getCursoIdC)
router.post('/cursos', postCursosC)
router.put('/cursos/:id', putCursoC)





export default router;
