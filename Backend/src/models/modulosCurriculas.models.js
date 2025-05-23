import { pool } from '../db.js'


//get de todos los modulos
export const getModulosCurriculasM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT mc.id, mc.modulo, mc.duracionteorica, mc.duracionpractia, mc.duraciontotal, 
                    mc.idcurricula, c.curricula, ucp.nombre as creadopor, mc.fechacreacion,   
                    ump.nombre as modificadopor, mc.fechamodificacion
            FROM moduloscurriculas as mc
            left join curriculas c on mc.idcurricula =c.id 
            left join usuarios ucp on mc.creadopor = ucp.id 
            left join usuarios ump on mc.modificadopor = ump.id 
            `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


//get de modulos por id modulo
export const getModulosCurriculaIdM = async (id) => {
    console.log('Modulo enviado:', id);
    try {
        const { rows } = await pool.query(`
        SELECT mc.id, mc.modulo, mc.duracionteorica, mc.duracionpractia, mc.duraciontotal, 
                mc.idcurricula, c.curricula, ucp.nombre as creadopor, mc.fechacreacion,   
                ump.nombre as modificadopor, mc.fechamodificacion
        FROM moduloscurriculas as mc
        left join curriculas c on mc.idcurricula =c.id 
        left join usuarios ucp on mc.creadopor = ucp.id 
        left join usuarios ump on mc.modificadopor = ump.id 
        where mc.id=$1`, [id]);
        console.log('Resultado de la consulta de la Curricula:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener la Curricula:', error);
        throw error;
    }
}


//get de modulos por id curricula
export const getModulosIdCurriculaM = async (id) => {
    console.log('Curricula enviada:', id);
    try {
        const { rows } = await pool.query(`
        SELECT mc.id, mc.modulo, mc.duracionteorica, mc.duracionpractia, mc.duraciontotal,
                mc.idcurricula, c.curricula, ucp.nombre as creadopor, mc.fechacreacion,   
                ump.nombre as modificadopor, mc.fechamodificacion
        FROM moduloscurriculas as mc
        left join curriculas c on mc.idcurricula =c.id 
        left join usuarios ucp on mc.creadopor = ucp.id 
        left join usuarios ump on mc.modificadopor = ump.id 
        where c.id=$1`, [id]);
        console.log('Resultado de la consulta de la Curricula:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener la Curricula:', error);
        throw error;
    }
}



export const postModulosCurriculaM = async (modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO moduloscurriculas 
                (modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, fechacreacion, creadopor, fechamodificacion, modificadopor) 
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, null , null) RETURNING *`, 
            [modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putModulosCurriculaM = async (modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE moduloscurriculas SET
                    modulo=$1, duracionteorica=$2, duracionpractia=$3, duraciontotal=$4, idcurricula=$5, fechamodificacion=CURRENT_TIMESTAMP, modificadopor=$6
            WHERE id=$7 RETURNING *`,
            [modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}
