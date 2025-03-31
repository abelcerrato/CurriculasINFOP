import { getMaestroIdM, getMaestrosM, postMaestroM, putMaestroM } from "../models/maestros.models.js";

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
        const {nombre, identificacion, correo, telefono, genero, idniveleducativo, 
            iddepartamento, idmunicipio, idaldea, caserio, direccion, 
            educacionformal, creadopor, idtipoeducador } = req.body
        console.log(req.body);


        const Maestros = await postMaestroM(nombre, identificacion, correo, telefono, genero, idniveleducativo, 
            iddepartamento, idmunicipio, idaldea, caserio, direccion, 
            educacionformal, creadopor, idtipoeducador)

        res.json({ message: "Maestro agregado", Maestro: Maestros });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putMaestroC = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, identificacion, correo, telefono, genero, idniveleducativo, 
            iddepartamento, idmunicipio, idaldea, caserio, direccion, 
            educacionformal,  idtipoeducador, modificadopor } = req.body;

        const Maestros = await putMaestroM(nombre, identificacion, correo, telefono, genero, idniveleducativo, 
            iddepartamento, idmunicipio, idaldea, caserio, direccion, 
            educacionformal,  idtipoeducador, modificadopor, id);

        res.json({ message: "Maestro actualizado", Maestro: Maestros });
    } catch (error) {
        console.error('Error al actualizar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}