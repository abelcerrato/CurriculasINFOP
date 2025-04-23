import { pool } from '../db.js'

export const getMatriculasM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT m.id, m.idestudante, e.nombre,
                m.idcurso, c.curso, m.fechainscripcion, m.informacionseguimiento, 
                muc.nombre as creadopor, m.fechacreacion, mum.nombre as modificadopor, m.fechamodificacion 
            FROM matriculas m
            inner join estudiantes e on m.idestudante = e.id 
            inner join cursos c on m.idcurso = c.id 
            left join ms_usuarios muc on m.creadopor = muc.id 
            left join ms_usuarios mum on m.modificadopor = mum.id
            ORDER BY m.id ASC;
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}



export const getMatriculasIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT m.idestudante, e.nombre,
                m.idcurso, c.curso, m.fechainscripcion, m.informacionseguimiento, 
                muc.nombre as creadopor, m.fechacreacion, mum.nombre as modificadopor, m.fechamodificacion 
            FROM matriculas m
            inner join estudiantes e on m.idestudante = e.id 
            inner join cursos c on m.idcurso = c.id 
            left join ms_usuarios muc on m.creadopor = muc.id 
            left join ms_usuarios mum on m.modificadopor = mum.id
            where m.id =$1`, [id]); 
        return rows;
    } catch (error) {
        console.error('Error al obtener la matricula:', error); 
        throw error;
    }
}



export const postMatriculasM = async (idestudante, idcurso, fechainscripcion, informacionseguimiento, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO matriculas 
                (idestudante, idcurso, fechainscripcion, informacionseguimiento, creadopor, fechacreacion) 
            VALUES 
                ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP) RETURNING *`, 
            [idestudante, idcurso, fechainscripcion, informacionseguimiento, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putMatriculasM = async (idestudante, idcurso, fechainscripcion, informacionseguimiento, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE matriculas SET 
                idestudante=$1, idcurso=$2, fechainscripcion=$3, informacionseguimiento=$4, 
                modificadopor=$5, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$6 
            RETURNING *`, 
            [idestudante, idcurso, fechainscripcion, informacionseguimiento, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}