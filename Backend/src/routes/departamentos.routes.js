import {Router} from "express";
import { getDepartamentoIdC, getDepartamentosC, postDepartamentosC, putDepartamentoC } from "../controllers/departamentos.controller.js";

const router=Router();

router.get('/departamentos', getDepartamentosC)
router.get('/departamento/:id', getDepartamentoIdC)
router.post('/departamentos', postDepartamentosC)
router.put('/departamentos/:id', putDepartamentoC)



export default router;
