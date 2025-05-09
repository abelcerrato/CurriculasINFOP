import {Router} from "express";
import { getClasModCurrAccFormC, getClasModCurrAccFormIdC, postClasModCurrAccFormC, putClasModCurrAccFormC } from "../controllers/clasesmodcursocurraccform.controller.js";




const router=Router();

router.get('/ClassModCurrAF', getClasModCurrAccFormC)
router.get('/ClassModCurrAF/:id', getClasModCurrAccFormIdC)
router.post('/ClassModCurrAF', postClasModCurrAccFormC)
router.put('/ClassModCurrAF/:id', putClasModCurrAccFormC)



export default router;
