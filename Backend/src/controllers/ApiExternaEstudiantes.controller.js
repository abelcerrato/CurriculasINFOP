import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas
import jwt from "jsonwebtoken";
import { verificarUsuarioM } from '../models/ms_usuarios.models.js';
import { getPermisosUsuarioM } from '../models/ApiExternaEstudiantes.models.js';
import { postEstudianteM } from '../models/estudiantes.models.js';



export const verificarUsuarioC = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        console.log(req.body);

        if (!usuario || !contraseña) {
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const user = await verificarUsuarioM(usuario);

        if (!user) {
            console.log("Usuario o contraseña incorrectos");
            return res.json({ existe: false });  // usuario no encontrado
        }

        const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
        if (!contraseñaValida) {
            console.log("Usuario o contraseña incorrectos");
            return res.json({ existe: false });  // contraseña incorrecta
        }

        console.log("Usuario autenticado. Bienvenido: ", user.nombre);
        return res.json({ existe: true });  // usuario y contraseña válidos

    } catch (error) {
        console.error("Error al verificar usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};



//permisos que tiene el usuario
export const getPermisosUsuarioC = async (req, res) => {
    try {
        const { usuario } = req.body;
        const permisos = await getPermisosUsuarioM(usuario);

        if (!permisos || permisos.length === 0) {
            return res.status(404).json({ message: "Permisos no encontrados" });
        }

        const permisosUsuario = permisos[0].permisos; // array de permisos agregados por json_agg

        const puedeInsertarEstudiantes = permisosUsuario.some(p =>
            p.objeto === "Estudiantes" &&
            p.modulo === "Estudiantes" &&
            p.insertar === true
        );

        if (puedeInsertarEstudiantes) {
            return res.json({
                message: "El usuario tiene permisos para insertar estudiantes.",
                puedeInsertar: true
            });
        } else {
            return res.json({
                message: "El usuario NO tiene permisos para insertar estudiantes.",
                puedeInsertar: false
            });
        }

    } catch (error) {
        console.error('Error al obtener los permisos del usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}





const tipoDeDato = (valor, tipo) => {
    if (tipo === 'date') {
        // Validar que el valor sea una fecha válida
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) {
            return `El campo ${valor} no es una fecha válida.`;
        }
        return null;
    }

    if (typeof valor !== tipo) {
        return `El campo tiene un valor de tipo ${typeof valor}, se esperaba tipo ${tipo}`;
    }
    return null;
};



export const procesarEstudiantes = async (req, res) => {
    const { usuario, contraseña } = req.body;
    const { estudiantes } = req.body;

    // Verificar que el usuario y contraseña sean válidos
    const usuarioValido = await verificarUsuarioC(req, res);
    if (!usuarioValido) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar los permisos del usuario
    const permisosValidados = await getPermisosUsuarioC(req, res);
    if (!permisosValidados.puedeInsertar) {
        return res.status(403).json({ error: 'El usuario no tiene permisos para insertar estudiantes' });
    }

    // Si la validación y permisos son correctos, continuar con la transacción
    const client = await pool.connect();  // Obtén el cliente para manejar la transacción

    try {
        await client.query('BEGIN');  // Inicia la transacción

        for (const estudiante of estudiantes) {
            let errorMessage = null;

            // Validación de todos los campos
            const campos = [
                { campo: 'identificacion', tipo: 'string' },
                { campo: 'nombre', tipo: 'string' },
                { campo: 'fechanacimiento', tipo: 'date' },
                { campo: 'edad', tipo: 'number' },
                { campo: 'genero', tipo: 'string' },
                { campo: 'idnacionalidad', tipo: 'number' },
                { campo: 'idetnia', tipo: 'number' },
                { campo: 'telefono', tipo: 'string' },
                { campo: 'estadocivil', tipo: 'string' },
                { campo: 'idniveleducativo', tipo: 'number' },
                { campo: 'idgradoacademico', tipo: 'number' },
                { campo: 'estudianoformal', tipo: 'number' },
                { campo: 'trabajaactualmente', tipo: 'number' },
                { campo: 'iddiscapacidad', tipo: 'number' },
                { campo: 'detallediscapacidad', tipo: 'string' },
                { campo: 'iddepartamento', tipo: 'number' },
                { campo: 'idmunicipio', tipo: 'number' },
                { campo: 'idaldea', tipo: 'number' },
                { campo: 'caserio', tipo: 'string' },
                { campo: 'direccion', tipo: 'string' },
                { campo: 'sabecomputacion', tipo: 'string' },
                { campo: 'manejaprogramas', tipo: 'string' },
                { campo: 'dispositivostecnologicos', tipo: 'string' },
                { campo: 'plataformasvirtuales', tipo: 'string' },
                { campo: 'estudioencasa', tipo: 'number' },
                { campo: 'pasarsindistraccion', tipo: 'number' },
                { campo: 'migranteretornado', tipo: 'number' },
                { campo: 'motivomigracion', tipo: 'string' },
                { campo: 'otromotivomigracion', tipo: 'string' },
                { campo: 'llegousa', tipo: 'string' },
                { campo: 'familiarmigranteretornado', tipo: 'string' },
                { campo: 'miembrosalioynoregreso', tipo: 'string' },
                { campo: 'volveriaamigrar', tipo: 'string' }
            ];

            // Iterar sobre los campos y verificar el tipo
            for (let { campo, tipo } of campos) {
                errorMessage = tipoDeDato(estudiante[campo], tipo);
                if (errorMessage) {
                    await client.query('ROLLBACK');  // Revertir la transacción si ocurre un error
                    return res.status(400).json({ error: `${campo}: ${errorMessage}` });
                }
            }

            // Si no hubo errores, se insertan los registros
            try {
                await postEstudianteM(estudiante, client);  // Asegúrate de pasar el client a la función del modelo
            } catch (error) {
                await client.query('ROLLBACK');  // Revertir la transacción si ocurre un error al insertar
                return res.status(500).json({ error: 'Error al insertar el estudiante' });
            }
        }

        // Si todo va bien, hacer commit de la transacción
        await client.query('COMMIT');
        return res.status(200).json({ mensaje: 'Estudiantes procesados correctamente' });

    } catch (error) {
        await client.query('ROLLBACK');  // Revertir la transacción en caso de cualquier otro error
        console.error('Error en la transacción:', error);
        return res.status(500).json({ error: 'Error en la transacción de los estudiantes' });
    } finally {
        client.release();  // Liberar el cliente de la conexión
    }
};