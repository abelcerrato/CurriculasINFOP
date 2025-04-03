import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas
import { getUserM, getUserIdM, postUserM, updateUserM, deleteUserM, getUsuarioIdM, verificarUsuarioM } from "../models/user.models.js";

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
        const { nombre, cecap, usuario, correo, idrol, iddepartamento, idmunicipio, contraseña,  estado, creadopor } = req.body
        console.log(req.body);

        const users = await postUserM(nombre, cecap, usuario, correo, idrol, iddepartamento, idmunicipio, contraseña,  estado, creadopor)
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
        const { nombre, cecap, correo, idrol, iddepartamento, idmunicipio,  estado, modificadopor, usuario } = req.body

        const users = await updateUserM(nombre, cecap, correo, idrol, iddepartamento, idmunicipio,  estado, modificadopor, usuario, id)
    
        res.json({ message: "Usuario Actualizado Exitosamente", user: users });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}


export const deleteUserC = async (req, res) => {
    try {
        const { id } = req.params
        const users = await deleteUserM(id)
        console.log(users);


        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Usuario Eliminado Exitosamente", user: users });
    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}