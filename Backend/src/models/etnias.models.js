import { pool } from '../db.js'

export const getEtniasM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from etnias')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getEtniaIdM = async (id) => {
    console.log('Etnia enviada:', id);
    try {
        const { rows } = await pool.query('SELECT etnia FROM etnias WHERE id=$1', [id]);
        console.log('Resultado de la consulta de la Etnia:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener la Etnia:', error); 
        throw error;
    }
}


export const postEtniasM = async (etnia) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO etnias 
                (etnia, fechacreacion, fechamodificacion) 
            VALUES ($1, CURRENT_TIMESTAMP, null) 
            RETURNING *`, [etnia]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putEtniaM = async (etnia, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE etnias 
            SET etnia=$1, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$2 
            RETURNING *`, [etnia, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}


