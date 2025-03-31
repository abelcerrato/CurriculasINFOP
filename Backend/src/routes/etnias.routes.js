import {Router} from "express";
import { getEtniaIdC, getEtniasC, postEtniasC, putEtniaC } from "../controllers/etnias.controller.js";

const router=Router();

router.get('/etnias', getEtniasC)
router.get('/etnia/:id', getEtniaIdC)
router.post('/etnias', postEtniasC)
router.put('/etnias/:id', putEtniaC)


export default router;
