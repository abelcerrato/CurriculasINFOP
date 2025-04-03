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



export const postMaestroM = async (nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
    idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion, 
    idtipoeducador, creadopor ) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO maestros 
                        (nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
                        idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion, 
                        idtipoeducador, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP, null, CURRENT_TIMESTAMP) RETURNING *`,
            [nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
                idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion, 
                idtipoeducador, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const putMaestroM = async (nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
    idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion, 
    idtipoeducador, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE maestros SET
                    nombre=$1, identificacion=$2, correo=$3, telefono=$4, genero=$5,
                    fechanacimiento=$6, edad=$7,
                    idniveleducativo=$8, idgradoacademico=$9,
                    iddepartamento=$10, idmunicipio=$11, idaldea=$12, caserio=$13, direccion=$14, 
                    fechamodificacion=CURRENT_TIMESTAMP, 
                    idtipoeducador=$15, modificadopor=$16
            WHERE id=$17 RETURNING *`,
            [nombre, identificacion, correo, telefono, genero, fechanacimiento, edad,
                idniveleducativo, idgradoacademico, iddepartamento, idmunicipio, idaldea, caserio, direccion,
                idtipoeducador, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}