import {Router} from "express";
import { getAccionFormativaC, getAccionFormativaIdC, postAccionFormativaC, putAccionFormativaC } from "../controllers/accionformativa.controller.js";



const router=Router();

router.get('/accform', getAccionFormativaC)
router.get('/accform/:id', getAccionFormativaIdC)
router.post('/accform', postAccionFormativaC)
router.put('/accform/:id', putAccionFormativaC)



export default router;
