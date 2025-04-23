import e from "express";
import { getMatriculasIdM, getMatriculasM, postMatriculasM, putMatriculasM } from "../models/matriculas.models.js";


export const getMatriculasC = async (req, res) => {
    try {
        const matriculas = await getMatriculasM();
        res.json(matriculas)
    } catch (error) {
        console.error('Error al obtener matriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getMatriculasIdC = async (req, res) => {
    const { id } = req.params

    try {
        const matricula = await getMatriculasIdM(id);

        if (!matricula) {
            return res.status(404).json({ message: "Matricula no encontrada" });
        }
        res.json(matricula)
    } catch (error) {
        console.error('Error al obtener la matricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postMatriculasC = async (req, res) => {
    try {
        const { idestudante, idcurso, fechainscripcion, informacionseguimiento, creadopor } = req.body;
        console.log(req.body);


        if (!idestudante || !idcurso || !fechainscripcion) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newMatricula = await postMatriculasM(idestudante, idcurso, fechainscripcion, informacionseguimiento, creadopor);
        res.json({ message: "Matricula agregada exitosamente: ", newMatricula });

    } catch (error) {
        console.error('Error al insertar la matricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putMatriculasC = async (req, res) => {
    try {
        const { id } = req.params;
        const { idestudante, idcurso, fechainscripcion, informacionseguimiento, modificadopor } = req.body;

        if (!idestudante || !idcurso || !fechainscripcion ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedMatricula = await putMatriculasM(idestudante, idcurso, fechainscripcion, informacionseguimiento, modificadopor, id);
        res.json({ message: "Matricula actualizada exitosamente: ", updatedMatricula });

    } catch (error) {
        console.error('Error al actualizar la matricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}