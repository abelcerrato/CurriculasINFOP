import e from "express";
import { getProgramaIdM, getProgramasM, postProgramasM, putProgramaM } from "../models/programas.models.js";

export const getProgramasC = async (req, res) => {
    try {
        const programas = await getProgramasM();
        res.json(programas)
    } catch (error) {
        console.error('Error al obtener Programas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getProgramaIdC = async (req, res) => {
    try {
        const { id } = req.params

        const programa = await getProgramaIdM(id);

        if (!programa) {
            return res.status(404).json({ message: "Programa no encontrado" });
        }

        res.json(programa)
    } catch (error) {
        console.error('Error al obtener el programa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postProgramasC = async (req, res) => {
    try {
        const { programa, objetivo, fechainicio, fechafinal, creadopor } = req.body;
        console.log(req.body);


        if (!programa || !objetivo || !fechainicio || !fechafinal ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newPrograma = await postProgramasM(programa, objetivo, fechainicio, fechafinal, creadopor);
        res.json({ message: "Programa agregado exitosamente: ", newPrograma });

    } catch (error) {
        console.error('Error al insertar el Programa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putProgramaC = async (req, res) => {
    try {

        const { id } = req.params;
        const { programa, objetivo, fechainicio, fechafinal, modificadopor } = req.body;
        //console.log(fechainicio, fechafinal, modificadopor);


        if (!programa || !objetivo ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedPrograma = await putProgramaM(programa, objetivo, fechainicio, fechafinal, modificadopor, id);
        res.json({ message: "Programa actualizado exitosamente: ", updatedPrograma });

    } catch (error) {
        console.error('Error al actualizar el Programa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}