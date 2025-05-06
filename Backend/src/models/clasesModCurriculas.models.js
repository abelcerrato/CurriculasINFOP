import { pool } from '../db.js'


//get de todas los clases
export const getClasesModulosCurriculasM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescurriculas cc
            left join curriculas c on cc.idcurricula = c.id 
            left join moduloscurriculas m on cc.idmodulo = m.id 
            left join usuarios ucp on cc.creadopor = ucp.id 
            left join usuarios ump on cc.modificadopor = ump.id 
            `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


//get de las clases por medio del id de la clase
export const getIdClasesModulosCurriculasM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescurriculas cc
            left join curriculas c on cc.idcurricula = c.id 
            left join moduloscurriculas m on cc.idmodulo = m.id 
            left join usuarios ucp on cc.creadopor = ucp.id 
            left join usuarios ump on cc.modificadopor = ump.id 
            where cc.id=$1
            `, [id])
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


//get de las clases por medio del id del modulo
export const getClasesIdModulosCurriculasM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescurriculas cc
            left join curriculas c on cc.idcurricula = c.id 
            left join moduloscurriculas m on cc.idmodulo = m.id 
            left join usuarios ucp on cc.creadopor = ucp.id 
            left join usuarios ump on cc.modificadopor = ump.id  
            where m.id=$1
            `, [id])
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}



//get de las clases por medio del id del modulo
export const getClasesModulosIdCurriculasM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescurriculas cc
            left join curriculas c on cc.idcurricula = c.id 
            left join moduloscurriculas m on cc.idmodulo = m.id 
            left join usuarios ucp on cc.creadopor = ucp.id 
            left join usuarios ump on cc.modificadopor = ump.id  
            where c.id=$1
            `, [id])
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const postClasesModulosCurriculasM = async (clase, duracionteorica, duracionpractica, duraciontotal, curriculaId, moduloId, creadopor ) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO clasescurriculas 
                        (clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, fechacreacion, creadopor, fechamodificacion, modificadopor) 
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, null, null) RETURNING id`,
            [clase, duracionteorica, duracionpractica, duraciontotal, curriculaId, moduloId, creadopor]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}




export const putClasesModulosCurriculasM = async (clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE clasescurriculas SET
                    clase=$1, duracionteorica=$2, duracionpractica=$3, duraciontotal=$4, idcurricula=$5, idmodulo=$6, modificadopor=$7, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$8 RETURNING *`,
            [clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idmodulo, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}