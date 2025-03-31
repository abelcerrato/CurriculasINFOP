import {Router} from "express";
import { getRolyPermisosC } from "../controllers/rolypermisos.controller.js";

const router=Router();
router.get('/rolypermisos', getRolyPermisosC)


export default router;
