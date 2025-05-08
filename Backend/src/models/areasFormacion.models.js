import e from 'express';
import { pool } from '../db.js'

export const getAreasFormacionM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from areasformacion')
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getAreaFormacionIdM = async (id) => {
    console.log('Area de formacion enviada:', id);
    try {
        const { rows } = await pool.query('SELECT areaformacion FROM areasformacion WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Area de formacion:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Area de formacion:', error);
        throw error;
    }
}


export const postAreasFormacionM = async (areaformacion) => {
    try {
        const { rows } = await pool.query(`INSERT INTO areasformacion (areaformacion, fechacreacion, fechamodificacion) VALUES ($1, CURRENT_TIMESTAMP, null) RETURNING *`, [areaformacion]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putAreaFormacionM = async (areaformacion, id) => {
    try {
        const { rows } = await pool.query(`UPDATE areasformacion SET areaformacion=$1, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`, [areaformacion, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}


