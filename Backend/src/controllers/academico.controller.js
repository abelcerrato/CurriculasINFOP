
import { getGradoAcademicoIdM, getGradoAcademicoIdNivelM, getGradosAcademicosM, getNivelAcademicoM, getNivelesAcademicosM, postGradoAcademicoM, postNivelAcademicoM, putGradoAcademicoM, putNivelAcademicoM } from "../models/academico.models.js";

//////////////////////////////////////////////////////////////////////////////////////////////
//                                      NIVELES ACADEMICOS
//////////////////////////////////////////////////////////////////////////////////////////////


export const getNivelesAcademicosC = async (req, res) => {
    try {
        const NivelAcademico = await getNivelesAcademicosM();
        res.json(NivelAcademico)
    } catch (error) {
        console.error('Error al obtener registros de Nivel Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el id del nivel academico mediante el nombre
export const getNivelAcademicoIdC = async (req, res) => {
    try {
        const {id} = req.params
        const NivelAcademicos = await getNivelAcademicoM(id);
        res.json(NivelAcademicos)
    } catch (error) {
        console.error('Error al obtener registros de Nivel Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


export const postNivelAcademicoC = async (req, res) => {
    try {
        const {nivelacademico} = req.body;
        console.log(req.body);
        if (!nivelacademico) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }
        const newNivelAcademico = await postNivelAcademicoM(nivelacademico);
        res.json({ message: "Nivel Académico agregado exitosamente: ", newNivelAcademico });
    
    } catch (error) {
        console.error('Error al insertar el Nivel Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const putNivelAcademicoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { nivelacademico } = req.body;

        if (!nivelacademico) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newNivelAcademico = await putNivelAcademicoM(nivelacademico, id);
        res.json({ message: "Nivel Académico actualizado exitosamente: ", newNivelAcademico });

    } catch (error) {
        console.error('Error al actualizar el Nivel Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////
//                                      GRADOS ACADEMICOS
//////////////////////////////////////////////////////////////////////////////////////////////


export const getGradosAcademicosC = async (req, res) => {
    try {
        const Grados = await getGradosAcademicosM();
        res.json(Grados)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el id grado academico mediante el nombre
export const getGradoAcademicoIdC = async (req, res) => {
    try {
        const {id} = req.params
        const Grados = await getGradoAcademicoIdM(id);
        res.json(Grados)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el grado academico mediante el id del nivel academico
export const getGradoAcademicoIdNivelC = async (req, res) => {
    try {
        
        const {IdNivel} = req.params
        const Grados = await getGradoAcademicoIdNivelM(IdNivel);
        res.json(Grados)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


export const postGradoAcademicoC = async (req, res) => {
    try {
        const {gradoacademico, idnivelacademico} = req.body;
        console.log(req.body);
        if (!gradoacademico || !idnivelacademico) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }
        const newGradoAcademico = await postGradoAcademicoM(gradoacademico, idnivelacademico);
        res.json({ message: "Grado Académico agregado exitosamente: ", newGradoAcademico });
    
    } catch (error) {
        console.error('Error al insertar el Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putGradoAcademicoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { gradoacademico, idnivelacademico } = req.body;

        if (!gradoacademico || !idnivelacademico) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newGradoAcademico = await putGradoAcademicoM(gradoacademico, idnivelacademico, id);
        res.json({ message: "Grado Académico actualizado exitosamente: ", newGradoAcademico });

    } catch (error) {
        console.error('Error al actualizar el Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}