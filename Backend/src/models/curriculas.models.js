import {pool} from '../db.js'

export const getCurriculasM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT c.id, c.curricula, c.sector, c.duracionteorica, c.duracionpractica, c.duraciontotal, c.nombresalida, 
                c.objetivo, c.versioncurricula, c.educaciontemprana, c.idareaformacion, a.areaformacion,
                c.fechacreacion, ucp.nombre as creadopor, c.fechamodificacion, ump.nombre as modificadopor 
            FROM curriculas as c
            left join areasformacion a on c.idareaformacion= a.id 
            left join usuarios ucp on c.creadopor = ucp.id 
            left join usuarios ump on c.modificadopor = ump.id 
        `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getCurriculaIdM = async (id) => {
    console.log('Curricula enviada:', id);
    try {
        const { rows } = await pool.query(`
            SELECT c.curricula, c.sector, c.duracionteorica, c.duracionpractica, c.duraciontotal, c.nombresalida, 
                    c.objetivo, c.versioncurricula, c.educaciontemprana, c.idareaformacion, a.areaformacion,
                    c.fechacreacion, ucp.nombre as creadopor, c.fechamodificacion, ump.nombre as modificadopor 
            FROM curriculas as c
            left join areasformacion a on c.idareaformacion= a.id 
            left join usuarios ucp on c.creadopor = ucp.id 
            left join usuarios ump on c.modificadopor = ump.id 
            WHERE c.id=$1`, [id]);
        console.log('Resultado de la consulta de la Curricula:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener la Curricula:', error);
        throw error;
    }
}   

export const postCurriculaM = async (curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
                                    versioncurricula, educaciontemprana, idareaformacion, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO curriculas 
                (curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
                versioncurricula, educaciontemprana, idareaformacion, fechacreacion, creadopor, fechamodificacion, modificadopor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11, null, null) RETURNING *`, 
            [curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
            versioncurricula, educaciontemprana, idareaformacion, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}




export const putCurriculaM = async (curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
                                    versioncurricula, educaciontemprana, idareaformacion, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE curriculas SET
                curricula=$1, sector=$2, duracionteorica=$3, duracionpractica=$4, duraciontotal=$5, nombresalida=$6, objetivo=$7, 
                versioncurricula=$8, educaciontemprana=$9, idareaformacion=$10, fechamodificacion=CURRENT_TIMESTAMP, modificadopor=$11
            WHERE id=$12 RETURNING *`, 
            [curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
            versioncurricula, educaciontemprana, idareaformacion, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}