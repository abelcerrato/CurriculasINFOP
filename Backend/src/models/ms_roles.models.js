import { pool } from '../db.js'

export const getRolesM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT id, rol, fechacreacion, fechamodificacion, estado, descripcion, creadopor, modificadopor 
        from ms_roles`)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getRolIdM = async (id) => {
    console.log('Rol enviada:', id);
    try {
        const { rows } = await pool.query('SELECT * FROM ms_roles WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Rol:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Rol:', error);
        throw error;
    }
}

export const postRolesM = async (rol) => {
    try {
        const { rows } = await pool.query('INSERT INTO ms_roles (rol, fechacreacion, fechamodificacion) VALUES ($1, CURRENT_TIMESTAMP, null) RETURNING *', [rol]);
        return rows;
    } catch (error) {
        console.error('Error al insertar el Rol:', error);
        throw error;
    }
}

export const putRolesM = async (rol, id) => {
    try {
        const { rows } = await pool.query('UPDATE ms_roles SET rol=$1, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *', [rol, id]);
        return rows;
    } catch (error) {
        console.error('Error al actualizar el Rol:', error);
        throw error;
    }
}