
import { getAldeaIdM, getAldeasM, postAldeasM, putAldeaM } from "../models/aldeas.models.js";


export const getAldeasC = async (req, res) => {
    try {
        const aldeas = await getAldeasM();
        res.json(aldeas)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getAldeasIdC = async (req, res) => {
    try {
        const { id } = req.params
        const aldea = await getAldeaIdM(id);

        if (!aldea) {
            return res.status(404).json({ message: "Aldea no encontrada" });
        }

        // Retornar el ID de la aldea 
        res.json({ id: aldea[0].id });
    } catch (error) {
        console.error('Error al obtener la aldea:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postAldeasC = async (req, res) => {
    try {
        const { aldea, idmunicipio } = req.body;
        console.log(req.body);


        if (!aldea || !idmunicipio) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newAldea = await postAldeasM(aldea, idmunicipio);
        res.json({ message: "Aldea agregada exitosamente: ", newAldea });

    } catch (error) {
        console.error('Error al insertar la aldea:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putAldeaC = async (req, res) => {
    try {
        const { id } = req.params;
        const { aldea, idmunicipio } = req.body;

        if (!aldea || !idmunicipio) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedAldea = await putAldeaM(id, aldea, idmunicipio);
        res.json({ message: "Aldea actualizada exitosamente: ", updatedAldea });
    } catch (error) {
        console.error('Error al actualizar la aldea:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


