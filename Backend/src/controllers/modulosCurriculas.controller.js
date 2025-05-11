import { postClasesModulosCurriculasM } from "../models/clasesModCurriculas.models.js";
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


//##########################################################################################################################################
//INSERTA MODULOS Y CLASES
export const postModulosClasesC = async (req, res) => {
    const { curriculaId, modulosData } = req.body;

    try {
        const insertedModules = [];
        const insertedClasses = [];

        for (const moduloData of modulosData) {
            const {
                modulo, duracionteoricaModulo, duracionpracticaModulo, duraciontotalModulo,
                creadopor, modificadopor, clases
            } = moduloData;

            const newModulo = await postModulosCurriculaM(
                modulo, duracionteoricaModulo, duracionpracticaModulo, duraciontotalModulo,
                curriculaId, creadopor, modificadopor
            );

            insertedModules.push(newModulo);

            const moduloIdFinal = newModulo.id || newModulo[0]?.id;

            for (const claseData of clases) {
                const {
                    clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase
                } = claseData;

                const newClase = await postClasesModulosCurriculasM(
                    clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                    curriculaId, moduloIdFinal, creadopor
                );

                insertedClasses.push(newClase);
            }
        }

        res.json({
            message: 'Módulos y clases insertados exitosamente',
            data: {
                modulos: insertedModules,
                clases: insertedClasses
            }
        });

    } catch (error) {
        console.error('Error al insertar módulos o clases:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//##########################################################################################################################################


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
