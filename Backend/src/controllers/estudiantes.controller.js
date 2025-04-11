import { deleteEducacionNoFormalM, getEstudianteIdM, getEstudiantesM, postEducacionNoFormalM, postEstudianteM, putEstudianteM } from "../models/estudiantes.models.js";


export const getEstudiantesC = async (req, res) => {
    try {
        const estudiantes = await getEstudiantesM();
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
        res.json(estudiante);
    } catch (error) {
        console.error('Error al obtener el estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postEstudianteC = async (req, res) => {
    try {
        const { identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
            estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
            iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
            direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
            estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
            llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, creadopor,
            educacionnoformal
        } = req.body
        console.log(req.body);


        const Estudiantes = await postEstudianteM(identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
            estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
            iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
            direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
            estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
            llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, creadopor)


        const idestudiante = Estudiantes[0].id;
        //console.log("id del estudiante: ", idestudiante);

        let cursosInsertados = [];
        if (Array.isArray(educacionnoformal)) {
            for (const curso of educacionnoformal) {
                const result = await postEducacionNoFormalM(curso, idestudiante);
                cursosInsertados.push(result);
            }
        }


        res.json({
            message: "Estudiante agregado exitosamente",
            Estudiantes,
            educacionnoformal: cursosInsertados
        });

    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putEstudianteC = async (req, res) => {
    try {
        const { id } = req.params;
        const { identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
            estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
            iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
            direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
            estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
            llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, modificadopor, educacionnoformal
        } = req.body
        console.log(req.body);


        const Estudiantes = await putEstudianteM(identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
            estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
            iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
            direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
            estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
            llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, modificadopor, id)

        //elimina la educacion no formal existente del estudiante
        await deleteEducacionNoFormalM(id);

        //registra la nueva educacion no formal
        let cursosActualizados = [];
        if (Array.isArray(educacionnoformal)) {
            for (const curso of educacionnoformal) {
                const result = await postEducacionNoFormalM(curso, id);
                cursosActualizados.push(result);
            }
        }


        res.json({
            message: "Estudiante actualizado exitosamente",
            Estudiantes,
            educacionnoformal: cursosActualizados
        });
    } catch (error) {
        console.error('Error al actualizar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

