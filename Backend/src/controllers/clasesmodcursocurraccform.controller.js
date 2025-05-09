import { getClasModCurrAccFormIdM, getClasModCurrAccFormM, postClasModCurrAccFormM, putClasModCurrAccFormM } from "../models/clasesmodcursocurraccform.models.js";


export const getClasModCurrAccFormC = async (req, res) => {
    try {
        const accform = await getClasModCurrAccFormM();
        res.json(accform)
    } catch (error) {
        console.error('Error al obtener las clases, modulos, curriculas de la acción formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getClasModCurrAccFormIdC = async (req, res) => {
    try {
        const { id } = req.params

        const accform = await getClasModCurrAccFormIdM(id);

        if (!accform) {
            return res.status(404).json({ message: "Clase, Modulo, Curricula de la Acción Formativa no encontrada" });
        }

        res.json(accform)
    } catch (error) {
        console.error('Error al obtener la Clase, Modulo, Curricula de la Acción Formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postClasModCurrAccFormC = async (req, res) => {
    try {
        const { idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, creadopor } = req.body;
        console.log(req.body);
        // if (!accionformatica || !horastotales || !fechainicio || !fechafinal) {
        //     console.log("Faltan datos en la solicitud");
        //     return res.status(400).json({ error: "Faltan datos en la solicitud" });
        // }
        const newClasModCurrAccForm = await postClasModCurrAccFormM(idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, creadopor);
        res.json({ message: "Clase, Modulo y Curricula de la Acción Formativa agregada exitosamente: ", newClasModCurrAccForm });
    }
    catch (error) {
        console.error('Error al insertar la Clase, Modulo y Curricula de la Acción Formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putClasModCurrAccFormC = async (req, res) => {
    try {
        const { id } = req.params;
        const { idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, modificadopor } = req.body;

        // if (!accionformatica || !horastotales || !fechainicio || !fechafinal) {
        //     console.log("Faltan datos en la solicitud");
        //     return res.status(400).json({ error: "Faltan datos en la solicitud" });
        // }
        const accform = await getClasModCurrAccFormIdM(id);
        if (!accform) {
            return res.status(404).json({ message: "Clase, Modulo y Curricula de la Acción Formativa no encontrada" });
        }
        const updatedAccionFormativa = await putClasModCurrAccFormM(id, idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, modificadopor, id);
        res.json({ message: "Clase, Modulo y Curricula de la Acción Formativa actualizada exitosamente: ", updatedAccionFormativa });
    }
    catch (error) {
        console.error('Error al actualizar la Clase, Modulo y Curricula de la Acción Formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
