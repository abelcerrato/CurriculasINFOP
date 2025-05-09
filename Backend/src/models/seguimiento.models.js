import { pool } from '../db.js'

export const getSeguimientoM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                s.id, s.completocurso, s.fechaabandono, s.razonabandono, s.tipocertificacion, 
                s.hasidoempleado, s.tipoempleo, s.trabajacampoestudio, 
                muc.creadopor, s.fechacreacion,  mum.modificadopor, s.fechamodificacion
            FROM seguimiento as s
            inner join ms_usuarios muc on s.creadopor = muc.id 
            inner join ms_usuarios mum on s.modificadopor = mum.id 
            ORDER BY s.id ASC;
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getSegumientoIdM = async (id) => {
    console.log('Segumiento enviado:', id);
    try {
        const { rows } = await pool.query(`
            SELECT  s.id, s.completocurso, s.fechaabandono, s.razonabandono, s.tipocertificacion, 
                s.hasidoempleado, s.tipoempleo, s.trabajacampoestudio, 
                muc.creadopor, s.fechacreacion,  mum.modificadopor, s.fechamodificacion
            FROM seguimiento as s
            inner join ms_usuarios muc on s.creadopor = muc.id 
            inner join ms_usuarios mum on s.modificadopor = mum.id 
            WHERE s.id =$1`, [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Segumiento:', error); 
        throw error;
    }
}

export const postSeguimientoM = async (completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO seguimiento 
                (completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, 
                trabajacampoestudio, idaccionformativa, idestudiante, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES 
                ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10, CURRENT_TIMESTAMP, null, null) RETURNING *`, 
            [completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putSeguimientoM = async ( completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE 
                seguimiento SET completocurso=$1, fechaabandono=$2, razonabandono=$3, tipocertificacion=$4, 
                hasidoempleado=$5, tipoempleo=$6, trabajacampoestudio=$7, idaccionformativa=$8, idestudiante=$9, modificadopor=$10, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$11 RETURNING *`, 
            [completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

