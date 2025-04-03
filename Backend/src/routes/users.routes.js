import {Router} from "express";
import {pool} from '../db.js'
import {   getUserC, getUserIdC, loginC, postUserC, resetContraseñaUserC, updateContraseñaC, updateUserC, verificarUsuarioC} from "../controllers/users.controllers.js";

const router=Router();

router.get('/users', getUserC)

router.get('/users/:id', getUserIdC)

router.post('/verificarUsuario', verificarUsuarioC)

router.post('/postUsers', postUserC)

router.put('/users/:id', updateUserC)

router.put('/putPassword/:usuario', resetContraseñaUserC) //resetea la contraseña y asigna Temporal1*

router.post('/login', loginC)//hace login y verifica si la contraseña es temporal

router.put('/actualizarContra/:usuario', updateContraseñaC)//actualiza la contraseña en caso que sea temporal o nuevo usuario






export default router;
