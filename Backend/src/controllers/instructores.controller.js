import { deleteEducacionNoFormalM, getMaestroIdM, getMaestrosM, postEducacionNoFormalM, postMaestroM, putMaestroM } from "../models/instructores.models.js";

export const getMaestrosC = async (req, res) => {
    try {
        const maestros = await getMaestrosM();
        res.json(maestros)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getMaestroIdC = async (req, res) => {
    try {
        const { id } = req.params
        const maestro = await getMaestroIdM(id);

        if (!maestro) {
            return res.status(404).json({ message: "Maestro no encontrado" });
        }

        // Retornar el ID del maestro 
        res.json(maestro);
    } catch (error) {
        console.error('Error al obtener el maestro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postMaestroC = async (req, res) => {
    try {
        const { nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
            idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion,
            idtipoeducador, creadopor,
            educacionNoFormal } = req.body
        console.log(req.body);


        const Maestros = await postMaestroM(nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
            idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion,
            idtipoeducador, creadopor)


        const idmaestro = Maestros[0].id;
        //console.log("id del estudiante: ", idmaestro);

        let cursosInsertados = [];
        if (Array.isArray(educacionNoFormal)) {
            for (const curso of educacionNoFormal) {
                const result = await postEducacionNoFormalM(curso, idmaestro);
                cursosInsertados.push(result);
            }
        }


        res.json({
            message: "Maestro agregado",
            Maestros,
            EducacionNoFormal: cursosInsertados
        });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putMaestroC = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
            idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion,
            idtipoeducador, modificadopor,
            educacionNoFormal } = req.body;

        const Maestros = await putMaestroM(nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
            idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion,
            idtipoeducador, modificadopor, id);

        //elimina la educacion no formal existente del estudiante
        await deleteEducacionNoFormalM(id);

        //registra la nueva educacion no formal
        let cursosActualizados = [];
        if (Array.isArray(educacionNoFormal)) {
            for (const curso of educacionNoFormal) {
                const result = await postEducacionNoFormalM(curso, id);
                cursosActualizados.push(result);
            }
        }


        res.json({ 
            message: "Maestro actualizado", 
            Maestros,
            EducacionNoFormal: cursosActualizados
        });
    } catch (error) {
        console.error('Error al actualizar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}