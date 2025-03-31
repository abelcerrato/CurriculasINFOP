import e from "express";
import { getRolesM, getRolIdM, postRolesM, putRolesM } from "../models/roles.models.js";

export const getRolesC = async (req, res) => {
    try {
        const roles = await getRolesM();
        res.json(roles)
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getRolIdC = async (req, res) => {
    try {
        const { id } = req.params
        const rol = await getRolIdM(id);

        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }

        // Retornar el ID del rol 
        res.json({ id: rol[0].id });
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postRolesC = async (req, res) => {
    try {
        const { rol } = req.body;
        console.log(req.body);


        if (!rol) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newRol = await postRolesM(rol);
        res.json({ message: "Rol agregado exitosamente: ", newRol });

    } catch (error) {
        console.error('Error al insertar el rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putRolesC = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!rol) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedRol = await putRolesM(rol, id);
        res.json({ message: "Rol actualizado exitosamente: ", updatedRol });


    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}

