import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas
import jwt from "jsonwebtoken";

import { getUserM, getUserIdM, postUserM, updateUserM, getUsuarioIdM, verificarUsuarioM, updateContraseñaM, resetContraseñaM } from "../models/ms_usuarios.models.js";

export const getUserC = async (req, res) => {
    try {
        const users = await getUserM();
        res.json(users)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}

export const getUsuarioIdC = async (req, res) => {
    try {
        const { usuario } = req.params
        const users = await getUsuarioIdM(usuario);

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retornar el ID del usuario (suponiendo que el resultado tiene un campo 'id')
        res.json(users);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getUserIdC = async (req, res) => {
    try {
        const { id } = req.params
        const users = await getUserIdM(id);

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(users)
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}


export const verificarUsuarioC = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        console.log(req.body);

        if (!usuario || !contraseña) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const user = await verificarUsuarioM(usuario);


        if (!user) {
            console.log("Usuario o contraseña incorrectos");
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }


        const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
        if (!contraseñaValida) {
            console.log("Usuario o contraseña incorrectos");
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }


        return res.json({
            message: `Usuario autenticado. Su usuario es: ${user.nombre}`,
            user: user
        });

    } catch (error) {
        console.error("Error al verificar usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


export const postUserC = async (req, res) => {
    try {
        const { nombre, cecap, usuario, correo, idrol, iddepartamento, idmunicipio, estado, creadopor } = req.body
        console.log(req.body);

        const users = await postUserM(nombre, cecap, usuario, correo, idrol, iddepartamento, idmunicipio, estado, creadopor)
        //res.json(users)
        res.json({ message: "Usuario Agregado Exitosamente", user: users });
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const updateUserC = async (req, res) => {

    try {
        const { id } = req.params;
        const { nombre, cecap, correo, idrol, iddepartamento, idmunicipio, estado, modificadopor, usuario } = req.body

        const users = await updateUserM(nombre, cecap, correo, idrol, iddepartamento, idmunicipio, estado, modificadopor, usuario, id)

        res.json({ message: "Usuario Actualizado Exitosamente", user: users });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const updateContraseñaC = async (req, res) => {
    try {
        const { usuario } = req.params;
        const { nuevaContraseña } = req.body

        const users = await updateContraseñaM(nuevaContraseña, usuario)

        res.json({ message: "Contraseña del Usuario Actualizada Exitosamente", user: users });
    } catch (error) {
        console.error('Error al actualizar la contraseña del usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const resetContraseñaUserC = async (req, res) => {
    try {
        const { usuario } = req.params;
        
        const usuarioActualizado = await resetContraseñaM(usuario);

        res.json({ message: "Contraseña reseteada con éxito. Se asignó 'Temporal1*'.", user: usuarioActualizado });
    } catch (error) {
        console.error("Error al resetear la contraseña del usuario: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


// Controlador para el login
export const loginC = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        console.log(req.body);

        if (!usuario || !contraseña) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const user = await verificarUsuarioM(usuario);

        if (!user) {
            console.log("Usuario o contraseña incorrectos");
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Comparar la contraseña ingresada con la almacenada
        const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
        if (!contraseñaValida) {
            console.log("Usuario o contraseña incorrectos");
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Si ya hay una sesión activa, cerrarla (poner sesionactiva a false)
        if (user.sesionactiva) {
            console.log("Ya tienes una sesión activa, se cerrará la sesión anterior.");
            await pool.query('UPDATE ms_usuarios SET sesionactiva = FALSE WHERE id = $1', [user.id]);
        }


        // Verificar si la contraseña de nuevo usuario
        const contraseñaNuevoUsuario = await bcrypt.compare("NuevoUsuario1*", user.contraseña);
        if (contraseñaNuevoUsuario) {
            return res.status(403).json({ 
                message: "Debe cambiar su contraseña", 
                changePasswordRequired: true, 
                user: { id: user.id, usuario: user.usuario } 
            });
        }

        // Verificar si la contraseña es la temporal
        const contraseñaTemporal = await bcrypt.compare("Temporal1*", user.contraseña);
        if (contraseñaTemporal) {
            return res.status(402).json({ 
                message: "Debe cambiar su contraseña", 
                changePasswordRequired: true, 
                user: { id: user.id, usuario: user.usuario } 
            });
        }

        // Marcar la sesión como activa (poner sesionactiva a true)
        await pool.query('UPDATE ms_usuarios SET sesionactiva = TRUE WHERE id = $1', [user.id]);

        // Generar token de sesión
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({ 
            message: "Inicio de sesión exitoso. Si había una sesión activa, ha sido cerrada.", 
            token,
            user: { id: user.id, usuario: user.usuario } 
        });
    } catch (error) {
        console.error("Error en login: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



export const logoutC = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID del usuario que quiere cerrar sesión: ", id);

        // Cerrar sesión del usuario (poner sesionactiva a false)
        await pool.query('UPDATE ms_usuarios SET sesionactiva = FALSE WHERE id = $1', [id]);

        return res.json({ message: "Sesión cerrada exitosamente." });
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};