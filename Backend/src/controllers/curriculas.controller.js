import { deleteClaseM, getClasesModulosCurriculasM, getIdClasesM, getIdClasesModulosCurriculasM, postClasesModulosCurriculasM, putClasesModulosCurriculasM } from '../models/clasesModCurriculas.models.js';
import { deleteCurriculaM, getCurriculaIdM, getCurriculasM, postCurriculaM, putCurriculaM } from '../models/curriculas.models.js';
import { deleteModuloM, getModulosCurriculaIdM, postModulosCurriculaM, putModulosCurriculaM } from '../models/modulosCurriculas.models.js';
import { postClasesModulosCurriculasC } from './clasesModCurriculas.controller.js';

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
    const { curriculaId } = req.params;
    const { curriculaData, modulosData } = req.body;

    try {
        // 1. Actualizar Currícula
        const {
            curricula, sector, duracionteoricaCurricula, duracionpracticaCurricula, duraciontotalCurricula,
            nombresalida, objetivo, versioncurricula, educaciontemprana,
            idareaformacion, modificadopor, creadopor
        } = curriculaData;

        const updatedCurricula = await putCurriculaM(
            curricula, sector, duracionteoricaCurricula, duracionpracticaCurricula, duraciontotalCurricula,
            nombresalida, objetivo, versioncurricula, educaciontemprana,
            idareaformacion, modificadopor, curriculaId
        );

        // 2. Actualizar o insertar módulos y clases
        const updatedModules = [];
        const updatedClasses = [];

        for (const moduloData of modulosData) {
            const {
                id: moduloId, modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                modificadopor, clases
            } = moduloData;

            let savedModulo;
            if (moduloId) {
                const existsModulo = await getModulosCurriculaIdM(moduloId);
                if (existsModulo) {
                    savedModulo = await putModulosCurriculaM(
                        modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                        curriculaId, modificadopor, moduloId
                    );
                } else {
                    savedModulo = await postModulosCurriculaM(
                        modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                        curriculaId, creadopor
                    );
                }
            } else {
                savedModulo = await postModulosCurriculaM(
                    modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                    curriculaId, creadopor
                );
            }

            const moduloIdFinal = savedModulo[0].id; //retorna el ID insertado o actualizado
            updatedModules.push(savedModulo[0]);

            for (const claseData of clases) {
                const {
                    id: claseId, clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, modificadopor
                } = claseData;

                let savedClase;
                if (claseId) {
                    const existsClase = await getIdClasesM(claseId); // 
                    if (existsClase) {
                        savedClase = await putClasesModulosCurriculasM(
                            clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                            curriculaId, moduloIdFinal, modificadopor, claseId
                        );
                    } else {
                        savedClase = await postClasesModulosCurriculasM(
                            clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                            curriculaId, moduloIdFinal, modificadopor
                        );
                    }
                } else {
                    savedClase = await postClasesModulosCurriculasM(
                        clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                        curriculaId, moduloIdFinal, modificadopor
                    );
                }

                updatedClasses.push(savedClase[0]);
            }
        }

        res.json({
            message: 'Currícula, módulos y clases actualizados o insertados exitosamente',
            data: {
                curricula: updatedCurricula[0],
                modulos: updatedModules,
                clases: updatedClasses
            }
        });

    } catch (error) {
        console.error('Error al actualizar/insertar currícula, módulos o clases:', error);
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
