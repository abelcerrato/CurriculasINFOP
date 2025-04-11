import { pool } from '../db.js'

export const getNcionalidadesM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                id, 
                nacionalidad
            FROM nacionalidades 
            ORDER BY id ASC;
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}
