import { getAccionFormativaM } from "../models/accionformativa.models";

export const getAccionFormativaC = async (req, res) => {
    try {
        const accform = await getAccionFormativaM();
        res.json(accform)
    } catch (error) {
        console.error('Error al obtener accform:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
