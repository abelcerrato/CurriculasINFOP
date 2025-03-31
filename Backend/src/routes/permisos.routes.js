import {Router} from "express";
import {getPermisosC } from "../controllers/permisos.conroller.js";

const router=Router();

router.get('/permisos', getPermisosC)

export default router;
