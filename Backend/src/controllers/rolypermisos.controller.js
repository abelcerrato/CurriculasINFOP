import { getRolyPermisosM } from "../models/rolypermisos.models.js";


export const getRolyPermisosC = async (req, res) => {
    try {
        const rolypermisos = await getRolyPermisosM();
        res.json(rolypermisos)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

