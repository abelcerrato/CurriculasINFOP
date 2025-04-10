import { pool } from '../db.js'



//////////////////////////////////////////////////////////////////////////////////////////////
//                                      NIVELES ACADEMICOS
//////////////////////////////////////////////////////////////////////////////////////////////
export const getNivelesAcademicosM = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM nivelesacademicos ORDER BY id asc')
        return rows;
    } catch (error) {
        throw error;
    }
}

export const getNivelAcademicoM = async (id) => {
    try {
        const { rows } = await pool.query('SELECT nivelacademico FROM nivelesacademicos where id=$1 ', [id])

        return rows;
    } catch (error) {
        throw error;
    }
};

export const postNivelAcademicoM = async (nivelacademico) => {
    try {
        const { rows } = await pool.query('INSERT INTO nivelesacademicos (nivelacademico, fechacreacion, fechamodificacion) VALUES ($1, CURRENT_TIMESTAMP, null) RETURNING *', [nivelacademico]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const putNivelAcademicoM = async (nivelacademico, id) => {
    try {
        const { rows } = await pool.query('UPDATE nivelesacademicos SET nivelacademico=$1, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *', [nivelacademico, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////
//                                      GRADOS ACADEMICOS
//////////////////////////////////////////////////////////////////////////////////////////////


export const getGradosAcademicosM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT ga.id, ga.gradoacademico,  ga.idnivelacademico , n.nivelacademico 
                FROM gradosacademicos as ga
                left join nivelesacademicos n on ga.idnivelacademico = n.id 
                order by ga.id asc
            `)
        return rows;
    } catch (error) {
        throw error;
    }
};

export const getGradoAcademicoIdM = async (id) => {
    try {
        const { rows } = await pool.query(`SELECT gradoacademico FROM gradosacademicos where id=$1`, [id])
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getGradoAcademicoIdNivelM = async (IdNivel) => {
    try {
        const { rows } = await pool.query(
            `SELECT 
                ga.id, ga.gradoacademico, ga.idnivelacademico,  n.nivelacademico 
            FROM gradosacademicos as ga
            INNER JOIN nivelesacademicos n ON ga.idnivelacademico = n.id 
            WHERE ga.idnivelacademico = $1
            order by ga.idnivelacademico asc`,
            [IdNivel]
        )
        return rows;
    } catch (error) {
        throw error;
    }
};


export const postGradoAcademicoM = async (gradoacademico, idnivelacademico) => {
    try {
        const { rows } = await pool.query('INSERT INTO gradosacademicos (gradoacademico, idnivelacademico, fechacreacion, fechamodificacion) VALUES ($1, $2, CURRENT_TIMESTAMP, null) RETURNING *', [gradoacademico, idnivelacademico]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putGradoAcademicoM = async (gradoacademico, idnivelacademico, id) => {
    try {
        const { rows } = await pool.query('UPDATE gradosacademicos SET gradoacademico=$1, idnivelacademico=$2, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', [gradoacademico, idnivelacademico, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

