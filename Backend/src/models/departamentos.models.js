import e from 'express';
import { pool } from '../db.js'

export const getDepartamentosM = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM departamentos ORDER BY id ASC');

        return rows;
    } catch (error) {
        throw error;
    }
}


export const getDepartamentoIdM = async (id) => {
    console.log('Departamento enviado:', id);
    try {
        const { rows } = await pool.query('SELECT departamento FROM departamentos WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Departamento:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Departamento:', error);
        throw error;
    }
}

export const postDepartamentosM = async (departamento) => {
    try {
        const { rows } = await pool.query('INSERT INTO departamentos (departamento, fechacreacion, fechamodificacion) VALUES ($1, CURRENT_TIMESTAMP, null) RETURNING *', [departamento]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putDepartamentoM = async (departamento, id) => {
    try {
        const { rows } = await pool.query('UPDATE departamentos SET departamento=$1, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *', [departamento, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}