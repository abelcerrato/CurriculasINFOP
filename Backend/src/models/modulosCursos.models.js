import { pool } from '../db.js'


//get de todas los modulos
export const getModulosCursosM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT mc.id, mc.modulo, mc.duracionteorica, mc.duracionpractia, mc.duraciontotal, 
                    mc.idcurricula, c.curricula, mc.idcurso, cu.curso,
                    ucp.nombre as creadopor, mc.fechacreacion,   
                    ump.nombre as modificadopor, mc.fechamodificacion
            FROM moduloscursos as mc
            left join curriculas c on mc.idcurricula =c.id 
            left join cursos cu on mc.idcurso=cu.id
            left join ms_usuarios ucp on mc.creadopor = ucp.id 
            left join ms_usuarios ump on mc.modificadopor = ump.id  
            `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}



//get de modulos por id modulo
export const getModulosCursosIdM = async (id) => {
    console.log('Modulo enviado:', id);
    try {
        const { rows } = await pool.query(`
            SELECT mc.modulo, mc.duracionteorica, mc.duracionpractia, mc.duraciontotal, 
                    mc.idcurricula, c.curricula, mc.idcurso, cu.curso,
                    ucp.nombre as creadopor, mc.fechacreacion,   
                    ump.nombre as modificadopor, mc.fechamodificacion
            FROM moduloscursos as mc
            left join curriculas c on mc.idcurricula =c.id 
            left join cursos cu on mc.idcurso=cu.id
            left join ms_usuarios ucp on mc.creadopor = ucp.id 
            left join ms_usuarios ump on mc.modificadopor = ump.id  
            where mc.id=$1`,[id]);
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}



//get de modulos por id curricula
export const getModulosCursosIdCurriculaM = async (id) => {
    console.log('Curricula enviada:', id);
    try {
        const { rows } = await pool.query(`
        SELECT mc.modulo, mc.duracionteorica, mc.duracionpractia, mc.duraciontotal, 
                    mc.idcurricula, c.curricula, mc.idcurso, cu.curso,
                    ucp.nombre as creadopor, mc.fechacreacion,   
                    ump.nombre as modificadopor, mc.fechamodificacion
            FROM moduloscursos as mc
            left join curriculas c on mc.idcurricula =c.id 
            left join cursos cu on mc.idcurso=cu.id
            left join ms_usuarios ucp on mc.creadopor = ucp.id 
            left join ms_usuarios ump on mc.modificadopor = ump.id 
        where c.id=$1`, [id]);
        console.log('Resultado de la consulta de los modulos de la Curricula:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener los modulos de la Curricula:', error);
        throw error;
    }
}



export const postModulosCursosM = async (modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO moduloscursos 
                (modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, fechacreacion, creadopor, fechamodificacion, modificadopor) 
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, null , null) RETURNING *`, 
            [modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const putModulosCursosM = async (modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso,  modificadopor, id) => {
    
    try {
        const { rows } = await pool.query(`
            UPDATE moduloscursos SET
                    modulo=$1, duracionteorica=$2, duracionpractia=$3, duraciontotal=$4, idcurricula=$5, idcurso=$6, fechamodificacion=CURRENT_TIMESTAMP, modificadopor=$7
            WHERE id=$8 RETURNING *`,
            [modulo, duracionteorica, duracionpractia, duraciontotal, idcurricula, idcurso, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}
