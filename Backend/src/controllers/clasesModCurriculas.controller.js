import { deleteClaseM, getClasesIdModulosCurriculasM, getClasesModulosCurriculasM, getClasesModulosIdCurriculasM, getIdClasesModulosCurriculasM, postClasesModulosCurriculasM, putClasesModulosCurriculasM } from "../models/clasesModCurriculas.models.js"


export const getClasesModulosCurriculasC = async (req, res) => {
    try {
        const clasesModulosCurriculas= await getClasesModulosCurriculasM();
        res.json(clasesModulosCurriculas);

    } catch (error) {
        console.log('Error al obtener clasesModulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


export const getIdClasesModulosCurriculasC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCurriculas= await getIdClasesModulosCurriculasM(id);
        res.json(idclasesModulosCurriculas);

    } catch (error) {
        console.log('Error al obtener clasesModulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


export const getClasesIdModulosCurriculasC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCurriculas= await getClasesIdModulosCurriculasM(id);
        res.json(idclasesModulosCurriculas);

    } catch (error) {
        console.log('Error al obtener clasesModulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


export const getClasesModulosIdCurriculasC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCurriculas= await getClasesModulosIdCurriculasM(id);
        res.json(idclasesModulosCurriculas);

    } catch (error) {
        console.log('Error al obtener clasesModulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


export const postClasesModulosCurriculasC = async (req, res) => {
    try {
        const { clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, creadopor } = req.body
        console.log(req.body);


        const Clases = await postClasesModulosCurriculasM(clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, creadopor)

        res.json({ message: "Clase agregada", Clase: Clases });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putClasesModulosCurriculasC = async (req, res) => {
    try {
        const { id } = req.params;
        const { clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, modificadopor } = req.body
        console.log(req.body);


        const Clases = await putClasesModulosCurriculasM(clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, modificadopor, id)

        res.json({ message: "Clase actualizada", Clase: Clases });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const deleteClasesC = async (req, res) => {
    try {
        const { id } = req.params;
        const Clases = await deleteClaseM(id)

        res.json({ message: "Clase eliminada", Clase: Clases });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

