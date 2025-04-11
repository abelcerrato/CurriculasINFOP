
import { getTipoEducadorIdM, getTipoEducadorM, postTipoEducadorM, putTipoEducadorM } from "../models/tipoInstructor.models.js";

export const getTipoEducadorC = async (req, res) => {
    try {
        const tipoEducador = await getTipoEducadorM();
        res.json(tipoEducador)
    } catch (error) {
        console.error('Error al obtener tipo de educador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getTipoEducadorIdC = async (req, res) => {
    try {
        const { id } = req.params
        const tipoEducador = await getTipoEducadorIdM(id);

        if (!tipoEducador) {
            return res.status(404).json({ message: "Tipo de Educador no encontrado" });
        }

        // Retornar el ID del tipo de educador 
        res.json(tipoEducador);
    } catch (error) {
        console.error('Error al obtener el tipo de educador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postTipoEducadorC = async (req, res) => {
    try {
        const { tipoeducador } = req.body;
        console.log(req.body);

        if (!tipoeducador) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }
        const newTipoEducador = await postTipoEducadorM(tipoeducador);
        res.json({ message: "Tipo de Educador agregado exitosamente: ", newTipoEducador });

    } catch (error) {
        console.error('Error al obtener el insertar el tipo de educador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}


export const putTipoEducadorC = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoeducador } = req.body;

        if (!tipoeducador) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }
        const tipoEducador = await putTipoEducadorM(tipoeducador, id);
        res.json({ message: "Tipo de Educador actualizado exitosamente: ", tipoEducador });

    } catch (error) {
        console.error('Error al actualizar el tipo de educador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}