import { getAccionFormativaM, postAccionFormativaM } from "../models/accionformativa.models.js";

export const getAccionFormativaC = async (req, res) => {
    try {
        const accform = await getAccionFormativaM();
        res.json(accform)
    } catch (error) {
        console.error('Error al obtener accform:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getAccionFormativaIdC = async (req, res) => {
    try {
        const { id } = req.params

        const accform = await getAccionFormativaIdM(id);

        if (!accform) {
            return res.status(404).json({ message: "Accion Formativa no encontrada" });
        }

        res.json(accform)
    } catch (error) {
        console.error('Error al obtener la Accion Formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const postAccionFormativaC = async (req, res) => {
    try {
        const { accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, 
            metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, creadopor } = req.body;
        console.log(req.body);
        // if (!accionformatica || !horastotales || !fechainicio || !fechafinal) {
        //     console.log("Faltan datos en la solicitud");
        //     return res.status(400).json({ error: "Faltan datos en la solicitud" });
        // }s
        const newAccionFormativa = await postAccionFormativaM(accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, creadopor);
        res.json({ message: "Accion Formativa agregada exitosamente: ", newAccionFormativa });
    }
    catch (error) {
        console.error('Error al insertar la Accion Formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putAccionFormativaC = async (req, res) => {
    try {
        const { id } = req.params;
        const { accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, 
            metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, modificadopor } = req.body;

        // if (!accionformatica || !horastotales || !fechainicio || !fechafinal) {
        //     console.log("Faltan datos en la solicitud");
        //     return res.status(400).json({ error: "Faltan datos en la solicitud" });
        // }

        const newAccionFormativa = await putAccionFormativaM(accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, modificadopor, id);
        res.json({ message: "Accion Formativa actualizada exitosamente: ", newAccionFormativa });

    } catch (error) {
        console.error('Error al insertar la Accion Formativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
