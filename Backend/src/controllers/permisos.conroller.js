import { getPermisosM } from "../models/permisos.models.js";

export const getPermisosC = async (req, res) => {
    try {
        const permisos = await getPermisosM();
        res.json(permisos)
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
