import {Router} from "express";
import {getPermisosC, getPermisosIdRolC, postPerfilPermisosC, putPerfilPermisosC } from "../controllers/ms_permisos.conroller.js";

const router=Router();

router.get('/permisos', getPermisosC)
router.get('/permisos/:id', getPermisosIdRolC)
router.post('/permisos', postPerfilPermisosC)
router.put('/permisos', putPerfilPermisosC)

export default router;
