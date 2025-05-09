import { getSeguimientoM, getSegumientoIdM, postSeguimientoM, putSeguimientoM } from "../models/seguimiento.models.js";

export const getSegumientoC = async (req, res) => {
    try {
        const seguimientos = await getSeguimientoM();
        res.json(seguimientos)
    } catch (error) {
        console.error('Error al obtener seguimientos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getSegumientoIdC = async (req, res) => {
    try {
        const { id } = req.params

        const seguimiento = await getSegumientoIdM(id);

        if (!seguimiento) {
            return res.status(404).json({ message: "Seguimiento no encontrado" });
        }

        // Retornar el ID del seguimiento 
        res.json(seguimiento)
    } catch (error) {
        console.error('Error al obtener el seguimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postSeguimientoC = async (req, res) => {
    try {
        const { completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, creadopor } = req.body;
        console.log(req.body);


        if (!completocurso || !tipocertificacion ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newSeguimiento = await postSeguimientoM(completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, creadopor);
        res.json({ message: "Seguimiento agregado exitosamente: ", newSeguimiento });

    } catch (error) {
        console.error('Error al insertar el seguimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putSeguimientoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor } = req.body;

        if (!completocurso || !tipocertificacion ) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newSeguimiento = await putSeguimientoM(completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor, id);
        res.json({ message: "Seguimiento actualizado exitosamente: ", newSeguimiento });

    } catch (error) {
        console.error('Error al actualizar el seguimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
