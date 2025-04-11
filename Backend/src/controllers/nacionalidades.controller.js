import { getNacionalidadesIdM, getNacionalidadesM, postNacionalidadesM, putNacionalidadesM } from "../models/nacionalidades.models.js";


export const getNacionalidadesC = async (req, res) => {
    try {
        const nacionalidades = await getNacionalidadesM();
        res.json(nacionalidades)
    } catch (error) {
        console.error('Error al obtener las nacionalidades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getNacionalidadesIdC = async (req, res) => {
    try {
        const { id } = req.params
        const nacionalidades = await getNacionalidadesIdM(id);
        if (!nacionalidades) {
            return res.status(404).json({ message: "Nacionalidad no encontrada" });
        }

        res.json(nacionalidades)
    } catch (error) {
        console.error('Error al obtener las nacionalidades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postNacionalidadesC = async (req, res) => {
    try {
        const {nacionalidad } = req.body;
        console.log(req.body);


        if (!nacionalidad) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newNacionalidad = await postNacionalidadesM(nacionalidad);
        res.json({ message: "Nacionalidad agregada exitosamente: ", newNacionalidad });

    } catch (error) {
        console.error('Error al insertar la nacionalidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}     


export const putNacionalidadesC = async (req, res) => {
    try {
        const { id } = req.params;
        const { nacionalidad } = req.body;

        if (!nacionalidad) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updateNacionalidad = await putNacionalidadesM(id, nacionalidad);
        res.json({ message: "Nacionalidad actualizada exitosamente: ", updateNacionalidad });

    } catch (error) {
        console.error('Error al actualizar la nacionalidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
