import {Router} from "express";
import { getAldeasC, postAldeasC, putAldeaC } from "../controllers/aldeas.controller.js";

const router=Router();

router.get('/aldeas', getAldeasC)
router.get('/aldea/id', getAldeasC)
router.post('/aldeas', postAldeasC)
router.put('/aldeas/:id', putAldeaC)


export default router;
