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
                    clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, curriculaId, moduloId, creadopor
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
                id: idmodulo, modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                modificadopor, clases
            } = moduloData;

            let savedModulo;
            if (idmodulo) {
                // Verificar si el módulo ya existe
                const existsModulo = await getModulosCurriculaIdM(idmodulo);
                if (existsModulo.length > 0) {
                    // Si el módulo existe, actualizar
                    savedModulo = await putModulosCurriculaM(
                        modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                        curriculaId, modificadopor, idmodulo
                    );
                } else {
                    // Si no existe, insertar con el idmodulo proporcionado
                    // (esto podría ser un error en los datos, ya que se proporcionó un ID pero no existe)
                    savedModulo = await postModulosCurriculaM(
                        modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                        curriculaId, creadopor
                    );
                }
            } else {
                // Si no hay idmodulo, insertar como nuevo módulo
                savedModulo = await postModulosCurriculaM(
                    modulo, duracionteoricaModulo, duracionpractiaModulo, duraciontotalModulo,
                    curriculaId, creadopor
                );
            }

            updatedModules.push(savedModulo);

            if (!savedModulo || !savedModulo.id) {
                throw new Error('No se pudo guardar el módulo correctamente');
            }

            const moduloIdFinal = savedModulo.id || savedModulo[0]?.id; // Manejar ambos casos de retorno

            // Procesar las clases de este módulo
            for (const claseData of clases) {
                const {
                    id: idclase, clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, modificadopor: claseModificadopor
                } = claseData;

                let savedClase;
                if (idclase) {
                    // Verificar si la clase ya existe
                    const existsClase = await getIdClasesM(idclase);
                    if (existsClase.length > 0) {
                        // Si la clase existe, actualizar
                        savedClase = await putClasesModulosCurriculasM(
                            clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                            curriculaId, moduloIdFinal, claseModificadopor, idclase
                        );
                    } else {
                        // Si no existe, insertar
                        savedClase = await postClasesModulosCurriculasM(
                            clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                            curriculaId, moduloIdFinal, claseModificadopor
                        );
                    }
                } else {
                    // Si no hay idclase, insertar como nueva clase
                    savedClase = await postClasesModulosCurriculasM(
                        clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase,
                        curriculaId, moduloIdFinal, creadopor
                    );
                }

                updatedClasses.push(savedClase);
            }
        }

        res.json({
            message: 'Currícula, módulos y clases actualizados o insertados exitosamente',
            data: {
                curricula: updatedCurricula,
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
