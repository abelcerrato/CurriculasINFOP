
import { getAreaFormacionIdM, getAreasFormacionM, postAreasFormacionM, putAreaFormacionM } from "../models/areasFormacion.models.js";

export const getAreasFormacionC = async (req, res) => {
    try {
        const areasFormacion = await getAreasFormacionM();
        res.json(areasFormacion)
    } catch (error) {
        console.error('Error al obtener areas de formacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
export const getAreasFormacionIdC =async (req, res)=>{
    try {
        const { id } = req.params
        const areaFormacion = await getAreaFormacionIdM(id);

        if (!areaFormacion) {
            return res.status(404).json({ message: "Area de formacion no encontrada" });
        }

        // Retornar el ID de la aldea 
        res.json( areaFormacion );
    } catch (error) {
        console.error('Error al obtener el area de formacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postAreasFormacionC = async (req, res) => {
    try {
        const { areaformacion } = req.body;
        console.log(req.body);

        if(!areaformacion){
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }
        const newAreaFormacion = await postAreasFormacionM(areaformacion);
        res.json({ message: "Area de formacion agregada exitosamente: ", newAreaFormacion });
    } catch (error) {
        console.error('Error al insertar el area de formacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putAreaFormacionC = async (req, res) => {
    try {
        const { id } = req.params;
        const { areaformacion } = req.body;

        if (!areaformacion) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedAreaFormacion = await putAreaFormacionM(areaformacion, id);
        res.json({ message: "Area de formacion actualizada exitosamente: ", updatedAreaFormacion });
    } catch (error) {
        console.error('Error al actualizar el area de formacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


