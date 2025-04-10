import e from 'express';
import { pool } from '../db.js'

export const getMaestrosM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                m.id, 
                m.nombre,
                m.identificacion,
                m.correo, 
                TO_CHAR(m.fechanacimiento, 'DD/MM/YYYY') AS fechanacimiento,
                m.telefono,
                m.genero,
                m.caserio,
                m.direccion,
                m.edad,
                m.iddepartamento, 
                d.departamento,
                m.idmunicipio,
                m2.municipio,
                m.idaldea,
                a.aldea,
                m.idtipoeducador,
                t.tipoeducador,
                m.idniveleducativo,
                na.nivelacademico as niveleducativo,
                m.idgradoacademico,
                g.gradoacademico

                from maestros m  
                left join departamentos d on m.iddepartamento = d.id
                left join municipios m2 on m.idmunicipio = m2.id
                left join aldeas a on m.idaldea = a.id
                left join tipoeducador t on m.idtipoeducador = t.id
                left join nivelesacademicos na on na.id = m.idniveleducativo
                left join gradosacademicos g on m.idgradoacademico = g.id
            `)
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


export const postEducacionNoFormalM = async (educacionNoFormal, idmaestro) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO educacionNoFormal 
                        (educacionNoFormal, idmaestro) 
            VALUES ($1, $2) RETURNING *`,
            [educacionNoFormal, idmaestro]);
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


export const deleteEducacionNoFormalM = async ( idmaestro) => {
    try {
        // Eliminar los cursos anteriores del estudiante
        await pool.query(`DELETE FROM educacionNoFormal WHERE idmaestro=$1`, [idmaestro]);
    } catch (error) {
        throw error;
    }
}
