import { pool } from '../db.js'

export const getCalificacionesM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT c.id, 
                    c.idclasecurricula, c3.clase as clasecurricula,
                    c.calificacionteorica, c.duracionteorica, 
                    c.calificacionpractica, c.duracionpractica, 
                    c.duraciontotal, 
                    c.idmatricula, 
                    muc.nombre as creadopor, c.fechacreacion, 
                    mum.nombre as modificadopor, c.fechamodificacion 
            FROM calificaciones c
            left join clasescurriculas c3 on c.idclasecurricula = c3.id
            left join ms_usuarios muc on c.creadopor = muc.id 
            left join ms_usuarios mum on c.modificadopor = mum.id 
            ORDER BY c.id ASC;
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getCalificacionesIdM = async (id) => {
    console.log('IdCalificacion enviada:', id);
    try {
        const { rows } = await pool.query(`
            SELECT 
                    c.idclasecurricula, c3.clase as clasecurricula,
                    c.calificacionteorica, c.duracionteorica, 
                    c.calificacionpractica, c.duracionpractica, 
                    c.duraciontotal, 
                    c.idmatricula, 
                    muc.nombre as creadopor, c.fechacreacion, 
                    mum.nombre as modificadopor, c.fechamodificacion 
            FROM calificaciones c
            left join clasescurriculas c3 on c.idclasecurricula = c3.id
            left join ms_usuarios muc on c.creadopor = muc.id 
            left join ms_usuarios mum on c.modificadopor = mum.id
            where c.id=$1`, [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener la calificacion:', error); 
        throw error;
    }
}



export const postCalificacionesM = async ( idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idclassmodcurraccform, idestudiante, idmaestro,  creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO calificaciones 
                ( idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, 
                duraciontotal, idclassmodcurraccform, idestudiante, idmaestro, creadopor, fechacreacion, fechamodificacion) 
            VALUES 
                ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10, CURRENT_TIMESTAMP, null) RETURNING *`, 
            [ idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idclassmodcurraccform, idestudiante, idmaestro, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putCalificacionesM = async ( idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idclassmodcurraccform, idestudiante, idmaestro, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE 
                calificaciones SET idclasecurricula=$1, calificacionteorica=$2, duracionteorica=$3, 
                calificacionpractica=$4, duracionpractica=$5, duraciontotal=$5, idclassmodcurraccform=$7, idestudiante=$8, idmaestro=$9, modificadopor=$10, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$11 RETURNING *`, 
            [ idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idclassmodcurraccform, idestudiante, idmaestro, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}