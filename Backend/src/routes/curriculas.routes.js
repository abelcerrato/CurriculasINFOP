import {Router} from "express";
import { getCurriculaIdC, getCurriculasC, postCurriculaC, putCurriculaC } from "../controllers/curriculas.controller.js";

const router=Router();


router.get('/curriculas', getCurriculasC)
router.get('/curriculas/:id', getCurriculaIdC)
router.post('/curriculas', postCurriculaC)
router.put('/curriculas/:id', putCurriculaC)


export default router;
