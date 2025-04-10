import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas
import jwt from "jsonwebtoken";
import { verificarUsuarioM } from '../models/ms_usuarios.models.js';
import { getPermisosUsuarioM } from '../models/ApiExternaEstudiantes.models.js';
import { postEstudianteC, postEstudianteExternoC } from './estudiantes.controller.js';
import { postEducacionNoFormalM, postEstudianteM } from '../models/estudiantes.models.js';



export const verificarUsuarioC = async (usuario, contraseña) => {
    try {
        if (!usuario || !contraseña) {
            return { existe: false, error: "Faltan datos en la solicitud" };
        }

        const user = await verificarUsuarioM(usuario);
        if (!user) {
            console.log("Usuario o contraseña incorrectos");
            return { existe: false, error: "Usuario o contraseña incorrectos" };
        }

        const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
        if (!contraseñaValida) {
            console.log("Usuario o contraseña incorrectos");
            return { existe: false, error: "Usuario o contraseña incorrectos" };
        }

        console.log("Usuario autenticado. Bienvenido: ", user.nombre);
        return { existe: true, user };

    } catch (error) {
        console.error("Error al verificar usuario:", error);
        return { existe: false, error: "Error en el servidor" };
    }
};




//permisos que tiene el usuario
export const getPermisosUsuarioC = async (usuario) => {
    //const { usuario } = req.body;

    try {
        const permisos = await getPermisosUsuarioM(usuario);

        if (!permisos || permisos.length === 0) {
            return { ok: false, error: "Permisos no encontrados" };
        }

        const permisosUsuario = permisos[0].permisos;

        const puedeInsertarEstudiantes = permisosUsuario.some(p =>
            p.objeto === "Estudiantes" &&
            p.modulo === "Estudiantes" &&
            p.insertar === true
        );

        return ({
            ok: true,
            puedeInsertar: puedeInsertarEstudiantes,
            permisos: permisosUsuario // útil para frontend si quieres mostrar opciones
        });

    } catch (error) {
        console.error('Error al obtener los permisos del usuario: ', error);
        return { ok: false, error: 'Error interno del servidor' };
    }
};





const tipoDeDato = (valor, tipo) => {
    // Permitir valores nulos o vacíos (excepto para tipos obligatorios si así lo defines más adelante)
    if (valor === null || valor === undefined) {
        return null;
    }

    if (tipo === 'date') {
        const regexFecha = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = valor.match(regexFecha);
        if (!match) {
            return `El campo ${valor} no tiene el formato correcto (yyyy-mm-dd).`;
        }

        const [_, anio, mes, dia ] = match;
        const fecha = new Date(`${anio}-${mes}-${dia}`);

        if (isNaN(fecha.getTime())) {
            return `El campo ${valor} no es una fecha válida.`;
        }

        return null;
    }

    if (tipo === 'number') {
        if (isNaN(Number(valor))) {
            return `El campo tiene un valor de tipo ${typeof valor}, se esperaba tipo ${tipo}`;
        }
        return null;
    }

    if (typeof valor !== tipo) {
        return `El campo tiene un valor de tipo ${typeof valor}, se esperaba tipo ${tipo}`;
    }

    return null;
};




export const procesarEstudiantes = async (req, res) => {
    const { usuario, contraseña, estudiantes } = req.body;

    if (!usuario || !contraseña || !Array.isArray(estudiantes)) {
        return res.status(400).json({ error: 'Faltan datos en la solicitud o el formato de estudiantes no es válido' });
    }

    // Verificar usuario
    const usuarioValido = await verificarUsuarioC(usuario, contraseña);
    if (!usuarioValido?.existe) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar permisos
    const permisosValidados = await getPermisosUsuarioC(usuario);
    if (!permisosValidados.ok || !permisosValidados.puedeInsertar) {
        return res.status(403).json({ error: permisosValidados.error || 'El usuario no tiene permisos para insertar estudiantes' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const estudiante of estudiantes) {
            console.log('Procesando estudiante:', estudiante);

            // Validar campos obligatorios y corregir nombres
            const camposRequeridos = {
                identificacion: 'string',
                nombre: 'string',
                fechanacimiento: 'date',
                edad: 'number',
                genero: 'string',
                //idnacionalidad: 'number',
                //idetnia: 'number',  // Nombre correcto del campo
                //idniveleducativo: 'number',
                //idgradoacademico: 'number',
                estudianoformal: 'number',
                trabajaactualmente: 'number',
                //iddepartamento: 'number',
                //idmunicipio: 'number',
                //idaldea: 'number',
                //direccion: 'string',
                sabecomputacion: 'string',
                manejaprogramas: 'string',
                dispositivostecnologicos: 'string',
                plataformasvirtuales: 'string',
                estudioencasa: 'number',
                pasarsindistraccion: 'number',
                migranteretornado: 'number'
            };

            // Verificar campos requeridos
            for (const [campo, tipo] of Object.entries(camposRequeridos)) {
                if (estudiante[campo] === undefined || estudiante[campo] === null) {
                    await client.query('ROLLBACK');
                    client.release();
                    return res.status(400).json({ 
                        error: `El campo ${campo} es obligatorio`,
                        estudiante: estudiante,
                        campoFaltante: campo
                    });
                }
                
                // Validar tipo de dato
                const errorTipo = tipoDeDato(estudiante[campo], tipo);
                if (errorTipo) {
                    await client.query('ROLLBACK');
                    client.release();
                    return res.status(400).json({ 
                        error: errorTipo,
                        estudiante: estudiante,
                        campo: campo
                    });
                }
            }

            // Preparar datos con el usuario creador
            const datosEstudiante = {
                ...estudiante,
                creadopor: usuarioValido.user.id // Asegurar que tenga creador
            };

            try {
                // Insertar estudiante
                const result = await postEstudianteM(
                    datosEstudiante.identificacion,
                    datosEstudiante.nombre,
                    datosEstudiante.fechanacimiento,
                    datosEstudiante.edad,
                    datosEstudiante.genero,
                    datosEstudiante.idnacionalidad,
                    datosEstudiante.idetnia,  
                    datosEstudiante.telefono,
                    datosEstudiante.estadocivil,
                    datosEstudiante.idniveleducativo,
                    datosEstudiante.idgradoacademico,
                    datosEstudiante.estudianoformal,
                    datosEstudiante.trabajaactualmente,
                    datosEstudiante.iddiscapacidad,
                    datosEstudiante.detallediscapacidad,
                    datosEstudiante.iddepartamento,
                    datosEstudiante.idmunicipio,
                    datosEstudiante.idaldea,
                    datosEstudiante.caserio,
                    datosEstudiante.direccion,
                    datosEstudiante.sabecomputacion,
                    datosEstudiante.manejaprogramas,
                    datosEstudiante.dispositivostecnologicos,
                    datosEstudiante.plataformasvirtuales,
                    datosEstudiante.estudioencasa,
                    datosEstudiante.pasarsindistraccion,
                    datosEstudiante.migranteretornado,
                    datosEstudiante.motivomigracion,
                    datosEstudiante.otromotivomigracion,
                    datosEstudiante.llegousa,
                    datosEstudiante.familiarmigranteretornado,
                    datosEstudiante.miembrosalioynoregreso,
                    datosEstudiante.volveriaamigrar,
                    datosEstudiante.creadopor
                );

                // Insertar educación no formal
                if (datosEstudiante.educacionNoFormal && Array.isArray(datosEstudiante.educacionNoFormal)) {
                    const idestudiante = result[0].id;
                    for (const curso of datosEstudiante.educacionNoFormal) {
                        await postEducacionNoFormalM(curso, idestudiante);
                    }
                }
            } catch (error) {
                console.error('Error al insertar estudiante:', error);
                await client.query('ROLLBACK');
                client.release();
                return res.status(500).json({ 
                    error: 'Error al insertar el estudiante',
                    detalle: error.message,
                    estudiante: datosEstudiante
                });
            }
        }

        await client.query('COMMIT');
        client.release();
        return res.status(200).json({ 
            mensaje: 'Estudiantes procesados correctamente',
            total: estudiantes.length 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('Error en la transacción:', error);
        return res.status(500).json({ 
            error: 'Error en la transacción de los estudiantes',
            detalle: error.message 
        });
    }
};