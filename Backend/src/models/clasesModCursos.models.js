import { pool } from '../db.js'


//get de todas los clases
export const getClasesModulosCursosM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    cc.idcurso, cu.curso,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescursos cc
            left join curriculas c on cc.idcurricula = c.id
            left join moduloscursos m on cc.idmodulo = m.id 
            left join cursos cu on cc.idcurso=cu.id
            left join usuarios ucp on cc.creadopor = ucp.id 
            left join usuarios ump on cc.modificadopor = ump.id  
            `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

//get de todos los datos de la clase por id de la clase
export const getIdClasesModulosCursosM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    cc.idcurso, cu.curso,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescursos cc
            left join curriculas c on cc.idcurricula = c.id
            left join moduloscursos m on cc.idmodulo = m.id 
            left join cursos cu on cc.idcurso=cu.id
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


//get de todas los clases por id del modulo
export const getClasesIdModulosCursoM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    cc.idcurso, cu.curso,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescursos cc
            left join curriculas c on cc.idcurricula = c.id
            left join moduloscursos m on cc.idmodulo = m.id 
            left join cursos cu on cc.idcurso=cu.id
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


//get de todas los clases por id del curso
export const getClasesModulosIdCursoM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    cc.idcurso, cu.curso,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescursos cc
            left join curriculas c on cc.idcurricula = c.id
            left join moduloscursos m on cc.idmodulo = m.id 
            left join cursos cu on cc.idcurso=cu.id
            left join usuarios ucp on cc.creadopor = ucp.id 
            left join usuarios ump on cc.modificadopor = ump.id  
            where cu.id=$1
            `, [id])
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

//get de todas los clases por id de la curricula
export const getClasesModulosCursoIdCurriculaM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT cc.id, cc.clase, cc.duracionteorica, cc.duracionpractica, cc.duraciontotal, 
                    cc.idcurricula, c.curricula,
                    cc.idmodulo, m.modulo,
                    cc.idcurso, cu.curso,
                    ucp.nombre as creadopor, cc.fechacreacion,  
                    ump.nombre as modificadopor, cc.fechamodificacion
            FROM clasescursos cc
            left join curriculas c on cc.idcurricula = c.id
            left join moduloscursos m on cc.idmodulo = m.id 
            left join cursos cu on cc.idcurso=cu.id
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



export const postClasesModulosCursosM = async (clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, creadopor ) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO clasescursos 
                        (clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, fechacreacion, creadopor, fechamodificacion, modificadopor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, null, null) RETURNING *`,
            [clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const putClasesModulosCursosM = async (clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE clasescursos SET
                    clase=$1, duracionteorica=$2, duracionpractica=$3, duraciontotal=$4, idcurricula=$5, idcurso=$6, idmodulo=$7, modificadopor=$8, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$9 RETURNING *`,
            [clase, duracionteorica, duracionpractica, duraciontotal, idcurricula, idcurso, idmodulo, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}