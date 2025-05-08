import { deleteModuloM, getModulosCurriculaIdM, getModulosCurriculasM, getModulosIdCurriculaM, postModulosCurriculaM, putModulosCurriculaM } from "../models/modulosCurriculas.models.js";


export const getModulosCurriculasC = async (req, res) => {
    try {
        const modulosCurriculas = await getModulosCurriculasM();
        res.json(modulosCurriculas)
    } catch (error) {
        console.error('Error al obtener modulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getModulosCurriculaIdC = async (req, res) => {
    try {
        const { id } = req.params
        const modulosCurricula = await getModulosCurriculaIdM(id);

        if (!modulosCurricula) {
            return res.status(404).json({ message: "ModulosCurricula no encontrada" });
        }

        // Retornar el ID de la modulosCurricula 
        res.json(modulosCurricula);
    } catch (error) {
        console.error('Error al obtener la modulosCurricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getModulosIdCurriculaC = async (req, res) => {
    try {
        const { id } = req.params
        const modulosCurricula = await getModulosIdCurriculaM(id);

        if (!modulosCurricula) {
            return res.status(404).json({ message: "ModulosCurricula no encontrada" });
        }


        res.json(modulosCurricula);
    } catch (error) {
        console.error('Error al obtener la modulosCurricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postModulosCurriculaC = async (req, res) => {
    try {
        const { modulo, duracionteorica, duracionpractica, duraciontotal, idcurricula, creadopor } = req.body
        console.log(req.body);
        const modulosCurricula = await postModulosCurriculaM(modulo, duracionteorica, duracionpractica, duraciontotal, idcurricula, creadopor);
        res.json({ message: "Modulo agregado", modulosCurriculas: modulosCurricula });
    } catch (error) {
        console.error('Error al obtener modulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putModulosCurriculaC = async (req, res) => {
    try {
        const { id } = req.params;
        const { modulo, duracionteorica, duracionpractica, duraciontotal, idcurricula, modificadopor } = req.body
        console.log(req.body);
        const modulosCurricula = await putModulosCurriculaM(modulo, duracionteorica, duracionpractica, duraciontotal, idcurricula, modificadopor, id);
        res.json({ message: "ModulosCurricula actualizado", modulosCurriculas: modulosCurricula });
    } catch (error) {
        console.error('Error al obtener modulosCurriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const deleteModuloC = async (req, res) => {
    const { id } = req.params;
    console.log('id', req.params);

    try {
        const deletedModulo = await deleteModuloM(id);

        if (!deletedModulo) {
            return res.status(404).json({ message: 'Módulo no encontrado o ya eliminado' });
        }

        res.json({
            message: 'Módulo y sus clases asociadas eliminados correctamente',
            deletedModulo
        });

    } catch (error) {
        console.error('Error al eliminar el módulo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
