import { deleteClaseM, postClasesModulosCurriculasM, putClasesModulosCurriculasM } from '../models/clasesModCurriculas.models.js';
import { deleteCurriculaM, getCurriculaIdM, getCurriculasM, postCurriculaM, putCurriculaM } from '../models/curriculas.models.js';
import { deleteModuloM, postModulosCurriculaM, putModulosCurriculaM } from '../models/modulosCurriculas.models.js';

export const getCurriculasC = async (req, res) => {
    try {
        const curriculas = await getCurriculasM();
        res.json(curriculas)
    } catch (error) {
        console.error('Error al obtener curriculas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getCurriculaIdC = async (req, res) => {
    try {
        const { id } = req.params
        const curricula = await getCurriculaIdM(id);

        if (!curricula) {
            return res.status(404).json({ message: "Curricula no encontrada" });
        }

        // Retornar el ID de la curricula 
        res.json({ id: curricula[0].id });
    } catch (error) {
        console.error('Error al obtener la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postCurriculaC = async (req, res) => {
    try {
        const { curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo,
            versioncurricula, educaciontemprana, idareaformacion, creadopor } = req.body;
        console.log(req.body);


        const newCurricula = await postCurriculaM(curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida,
            objetivo, versioncurricula, educaciontemprana, idareaformacion, creadopor);
        res.json({ message: "Curricula agregada exitosamente: ", newCurricula });

    } catch (error) {
        console.error('Error al insertar la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const putCurriculaC = async (req, res) => {
    try {
        const { id } = req.params;
        const { curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo,
            versioncurricula, educaciontemprana, idareaformacion, modificadopor } = req.body;


        const curriculaUpdated = await putCurriculaM(curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida,
            objetivo, versioncurricula, educaciontemprana, idareaformacion, modificadopor, id);
        res.json({ message: "Curricula actualizada exitosamente: ", curriculaUpdated });

    } catch (error) {
        console.error('Error al actualizar la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




//##########################################################################################################################################

export const postCurriculaModulosClasesC = async (req, res) => {
    const {
        curriculaData,    // Datos para la curricula
        modulosData,     // Datos para los módulos
        clasesData       // Datos para las clases
    } = req.body;

    try {


        //----------------------------------------------------------------------------------------------------------------------------------------
        // 1. Insertar la Curricula y obtener su ID
        const { curricula, sector, duracionteoricaCurricula, duracionpracticaCurricula, duraciontotalCurricula,
            nombresalida, objetivo, versioncurricula, educaciontemprana,
            idareaformacion, creadopor } = curriculaData;

        const newCurricula = await postCurriculaM(curricula, sector, duracionteoricaCurricula, duracionpracticaCurricula,
            duraciontotalCurricula, nombresalida, objetivo, versioncurricula, educaciontemprana,
            idareaformacion, creadopor);

        const curriculaId = newCurricula.id;
        console.log('ID de la curricula insertada:', curriculaId);  // Verificar el ID de la curricula insertada

        //------------------------------------------------------------------------------------------------------------------------------------
        // 2. Insertar los módulos con el ID de la curricula
        const insertedModules = [];
        const insertedClasses = [];

        for (const moduloData of modulosData) {
            const { modulo, duracionteoricaModulo, duracionpracticaModulo, duraciontotalModulo, creadopor, clases } = moduloData;

            const newModulo = await postModulosCurriculaM(
                modulo, duracionteoricaModulo, duracionpracticaModulo, duraciontotalModulo, curriculaId, creadopor
            );

            const moduloId = newModulo.id;
            console.log('ID del módulo insertado:', moduloId);
            insertedModules.push(moduloId);

            //--------------------------------------------------------------------------------------------------------------------------------
            for (const claseData of clases) {
                const { clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, creadopor } = claseData;

                const newClase = await postClasesModulosCurriculasM(
                    clase, duracionteoricaClase, duracionpracticaClase,duraciontotalClase, curriculaId, moduloId, creadopor
                );

                const claseId = newClase.id;
                console.log('ID de la clase insertada:', claseId);
                insertedClasses.push(claseId);
            }
        }



        //----------------------------------------------------------------------------------------------------------------------------------------
        // Responder con los IDs generados
        res.json({
            message: 'Curricula, módulos y clases insertados exitosamente',
            ids: {
                curriculaId,
                modulosIds: insertedModules,
                clasesIds: insertedClasses
            }
        });

    } catch (error) {
        console.error('Error al insertar curricula, módulo o clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



//##########################################################################################################################################



export const putCurriculaModulosClasesC = async (req, res) => {
    const {
        curriculaData,    // Datos para la curricula
        modulosData       // Cada módulo debe incluir su ID y sus clases con ID
    } = req.body;

    try {
        //---------------------------------------------------------------------------------------------------------------------------------
        // 1. Editar la Curricula
        const {
            id, curricula, sector, duracionteoricaCurricula, duracionpracticaCurricula, duraciontotalCurricula,
            nombresalida, objetivo, versioncurricula, educaciontemprana,
            idareaformacion, modificadopor
        } = curriculaData;

        const updatedCurricula = await putCurriculaM(
            curricula, sector, duracionteoricaCurricula, duracionpracticaCurricula, duraciontotalCurricula,
            nombresalida, objetivo, versioncurricula, educaciontemprana,
            idareaformacion, modificadopor, id
        );

        //---------------------------------------------------------------------------------------------------------------------------------
        // 2. Editar los módulos y sus clases
        const updatedModules = [];
        const updatedClasses = [];

        for (const moduloData of modulosData) {
            const {
                id: moduloId, modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                modificadopor, clases
            } = moduloData;

            const updatedModulo = await putModulosCurriculaM(
                modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,id, modificadopor, moduloId
            );
            updatedModules.push(updatedModulo[0]);

            //-----------------------------------------------------------------------------------------------------------------------------
            for (const claseData of clases) {
                const {
                    id: claseId, clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, modificadopor
                } = claseData;

                const updatedClase = await putClasesModulosCurriculasM(
                    clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, id, moduloId, modificadopor, claseId
                );
                updatedClasses.push(updatedClase[0]);
            }
        }

        res.json({
            message: 'Curricula, módulos y clases actualizados exitosamente',
            data: {
                curricula: updatedCurricula[0],
                modulos: updatedModules,
                clases: updatedClasses
            }
        });

    } catch (error) {
        console.error('Error al actualizar curricula, módulos o clases:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




export const deleteCurriculaModuloClaseC = async (req, res) => {
    const { type, id } = req.params;

    try {
        let deleted;

        switch (type) {
            case 'curricula':
                deleted = await deleteCurriculaM(id);
                break;
            case 'modulo':
                deleted = await deleteModuloM(id);
                break;
            case 'clase':
                deleted = await deleteClaseM(id);
                break;
            default:
                return res.status(400).json({ error: 'Tipo de eliminación no válido' });
        }

        if (!deleted) {
            return res.status(404).json({ error: 'No se encontró el recurso para eliminar' });
        }

        res.json({ message: `${type} eliminado correctamente`, deleted });

    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
