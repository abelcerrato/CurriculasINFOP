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




export const postEstudianteM = async (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idednia, telefono,
    estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
    iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
    direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
    estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
    llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO estudiantes 
                        (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idednia, telefono,
                        estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
                        iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
                        direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
                        estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
                        llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, 
                        creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
                    $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, CURRENT_TIMESTAMP, null, null) RETURNING id`,
            [identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idednia, telefono,
                estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
                iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
                direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
                estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
                llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const postEducacionNoFormalM = async (educacionNoFormal, idestudiante) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO educacionNoFormal 
                        (educacionNoFormal, idestudiante) 
            VALUES ($1, $2) RETURNING *`,
            [educacionNoFormal, idestudiante]);
        return rows;
    } catch (error) {
        throw error;
    }
}




export const putEstudianteM = async (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idednia, telefono,
    estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
    iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
    direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
    estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
    llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE estudiantes SET
                    identificacion=$1, nombre=$2, fechanacimiento=$3, edad=$4, genero=$5, idnacionalidad=$6, idednia=$7, telefono=$8,
                    estadocivil=$9, idniveleducativo=$10, idgradoacademico=$11, estudianoformal=$12, trabajaactualmente=$13,
                    iddiscapacidad=$14, detallediscapacidad=$15, iddepartamento=$16, idmunicipio=$17, idaldea=$18, caserio=$19,
                    direccion=$20, sabecomputacion=$21, manejaprogramas=$22, dispositivostecnologicos=$23, plataformasvirtuales=$24,
                    estudioencasa=$25, pasarsindistraccion=$26, migranteretornado=$27, motivomigracion=$28, otromotivomigracion=$29,
                    llegousa=$30, familiarmigranteretornado=$31, miembrosalioynoregreso=$32, volveriaamigrar=$33, modificadopor=$34, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$35 RETURNING *`,
            [identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idednia, telefono,
                estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
                iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
                direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
                estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
                llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const deleteEducacionNoFormalM = async ( idestudiante) => {
    try {
        // Eliminar los cursos anteriores del estudiante
        await pool.query(`DELETE FROM educacionNoFormal WHERE idestudiante=$1`, [idestudiante]);
    } catch (error) {
        throw error;
    }
}
