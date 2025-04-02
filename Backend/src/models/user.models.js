import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas

export const getUserM = async () => {
    try {
        const { rows } = await pool.query(` 
        SELECT 
        u.nombre,
        u.cecap,
        u.correo,
        u.idrol,
        u.iddepartamento,
        u.idmunicipio,
        u.usuario,
        m.municipio,
        d.departamento
        r.rol,
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
            SELECT id, nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, idestudiante, 
                    idmaestros, estado, fechacreacion, creadopor, fechamodificacion, modificadopor 
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
            SELECT nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, idestudiante, 
                    idmaestros, estado, fechacreacion, creadopor, fechamodificacion, modificadopor, usuario
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

        const { rows, rowCount } = await pool.query('SELECT usuario, nombre, contraseña, correo FROM usuarios WHERE usuario = $1', 
            [usuario]);


        if (rowCount === 0) {
            return null;  // Esto se utiliza para que en el controlador se indique que no fue encontrado.
        }

        return rows[0];  // Devuelve el primer usuario encontrado.
    } catch (error) {
        throw error; // Si ocurre algún error en la consulta, se lanza el error.
    }
};



export const postUserM = async (nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, idestudiante, idmaestros, estado, creadopor) => {
    try {

        const contraseñaCifrada  = await bcrypt.hash(contraseña, 10);
        const { rows } = await pool.query(`INSERT INTO usuarios
                                                (nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, idestudiante, idmaestros, 
                                                estado, creadopor, fechacreacion, fechamodificacion) 
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, null) RETURNING *`,
            [nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseñaCifrada , idestudiante, idmaestros, estado, creadopor])

        console.log(rows);
        return rows[0]
    } catch (error) {
        throw error;
    }
}


export const updateUserM = async ( nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseña, idestudiante, idmaestros, estado, modificadopor, usuario, id) => {
    try {

        const contraseñaCifrada  = await bcrypt.hash(contraseña, 10);

        const { rows } = await pool.query(`UPDATE usuarios SET 
                                                nombre=$1, cecap=$2, correo=$3, rol=$4, iddepartamento=$5, idmunicipio=$6, contraseña=$7, 
                                                idestudiante=$8, idmaestros=$9, estado=$10, modificadopor=$11, usuario=$12,
                                                fechamodificacion=CURRENT_TIMESTAMP, fechacreacion=null
                                            WHERE id=$13 RETURNING *`,
            [nombre, cecap, correo, rol, iddepartamento, idmunicipio, contraseñaCifrada, idestudiante, idmaestros, estado, modificadopor, usuario, id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}

export const deleteUserM = async (id) => {
    try {
        const { rows, rowCount } = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING *', [id])
        console.log(rows);

        if (rowCount === 0) {
            return null; // Retorna null si el usuario no existe
        }

        return rows[0];
    } catch (error) {
        throw error;
    }
}

