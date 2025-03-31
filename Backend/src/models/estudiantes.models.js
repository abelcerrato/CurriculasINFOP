import { pool } from '../db.js'

export const getEstudiantesM = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * from estudiantes')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getEstudianteIdM = async (id) => {
    console.log('Estudiante enviado:', id);
    try {
        const { rows } = await pool.query('SELECT * FROM estudiantes WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Estudiante:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Estudiante:', error);
        throw error;
    }
}


export const postEstudianteM = async (identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil,
    idniveleducativo, idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad,
    iddepartamento, idmunicipio, idaldea, caserio, direccion, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO estudiantes 
                        (identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil, idniveleducativo, 
                        idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad, iddepartamento, 
                        idmunicipio, idaldea, caserio, direccion, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, null, null) RETURNING *`,
            [identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil, idniveleducativo,
                idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad, iddepartamento,
                idmunicipio, idaldea, caserio, direccion, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putEstudianteM = async (identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil,
    idniveleducativo, idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad,
    iddepartamento, idmunicipio, idaldea, caserio, direccion, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE estudiantes SET
                    identificacion=$1, nombre=$2, fechanacimiento=$3, nacionalidad=$4, idednia=$5, genero=$6, telefono=$7, estadocivil=$8, idniveleducativo=$9, 
                    idgradoacademico=$10, educacionformal=$11, trabajaactualmente=$12, iddiscapacidad=$13, detallediscapacidad=$14, iddepartamento=$15, 
                    idmunicipio=$16, idaldea=$17, caserio=$18, direccion=$19, modificadopor=$20, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$21 RETURNING *`,
            [identificacion, nombre, fechanacimiento, nacionalidad, idednia, genero, telefono, estadocivil, idniveleducativo,
                idgradoacademico, educacionformal, trabajaactualmente, iddiscapacidad, detallediscapacidad, iddepartamento,
                idmunicipio, idaldea, caserio, direccion, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}