import { pool } from '../db.js'

export const getDiscapacidadesM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from discapacidades')
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getDiscapacidadIdM = async (id) => {
    console.log('Discapacidad enviada:', id);
    try {
        const { rows } = await pool.query('SELECT discapacidad FROM discapacidades WHERE id=$1', [id]);
        console.log('Resultado de la consulta de la Discapacidad:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener la Discapacidad:', error); 
        throw error;
    }
}


export const postDiscapacidadesM = async (discapacidad) =>{
    try {
        const { rows } = await pool.query('INSERT INTO discapacidades (discapacidad, fechacreacion, fechamodificacion) VALUES ($1, CURRENT_TIMESTAMP, null) RETURNING *', [discapacidad]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putDiscapacidadM = async (discapacidad, id) => {
    try {
        const { rows } = await pool.query('UPDATE discapacidades SET discapacidad=$1, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *', [discapacidad, id]);
        return rows;
    } catch (error) {
        console.error('Error al actualizar la Discapacidad:', error);
        throw error;
    }
}