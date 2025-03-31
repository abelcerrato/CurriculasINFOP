import { pool } from '../db.js'

export const getAldeasM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from aldeas')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getAldeaIdM = async (id) => {
    console.log('Aldea enviada:', id);
    try {
        const { rows } = await pool.query('SELECT aldea, idmunicipio FROM aldeas WHERE id=$1', [id]);
        console.log('Resultado de la consulta de la Aldea:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener la Aldea:', error); 
        throw error;
    }
}


export const postAldeasM = async (aldea, idmunicipio) =>{
    try {
        const { rows } = await pool.query('INSERT INTO aldeas (aldea, idmunicipio, fechacreacion, fechamodificacion) VALUES ($1, $2, CURRENT_TIMESTAMP, null) RETURNING *', [aldea, idmunicipio]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putAldeaM = async (id, aldea, idmunicipio) => {
    try {
        const { rows } = await pool.query('UPDATE aldeas SET aldea=$1, idmunicipio=$2, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', [aldea, idmunicipio, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}