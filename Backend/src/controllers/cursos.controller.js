import { getCursoIdM, getCursosM, postCursosM, putCursoM } from '../models/cursos.models.js';

export const getCursosC = async (req, res) => {
    try {
        const cursos = await getCursosM();
        res.json(cursos)
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}   


export const getCursoIdC = async (req, res) => {
    try {
        const { id } = req.params
        const curso = await getCursoIdM(id);

        if (!curso) {
            return res.status(404).json({ message: "curso no encontrado" });
        }

        // Retornar el ID de el curso 
        res.json({ id: curso[0].id });
    } catch (error) {
        console.error('Error al obtener el curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const postCursosC = async (req, res) => {
    try {
        const { curso, fechainicio, fechafinalizacion, nombresalida, idcurricula, 
            iddepartamento, idmunicipio, lugardesarrollo, duracionteorica, 
            duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, creadopor } = req.body;
        console.log(req.body);


        const newCurso = await postCursosM(curso, fechainicio, fechafinalizacion, nombresalida, idcurricula, 
            iddepartamento, idmunicipio, lugardesarrollo, duracionteorica, 
            duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, creadopor);
        res.json({ message: "Curso agregado exitosamente: ", newCurso });

    } catch (error) {
        console.error('Error al insertar el curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putCursoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { curso, fechainicio, fechafinalizacion, nombresalida, idcurricula, 
            iddepartamento, idmunicipio, lugardesarrollo, duracionteorica, 
            duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, modificadopor } = req.body;


        const cursoUpdated = await putCursoM(curso, fechainicio, fechafinalizacion, nombresalida, idcurricula, 
            iddepartamento, idmunicipio, lugardesarrollo, duracionteorica, 
            duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, modificadopor, id);
        res.json({ message: "Curso actualizado exitosamente: ", cursoUpdated });

    } catch (error) {
        console.error('Error al actualizar el curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}