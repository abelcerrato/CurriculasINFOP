import { deleteSeguimientoEstudianteM, getSeguimientoM, getSegumientoIdAccFormM, getSegumientoIdM, postSeguimientoM, putSeguimientoM } from "../models/seguimiento.models.js";

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



export const getSegumientoIdAccFormC = async (req, res) => {
    try {
        const { id } = req.params

        const seguimiento = await getSegumientoIdAccFormM(id);

        if (!seguimiento) {
            return res.status(404).json({ message: "Seguimiento no encontrado" });
        }

        res.json(seguimiento)
    } catch (error) {
        console.error('Error al obtener el seguimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postSeguimientoC = async (req, res) => {
    try {
        const seguimientos = req.body;
        console.log("Datos llegados al back", req.body);

        if (!Array.isArray(seguimientos)) {
            return res.status(400).json({ error: 'Se esperaba un arreglo de seguimientos.' });
        }

        const resultados = [];

        for (const seguimiento of seguimientos) {
            const {
                completocurso,
                fechaabandono,
                razonabandono,
                tipocertificacion,
                hasidoempleado,
                tipoempleo,
                trabajacampoestudio,
                idaccionformativa,
                idestudiante,
                creadopor
            } = seguimiento;


            const nuevoSeguimiento = await postSeguimientoM(
                completocurso,
                fechaabandono,
                razonabandono,
                tipocertificacion,
                hasidoempleado,
                tipoempleo,
                trabajacampoestudio,
                idaccionformativa,
                idestudiante,
                creadopor
            );

            resultados.push(nuevoSeguimiento);
        }

        res.json({
            message: "Seguimientos agregados exitosamente.",
            registros: resultados
        });

    } catch (error) {
        console.error('Error al insertar los seguimientos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putSeguimientoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor } = req.body;

        if (!completocurso || !tipocertificacion) {
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


export const deleteSeguimientoEstudianteC = async (req, res) => {
    try {
        const { idestudiante, idaccionformativa } = req.params;
        const seguimientoEliminado = await deleteSeguimientoEstudianteM(idestudiante, idaccionformativa);

        if (!seguimientoEliminado) {
            return res.status(404).json({ message: "Seguimiento no encontrado" });
        }

        res.json({ message: "Seguimiento del estudiante eliminado exitosamente" });
    } catch (error) {
        console.error('Error al eliminar el seguimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}