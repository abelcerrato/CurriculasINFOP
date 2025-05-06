import { pool } from '../db.js'

export const getProgramasM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                p.id, p.programa, p.objetivo,  TO_CHAR(p.fechainicio, 'DD/MM/YYYY') AS fechainicio, TO_CHAR(p.fechafinal, 'DD/MM/YYYY') AS fechafinal,
                muc.creadopor, p.fechacreacion, mum.modificadopor, p.fechamodificacion 
            FROM programas p
            left join ms_usuarios muc on p.creadopor = muc.id 
            left join ms_usuarios mum on p.modificadopor = mum.id 
            `);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getProgramaIdM = async (id) => {
    console.log('Porgrama enviado:', id);
    try {
        const { rows } = await pool.query(` 
            SELECT 
                p.id, p.programa, p.objetivo, p.fechainicio, p.fechafinal, 
                muc.creadopor, p.fechacreacion, mum.modificadopor, p.fechamodificacion 
            FROM programas p
            inner join ms_usuarios muc on p.creadopor = muc.id 
            inner join ms_usuarios mum on p.modificadopor = mum.id 
            WHERE p.id =$1`, [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Programa:', error);
        throw error;
    }
}



export const postProgramasM = async (programa, objetivo, fechainicio, fechafinal, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO programas 
                (programa, objetivo, fechainicio, fechafinal, creadopor, fechacreacion, modificadopor, fechamodificacion)
            VALUES 
                ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, null, null) 
            RETURNING *`,
            [programa, objetivo, fechainicio, fechafinal, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putProgramaM = async (programa, objetivo, fechainicio, fechafinal, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE programas 
            SET programa=$1, objetivo=$2, fechainicio=$3, fechafinal=$4, modificadopor=$5, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$6 RETURNING *`,
            [programa, objetivo, fechainicio, fechafinal, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}