import { pool } from '../db.js'

export const getCursosM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT c.id, c.curso, c.fechainicio, c.fechafinalizacion, c.nombresalida, c.idcurricula, c2.curricula ,
                    c.iddepartamento, d.departamento, c.idmunicipio, m.municipio, c.lugardesarrollo, 
                    c.duracionteorica, c.duracionpractia, c.duraciontotal, c.metodologia, c.tipomaterial, c.modalidad, 
                    c.fechacreacion, ucp.nombre as creadopor, c.fechamodificacion, ump.nombre as modificadopor 
            FROM cursos as c
            left join curriculas c2 on c.idcurricula = c2.id 
            left join departamentos d  on c.iddepartamento = d.id 
            left join municipios m on c.idmunicipio = m.id 
            left join usuarios ucp on c.creadopor = ucp.id 
            left join usuarios ump on c.modificadopor = ump.id 
            `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getCursoIdM = async (id) => {
    console.log('Curricula enviada:', id);
    try {
        const { rows } = await pool.query(`
            SELECT c.id, c.curso, c.fechainicio, c.fechafinalizacion, c.nombresalida, c.idcurricula, c2.curricula ,
                    c.iddepartamento, d.departamento, c.idmunicipio, m.municipio, c.lugardesarrollo, 
                    c.duracionteorica, c.duracionpractia, c.duraciontotal, c.metodologia, c.tipomaterial, c.modalidad, 
                    c.fechacreacion, ucp.nombre as creadopor, c.fechamodificacion, ump.nombre as modificadopor 
            FROM cursos as c
            left join curriculas c2 on c.idcurricula = c2.id 
            left join departamentos d  on c.iddepartamento = d.id 
            left join municipios m on c.idmunicipio = m.id 
            left join usuarios ucp on c.creadopor = ucp.id 
            left join usuarios ump on c.modificadopor = ump.id 
            WHERE c.id=$1`, [id]);
        console.log('Resultado de la consulta del curso:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el curso:', error);
        throw error;
    }
}



export const postCursosM = async (curso, fechainicio, fechafinalizacion, nombresalida, idcurricula,
    iddepartamento, idmunicipio, lugardesarrollo, duracionteorica,
    duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, creadopor) => {
    try {
        const { rows } = await pool.query(`
                INSERT INTO cursos (curso, fechainicio, fechafinalizacion, nombresalida, idcurricula, iddepartamento, idmunicipio, 
                                            lugardesarrollo, duracionteorica, duracionpractia, duraciontotal, metodologia, tipomaterial, 
                                            modalidad, fechacreacion, creadopor, fechamodificacion, modificadopor) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, $15, null, null) RETURNING *`,
            [curso, fechainicio, fechafinalizacion, nombresalida, idcurricula,
                iddepartamento, idmunicipio, lugardesarrollo, duracionteorica,
                duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const putCursoM = async (curso, fechainicio, fechafinalizacion, nombresalida, idcurricula,
    iddepartamento, idmunicipio, lugardesarrollo, duracionteorica, duracionpractia, duraciontotal,
    metodologia, tipomaterial, modalidad, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
                UPDATE cursos SET
                curso=$1, fechainicio=$2, fechafinalizacion=$3, nombresalida=$4, idcurricula=$5, iddepartamento=$6, idmunicipio=$7, 
                lugardesarrollo=$8, duracionteorica=$9, duracionpractia=$10, duraciontotal=$11, metodologia=$12, tipomaterial=$13, modalidad=$14,
                modificadopor=$15, fechamodificacion=CURRENT_TIMESTAMP
                WHERE id=$16 RETURNING *`,
                            [curso, fechainicio, fechafinalizacion, nombresalida, idcurricula,
                                iddepartamento, idmunicipio, lugardesarrollo, duracionteorica,
                                duracionpractia, duraciontotal, metodologia, tipomaterial, modalidad, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}