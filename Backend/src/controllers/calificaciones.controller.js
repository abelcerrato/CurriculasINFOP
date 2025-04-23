import e from "express";
import { getCalificacionesIdM, getCalificacionesM, postCalificacionesM, putCalificacionesM } from "../models/calificaciones.models.js";


export const getCalificacionesC = async (req, res) => {
    try {
        const calificaciones = await getCalificacionesM();
        res.json(calificaciones)
    } catch (error) {
        console.error('Error al obtener calificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getCalificacionesIdC = async (req, res) => {
    try {
        const { id } = req.params

        const calificacion = await getCalificacionesIdM(id);

        if (!calificacion) {
            return res.status(404).json({ message: "Calificacion no encontrada" });
        }

        res.json(calificacion)
    } catch (error) {
        console.error('Error al obtener la calificacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postCalificacionesC = async (req, res) => {
    try {
        const { idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, creadopor } = req.body;
        console.log(req.body);


        /*   if (!idclasecurso || !idclasecurricula || !calificacionteorica || !duracionteorica || !calificacionpractica || !duracionpractica || !duraciontotal ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        } */

        const newCalificacion = await postCalificacionesM(idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, creadopor);
        res.json({ message: "Calificacion agregada exitosamente: ", newCalificacion });

    } catch (error) {
        console.error('Error al insertar la calificacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putCalificacionesC = async (req, res) => {
    try {
        const { id } = req.params;
        const { idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, modificadopor } = req.body;

        /*  if (!idclasecurso || !idclasecurricula || !calificacionteorica || !duracionteorica || !calificacionpractica || !duracionpractica || !duraciontotal ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        } */

        const newCalificacion = await putCalificacionesM(idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, modificadopor, id);
        res.json({ message: "Calificacion actualizada exitosamente: ", newCalificacion });

    } catch (error) {
        console.error('Error al insertar la calificacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}