import { pool } from '../db.js'

export const getNacionalidadesM = async () => {
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


export const getNacionalidadesIdM = async (id) => {
    console.log('Nacionalidad enviada:', id);
    try {
        const { rows } = await pool.query(`
                SELECT  
                    id,   
                    nacionalidad
                FROM nacionalidades 
                where id=$1
                ORDER BY id ASC  
            `);  
        return rows;
    } catch (error) {
        console.error('Error al obtener la nacionalidad:', error); 
        throw error;
    }
}



export const postNacionalidadesM = async (nacionalidad) =>{
    try {
        const { rows } = await pool.query('INSERT INTO nacionalidades (nacionalidad) VALUES ($1) RETURNING *', [nacionalidad]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const putNacionalidadesM = async (id, nacionalidad) => {
    try {
        const { rows } = await pool.query('UPDATE nacionalidades SET nacionalidad=$1 WHERE id=$2 RETURNING *', [nacionalidad, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}


