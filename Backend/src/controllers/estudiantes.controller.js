import { getEstudianteIdM, getEstudiantesM, postEstudianteM, putEstudianteM } from "../models/estudiantes.models.js";


export const getEstudiantesC = async (req, res) => {
    try {
        const estudiantes= await getEstudiantesM();
        res.json(estudiantes);

    } catch (error) {
        console.log('Error al obtener estudiantes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


export const getEstudianteIdC = async (req, res) => {
    try {
        const { id } = req.params;
        const estudiante = await getEstudianteIdM(id);

        if (!estudiante) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        // Retornar el ID del estudiante 
        res.json(estudiante );
    } catch (error) {
        console.error('Error al obtener el estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postEstudianteC = async (req, res) => {
    try {
        const { identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil, 
            idniveleducativo, idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad, 
            iddepartamento, idmunicipio, idaldea, caserio, direccion, creadopor
        } = req.body
        console.log(req.body);


        const Estudiantes = await postEstudianteM(identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, 
            telefono, estadocivil, idniveleducativo, idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, 
            detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio, direccion, creadopor)

        res.json({ message: "Estudiante agregado", Estudiante: Estudiantes });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putEstudianteC = async (req, res) => {
    try {
        const { id } = req.params;
        const { identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil, 
            idniveleducativo, idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad, 
            iddepartamento, idmunicipio, idaldea, caserio, direccion, creadopor
        } = req.body
        console.log(req.body);


        const Estudiantes = await putEstudianteM(identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, 
            telefono, estadocivil, idniveleducativo, idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, 
            detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio, direccion, creadopor, id)

        res.json({ message: "Estudiante actualizado", Estudiante: Estudiantes });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}