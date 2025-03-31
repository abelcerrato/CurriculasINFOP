import { getClasesModulosCursosM, getIdClasesModulosCursosM, getClasesIdModulosCursoM, getClasesModulosIdCursoM, getClasesModulosCursoIdCurriculaM, postClasesModulosCursosM, putClasesModulosCursosM } from "../models/clasesModCursos.models.js"

//get de todas los clases
export const getClasesModulosCursosC = async (req, res) => {
    try {
        const clasesModulosCursos= await getClasesModulosCursosM();
        res.json(clasesModulosCursos);

    } catch (error) {
        console.log('Error al obtener clasesModulosCursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


//get de todos los datos de la clase por id de la clase
export const getIdClasesModulosCursosC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCursos= await getIdClasesModulosCursosM(id);
        res.json(idclasesModulosCursos);

    } catch (error) {
        console.log('Error al obtener clasesModulosCursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


//get de todas los clases por id del modulo
export const getClasesIdModulosCursosC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCursos= await getClasesIdModulosCursoM(id);
        res.json(idclasesModulosCursos);

    } catch (error) {
        console.log('Error al obtener clasesModulosCursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


//get de todas los clases por id del curso
export const getClasesModulosIdCursoC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCursos= await getClasesModulosIdCursoM(id);
        res.json(idclasesModulosCursos);

    } catch (error) {
        console.log('Error al obtener clasesModulosCursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


//get de todas los clases por id de la curricula
export const getClasesModulosCursoIdCurriculaC = async (req, res) => {
    try {
        const { id } = req.params;
        const idclasesModulosCursosCurricula= await getClasesModulosCursoIdCurriculaM(id);
        res.json(idclasesModulosCursosCurricula);

    } catch (error) {
        console.log('Error al obtener clasesModulosCursosCurricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}




export const postClasesModulosCursosC = async (req, res) => {
    try {
        const { clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, creadopor } = req.body
        console.log(req.body);


        const Clases = await postClasesModulosCursosM(clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, creadopor)

        res.json({ message: "Clase agregada", Clase: Clases });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const putClasesModulosCursosC = async (req, res) => {
    try {
        const { id } = req.params;
        const { clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, modificadopor } = req.body
        console.log(req.body);


        const Clases = await putClasesModulosCursosM(clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, modificadopor, id)

        res.json({ message: "Clase actualizada", Clase: Clases });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


