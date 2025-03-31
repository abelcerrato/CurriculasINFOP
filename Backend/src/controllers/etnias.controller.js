import { getEtniaIdM, getEtniasM, postEtniasM, putEtniaM } from "../models/etnias.models.js";


export const getEtniasC = async (req, res) => {
    try {
        const etnias = await getEtniasM();
        res.json(etnias)
    } catch (error) {
        console.error('Error al obtener las etnias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getEtniaIdC = async (req, res) => {
    try {
        const { id } = req.params
        const etnia = await getEtniaIdM(id);

        if (!etnia) {
            return res.status(404).json({ message: "Etnia no encontrada" });
        }

        // Retornar el ID de la etnia 
        res.json(etnia);
    } catch (error) {
        console.error('Error al obtener la etnia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postEtniasC = async (req, res) => {
    try {
        const { etnia } = req.body;
        console.log(req.body);


        if (!etnia) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newEtnia= await postEtniasM(etnia);
        res.json({ message: "Etnia agregada exitosamente: ", newEtnia });

    } catch (error) {
        console.error('Error al insertar la Etnia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putEtniaC = async (req, res) => {
    try {
        const { id } = req.params;
        const { etnia } = req.body;

        if (!etnia) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newEtnia = await putEtniaM(etnia, id);
        res.json({ message: "Etnia actualizada exitosamente: ", newEtnia });
    } catch (error) {
        console.error('Error al actualizar la Etnia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
