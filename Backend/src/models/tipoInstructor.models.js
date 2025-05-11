import e from 'express';
import { pool } from '../db.js'


export const getTipoEducadorM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from tipoeducador')
       // console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getTipoEducadorIdM = async (id) => {
    console.log('Tipo de Educador enviado:', id);
    try {
        const { rows } = await pool.query('SELECT tipoeducador FROM tipoeducador WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Tipo de Educador:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener el Tipo de Educador:', error); 
        throw error;
    }
}


export const postTipoEducadorM = async (tipoeducador) =>{
    try {
        const { rows } = await pool.query('INSERT INTO tipoeducador (tipoeducador, fechacreacion, fechamodificacion) VALUES ($1, CURRENT_TIMESTAMP, null) RETURNING *', [tipoeducador]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const putTipoEducadorM = async (tipoeducador, id) => {
    try {
        const { rows } = await pool.query('UPDATE tipoeducador SET tipoeducador=$1, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *', [tipoeducador, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}