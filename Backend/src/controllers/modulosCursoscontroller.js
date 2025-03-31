import { getModulosCursosIdCurriculaM, getModulosCursosIdM, getModulosCursosM, postModulosCursosM, putModulosCursosM } from "../models/modulosCursos.models.js";


export const getModulosCursosC = async (req, res) => {
    try {
        const modulosCursos = await getModulosCursosM();
        res.json(modulosCursos)
    } catch (error) {
        console.error('Error al obtener los modulos del Curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getModulosCursoIdC = async (req, res) => {
    try {
        const { id } = req.params
        const modulosCursos = await getModulosCursosIdM(id);

        if (!modulosCursos) {
            return res.status(404).json({ message: "modulos del curso no encontrados" });
        }

        res.json(modulosCursos );
    } catch (error) {
        console.error('Error al obtener la modulos del curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const getModulosCursosIdCurriculaC = async (req, res) => {
    try {
        const { id } = req.params
        const modulosCursosCurricula = await getModulosCursosIdCurriculaM(id);

        if (!modulosCursosCurricula) {
            return res.status(404).json({ message: "modulosCursosCurricula no encontrada" });
        }

        res.json( modulosCursosCurricula);
    } catch (error) {
        console.error('Error al obtener la modulosCursosCurricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const postModulosCursoC = async (req, res) => {
    try {
        const { modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, creadopor } = req.body
        console.log(req.body);
        const modulosCurso = await postModulosCursosM(modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, creadopor);
        res.json({ message: "Modulo agregado", modulosCursos: modulosCurso });
    } catch (error) {
        console.error('Error al obtener modulosCursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putModulosCursoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, modificadopor } = req.body
        console.log(req.body);
        const modulosCurso = await putModulosCursosM( modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso,  modificadopor, id);
        res.json({ message: "modulosCurso actualizado", modulosCursos: modulosCurso });
    } catch (error) {
        console.error('Error al obtener modulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


