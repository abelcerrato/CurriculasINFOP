import {pool} from '../db.js'

export const getCurriculasM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT c.id, c.curricula, c.sector, c.duracionteorica, c.duracionpractica, c.duraciontotal, c.nombresalida, 
                c.objetivo, c.versioncurricula, c.educaciontemprana, c.idareaformacion, a.areaformacion,
                c.fechacreacion, ucp.nombre as creadopor, c.fechamodificacion, ump.nombre as modificadopor 
            FROM curriculas as c
            left join areasformacion a on c.idareaformacion= a.id 
            left join ms_usuarios ucp on c.creadopor = ucp.id 
            left join ms_usuarios ump on c.modificadopor = ump.id 
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
            left join ms_usuarios ucp on c.creadopor = ucp.id 
            left join ms_usuarios ump on c.modificadopor = ump.id 
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11, null, null) RETURNING id`, 
            [curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
            versioncurricula, educaciontemprana, idareaformacion, creadopor]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}




export const putCurriculaM = async (curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
                                    versioncurricula, educaciontemprana, idareaformacion, modificadopor, curriculaId) => {
    try {
        const { rows } = await pool.query(`
            UPDATE curriculas SET
                curricula=$1, sector=$2, duracionteorica=$3, duracionpractica=$4, duraciontotal=$5, nombresalida=$6, objetivo=$7, 
                versioncurricula=$8, educaciontemprana=$9, idareaformacion=$10, fechamodificacion=CURRENT_TIMESTAMP, modificadopor=$11
            WHERE id=$12 RETURNING *`, 
            [curricula, sector, duracionteorica, duracionpractica, duraciontotal, nombresalida, objetivo, 
            versioncurricula, educaciontemprana, idareaformacion, modificadopor, curriculaId]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const deleteCurriculaM = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Eliminar clases de todos los módulos de la currícula
        await client.query(`
            DELETE FROM clasescurriculas 
            WHERE idmodulo IN (
                SELECT id FROM moduloscurriculas WHERE idcurricula = $1
            )`, [id]);

        // 2. Eliminar los módulos
        await client.query(`DELETE FROM moduloscurriculas WHERE idcurricula = $1`, [id]);

        // 3. Eliminar la currícula
        const { rows } = await client.query(`DELETE FROM curriculas WHERE id = $1 RETURNING *`, [id]);

        await client.query('COMMIT');
        return rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
