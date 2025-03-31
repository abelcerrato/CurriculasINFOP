import { getDiscapacidadesM, getDiscapacidadIdM, postDiscapacidadesM, putDiscapacidadM } from "../models/discapacidades.models.js";


export const getDiscapacidadesC = async (req, res) => {
    try {
        const discapacidades = await getDiscapacidadesM();
        res.json(discapacidades)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getDiscapacidadIdC = async (req, res) => {
    try {
        const { id } = req.params
        const discapacidad = await getDiscapacidadIdM(id);

        if (!discapacidad) {
            return res.status(404).json({ message: "Discapacidad no encontrada" });
        }

        // Retornar el ID de la discapacidad 
        res.json({ id: discapacidad[0].id });
    } catch (error) {
        console.error('Error al obtener la discapacidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postDiscapacidadesC = async (req, res) => {
    try {
        const { discapacidad } = req.body;
        console.log(req.body);


        if (!discapacidad) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newDiscapacidad = await postDiscapacidadesM(discapacidad);
        res.json({ message: "Discapacidad agregada exitosamente: ", newDiscapacidad });

    } catch (error) {
        console.error('Error al insertar la discapacidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putDiscapacidadC = async (req, res) => {
    try {
        const { id } = req.params;
        const { discapacidad } = req.body;

        if (!discapacidad) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedDiscapacidad = await putDiscapacidadM(discapacidad, id);
        res.json({ message: "Discapacidad actualizada exitosamente: ", updatedDiscapacidad });

    } catch (error) {
        console.error('Error al actualizar la discapacidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
