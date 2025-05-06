import { postClasesModulosCurriculasM } from '../models/clasesModCurriculas.models.js';
import { getCurriculaIdM, getCurriculasM, postCurriculaM, putCurriculaM } from '../models/curriculas.models.js';
import { postModulosCurriculaM } from '../models/modulosCurriculas.models.js';

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




export const postCurriculaModClasesC = async (req, res) => {
    try {
        const { curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo,
            versioncurricula, educaciontemprana, idareaformacion, creadopor } = req.body;
        console.log(req.body);


        const newCurricula = await postCurriculaM(curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida,
            objetivo, versioncurricula, educaciontemprana, idareaformacion, creadopor);

        // Obtener el id de la curricula insertada
        const curriculaId = newCurricula[0].id;  // Suponiendo que el id es 'id' en la tabla
        res.json({ message: "Curricula agregada exitosamente", curriculaId });

    } catch (error) {
        console.error('Error al insertar la curricula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//---------------------------------------------------------------------------------------------------------------------------------------

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

        //----------------------------------------------------------------------------------------------------------------------------------------
        // 2. Insertar los módulos con el ID de la curricula
        const insertedModules = [];
        const insertedClasses = [];

        for (const moduloData of modulosData) {
            const { modulo, duracionteoricaModulo, duracionpracticaModulo, duraciontotalModulo, creadoporModulo, clases } = moduloData;

            const newModulo = await postModulosCurriculaM(
                modulo, duracionteoricaModulo, duracionpracticaModulo, duraciontotalModulo, curriculaId, creadoporModulo
            );

            const moduloId = newModulo.id;
            console.log('ID del módulo insertado:', moduloId);
            insertedModules.push(moduloId);

            for (const claseData of clases) {
                const { clase, duracionteoricaClase, duracionpracticaClase, duraciontotalClase, creadoporClase } = claseData;

                const newClase = await postClasesModulosCurriculasM(
                    clase, duracionteoricaClase, duracionpracticaClase,
                    duraciontotalClase, curriculaId, moduloId, creadoporClase
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