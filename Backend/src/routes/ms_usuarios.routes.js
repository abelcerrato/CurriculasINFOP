import {Router} from "express";
import {pool} from '../db.js'
import { verificarToken,  getUserC, getUserIdC, loginC, logoutC, postUserC, resetContraseñaUserC, updateContraseñaC, updateUserC, verificarUsuarioC} from "../controllers/ms_usuarios.controllers.js";

const router=Router();

router.get('/users', getUserC)

router.get('/users/:id', getUserIdC)

router.post('/verificarUsuario', verificarUsuarioC)

router.post('/postUsers', postUserC)

router.put('/users/:id', updateUserC)

router.put('/putPassword/:usuario', resetContraseñaUserC) //resetea la contraseña y asigna Temporal1*

router.post('/login', loginC)//hace login y verifica si la contraseña es temporal

router.get("/verify-token", verificarToken); //verifica si el token es valido y si el usuario tiene sesion activa


router.put('/actualizarContra/:usuario', updateContraseñaC)//actualiza la contraseña en caso que sea temporal o nuevo usuario

router.put('/logout/:id', logoutC)//cambie el estado se sesionactiva a false





export default router;
