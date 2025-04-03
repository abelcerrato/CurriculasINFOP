import {Router} from "express";
import {pool} from '../db.js'
import {  deleteUserC, getUserC, getUserIdC, postUserC, updateContraseñaUserC, updateUserC, verificarUsuarioC} from "../controllers/users.controllers.js";

const router=Router();

router.get('/users', getUserC)

router.get('/users/:id', getUserIdC)

router.post('/verificarUsuario', verificarUsuarioC)

router.post('/postUsers', postUserC)

router.put('/users/:id', updateUserC)

router.put('putPassword/:id', updateContraseñaUserC)

router.delete('/users/:id', deleteUserC)





export default router;
