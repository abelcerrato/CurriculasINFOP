import { pool } from '../db.js'

export const getCalificacionesM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT c.id, 
                    c.idclasecurso, c2.clase as clasecurso, 
                    c.idclasecurricula, c3.clase as clasecurricula,
                    c.calificacionteorica, c.duracionteorica, 
                    c.calificacionpractica, c.duracionpractica, 
                    c.duraciontotal, 
                    c.idmatricula, 
                    muc.nombre as creadopor, c.fechacreacion, 
                    mum.nombre as modificadopor, c.fechamodificacion 
            FROM calificaciones c
            left join clasescursos c2 ON c.idclasecurso = c2.id 
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
            SELECT  c.idclasecurso, c2.clase as clasecurso, 
                    c.idclasecurricula, c3.clase as clasecurricula,
                    c.calificacionteorica, c.duracionteorica, 
                    c.calificacionpractica, c.duracionpractica, 
                    c.duraciontotal, 
                    c.idmatricula, 
                    muc.nombre as creadopor, c.fechacreacion, 
                    mum.nombre as modificadopor, c.fechamodificacion 
            FROM calificaciones c
            left join clasescursos c2 ON c.idclasecurso = c2.id 
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



export const postCalificacionesM = async (idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO calificaciones 
                (idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, 
                duraciontotal, idmatricula, creadopor, fechacreacion, fechamodificacion) 
            VALUES 
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP, null) RETURNING *`, 
            [idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putCalificacionesM = async (idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE 
                calificaciones SET idclasecurso=$1, idclasecurricula=$2, calificacionteorica=$3, duracionteorica=$4, 
                calificacionpractica=$5, duracionpractica=$6, duraciontotal=$7, idmatricula=$8, modificadopor=$9, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$10 RETURNING *`, 
            [idclasecurso, idclasecurricula, calificacionteorica, duracionteorica, calificacionpractica, duracionpractica, duraciontotal, idmatricula, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}