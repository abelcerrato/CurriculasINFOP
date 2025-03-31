import { getMunicipioIdM, getMunicipiosM, postMunicipiosM, putMunicipioM } from "../models/municipios.models.js";

export const getMunicipiosC = async (req, res) => {
    try {
        const municipios = await getMunicipiosM();
        res.json(municipios)
    } catch (error) {
        console.error('Error al obtener municipios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getMunicipioIdC = async (req, res) => {
    try {
        const { id } = req.params
        const municipio = await getMunicipioIdM(id);

        if (!municipio) {
            return res.status(404).json({ message: "Municipio no encontrado" });
        }

        // Retornar el ID del municipio 
        res.json({ id: municipio[0].id });
    } catch (error) {
        console.error('Error al obtener el municipio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postMunicipiosC = async (req, res) => {
    try {
        const { municipio, iddepartamento } = req.body;
        console.log(req.body);


        if (!municipio || !iddepartamento) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newMunicipio = await postMunicipiosM(municipio, iddepartamento);
        res.json({ message: "Municipio agregado exitosamente: ", newMunicipio });

    } catch (error) {
        console.error('Error al insertar el municipio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}     


export const putMunicipioC = async (req, res) => {
    try {
        const { id } = req.params;
        const { municipio, iddepartamento } = req.body;

        if (!municipio || !iddepartamento) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedMunicipio = await putMunicipioM(id, municipio, iddepartamento);
        res.json({ message: "Municipio actualizado exitosamente: ", updatedMunicipio });
    } catch (error) {
        console.error('Error al actualizar el municipio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


