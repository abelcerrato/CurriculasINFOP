import { Router } from "express";
import { getProgramaIdC, getProgramasC, postProgramasC, putProgramaC } from "../controllers/programas.controller.js";

const router = Router();

router.get('/programas', getProgramasC);
router.get('/programa/id', getProgramaIdC);
router.post('/programas', postProgramasC);
router.put('/programas/:id', putProgramaC);



export default router;