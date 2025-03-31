import { getCurriculaIdM, getCurriculasM, postCurriculaM, putCurriculaM } from '../models/curriculas.models.js';

export const getCurriculasC = async (req, res) => {
    try {
        const curriculas = await getCurriculasM();
        res.json(curriculas)
    } catch (error) {
        console.error('Error al obtener curriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}   


export const getCurriculaIdC = async (req, res) => {
    try {
        const { id } = req.params
        const curricula = await getCurriculaIdM(id);

        if (!curricula) {
            return res.status(404).json({ message: "Curricula no encontrada" });
        }

        // Retornar el ID de la curricula 
        res.json({ id: curricula[0].id });
    } catch (error) {
        console.error('Error al obtener la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postCurriculaC = async (req, res) => {
    try {
        const { curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
            versioncurricula, educaciontemprana, idareaformacion, creadopor } = req.body;
        console.log(req.body);


        const newCurricula = await postCurriculaM(curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, 
            objetivo, versioncurricula, educaciontemprana, idareaformacion, creadopor);
        res.json({ message: "Curricula agregada exitosamente: ", newCurricula });

    } catch (error) {
        console.error('Error al insertar la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const putCurriculaC = async (req, res) => {
    try {
        const { id } = req.params;
        const { curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
            versioncurricula, educaciontemprana, idareaformacion, modificadopor } = req.body;


        const curriculaUpdated = await putCurriculaM(curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, 
            objetivo, versioncurricula, educaciontemprana, idareaformacion, modificadopor, id);
        res.json({ message: "Curricula actualizada exitosamente: ", curriculaUpdated });

    } catch (error) {
        console.error('Error al actualizar la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}