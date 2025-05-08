import { Router } from "express";
import { getAreasFormacionC, getAreasFormacionIdC, postAreasFormacionC, putAreaFormacionC } from "../controllers/areasFormacion.controller.js";

const router = Router();

router.get('/areasFormacion', getAreasFormacionC)
router.get('/areasFormacion/:id', getAreasFormacionIdC)
router.post('/areasFormacion', postAreasFormacionC)
router.put('/areasFormacion/:id', putAreaFormacionC)

export default router;
