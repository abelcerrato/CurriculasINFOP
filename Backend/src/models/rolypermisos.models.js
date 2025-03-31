import { pool } from '../db.js'

export const getRolyPermisosM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from rolypermisos')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}