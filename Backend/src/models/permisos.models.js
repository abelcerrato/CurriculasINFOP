import { pool } from '../db.js'

export const getPermisosM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from ms_permisos')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}