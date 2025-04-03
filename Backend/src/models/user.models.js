import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas

export const getUserM = async () => {
    try {
        const { rows } = await pool.query(` 
        SELECT 
        u.id,
        u.nombre,
        u.cecap,
        u.correo,
        u.idrol,
        u.iddepartamento,
        u.idmunicipio,
        u.usuario,
        '********' AS contraseña, -- Se muestra oculta
        u.estado,
        m.municipio,
        d.departamento,
        r.rol
            FROM usuarios u  
            INNER JOIN municipios m ON u.idmunicipio = m.id
            INNER JOIN departamentos d  ON u.iddepartamento = d.id
            left  JOIN roles r   ON u.idrol = r.id
            ORDER BY u.id ASC;
        `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getUsuarioIdM = async (usuario) => {
    console.log('Usuario enviado:', usuario);
    try {
        const { rows } = await pool.query(`
            SELECT id, nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, estado, fechacreacion, creadopor, fechamodificacion, modificadopor 
            FROM usuarios 
            WHERE usuario=$1`, 
            [usuario]);
        console.log('Resultado de la consulta de usuario:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener el usuario:', error); 
        throw error;
    }
}



export const getUserIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, 
            estado, fechacreacion, creadopor, fechamodificacion, modificadopor, usuario
            FROM usuarios WHERE id=$1`, [id])

        if (rows.length === 0) {
            return null
        }
        return rows[0]
    } catch (error) {

        throw error;
    }


}


export const verificarUsuarioM = async (usuario) => {
    try {

        const { rows, rowCount } = await pool.query('SELECT id, usuario, nombre, contraseña, correo, sesionactiva FROM usuarios WHERE usuario = $1', 
            [usuario]);


        if (rowCount === 0) {
            return null;  // Esto se utiliza para que en el controlador se indique que no fue encontrado.
        }

        return rows[0];  // Devuelve el primer usuario encontrado.
    } catch (error) {
        throw error; // Si ocurre algún error en la consulta, se lanza el error.
    }
    usuariusuarioz
};



export const postUserM = async (nombre, cecap, usuario, correo, idrol, iddepartamento, idmunicipio, estado, creadopor) => {
    try {
        // Definir la nueva contraseña temporal
        const ContraseñaUsuarioNuevo = "NuevoUsuario1*";


        const contraseñaCifrada  = await bcrypt.hash(ContraseñaUsuarioNuevo, 10);
        const { rows } = await pool.query(`INSERT INTO usuarios
                                                (nombre, usuario, cecap, correo, idrol, iddepartamento, idmunicipio, contraseña,
                                                estado, creadopor, fechacreacion, fechamodificacion) 
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, null) RETURNING *`,
            [nombre, cecap,usuario, correo, idrol, iddepartamento, idmunicipio, contraseñaCifrada,  estado, creadopor])

        console.log(rows);
        return rows[0]
    } catch (error) {
        throw error;
    }
}


export const updateUserM = async ( nombre, cecap, correo, idrol, iddepartamento, idmunicipio,  estado, modificadopor, usuario, id) => {
    try {

        //const contraseñaCifrada  = await bcrypt.hash(contraseña, 10);

        const { rows } = await pool.query(`UPDATE usuarios SET 
                                                nombre=$1, cecap=$2, correo=$3, idrol=$4, iddepartamento=$5, idmunicipio=$6,
                                                estado=$7, modificadopor=$8, usuario=$9,
                                                fechamodificacion=CURRENT_TIMESTAMP, fechacreacion=null
                                            WHERE id=$10 RETURNING *`,
            [nombre, cecap, correo, idrol, iddepartamento, idmunicipio,  estado, modificadopor, usuario, id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}



export const updateContraseñaM = async (nuevaContraseña, usuario ) => {
    try {
        // Encriptar la nueva contraseña
        const contraseñaCifrada = await bcrypt.hash(nuevaContraseña, 10);

        // Actualizar solo la contraseña
        const { rows } = await pool.query(
            `UPDATE usuarios 
                SET contraseña = $1
                WHERE usuario = $2
                RETURNING usuario, nombre, correo`,
            [contraseñaCifrada, usuario]
        );

        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        return { mensaje: "Contraseña actualizada correctamente", usuario: rows[0] };
    } catch (error) {
        throw error;
    }
};



export const resetContraseñaM = async (usuario) => {
    try {
        // Definir la nueva contraseña temporal
        const nuevaContraseña = "Temporal1*";

        // Encriptar la contraseña temporal
        const contraseñaCifrada = await bcrypt.hash(nuevaContraseña, 10);

        // Actualiza la contraseña en la base de datos
        const { rows } = await pool.query(
            `UPDATE usuarios 
                SET contraseña = $1 
                WHERE usuario = $2
                RETURNING id, usuario, correo`,
            [contraseñaCifrada, usuario]
        );

        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        return { mensaje: "Contraseña reseteada correctamente", usuario: rows[0] };
    } catch (error) {
        throw error;
    }
};

