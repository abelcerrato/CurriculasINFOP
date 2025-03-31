import e from 'express';
import { pool } from '../db.js'

export const getMaestrosM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from maestros')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getMaestroIdM = async (id) => {
    console.log('Maestro enviado:', id);
    try {
        const { rows } = await pool.query('SELECT * FROM maestros WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Maestro:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Maestro:', error);
        throw error;
    }
}



export const postMaestroM = async (nombre, identificacion, correo, telefono, genero, idniveleducativo, 
    iddepartamento, idmunicipio, idaldea, caserio, direccion, 
    educacionformal, creadopor, idtipoeducador) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO maestros 
                        (nombre, identificacion, correo, telefono, genero, idniveleducativo, 
                        iddepartamento, idmunicipio, idaldea, caserio, direccion, 
                        educacionformal, creadopor, modificadopor, fechacreacion, fechamodificacion, idtipoeducador) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, null, CURRENT_TIMESTAMP, null, $14) RETURNING *`,
            [nombre, identificacion, correo, telefono, genero, idniveleducativo, 
                iddepartamento, idmunicipio, idaldea, caserio, direccion, 
                educacionformal, creadopor, idtipoeducador]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const putMaestroM = async (nombre, identificacion, correo, telefono, genero, idniveleducativo, 
    iddepartamento, idmunicipio, idaldea, caserio, direccion, 
    educacionformal,  idtipoeducador, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE maestros SET
                    nombre=$1, identificacion=$2, correo=$3, telefono=$4, genero=$5, idniveleducativo=$6, 
                    iddepartamento=$7, idmunicipio=$8, idaldea=$9, caserio=$10, direccion=$11, 
                    educacionformal=$12, fechamodificacion=CURRENT_TIMESTAMP, 
                    idtipoeducador=$13, modificadopor=$14
            WHERE id=$15 RETURNING *`,
            [nombre, identificacion, correo, telefono, genero, idniveleducativo, 
                iddepartamento, idmunicipio, idaldea, caserio, direccion, 
                educacionformal, idtipoeducador, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}