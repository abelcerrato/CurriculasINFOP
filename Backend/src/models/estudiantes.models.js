import { pool } from '../db.js'

export const getEstudiantesM = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                e.id, e.identificacion, e.nombre, TO_CHAR(e.fechanacimiento, 'DD/MM/YYYY') AS fechanacimiento, 
                e.edad, e.genero, e.idnacionalidad, n.nacionalidad, e.idetnia, e2.etnia,
                e.telefono, e.estadocivil, e.idniveleducativo, na.nivelacademico, 
                e.idgradoacademico, g.gradoacademico, e.estudianoformal,
                STRING_AGG(e3.educacionnoformal, ', ') AS educacionnoformal,
                e.trabajaactualmente, e.iddiscapacidad, d.discapacidad, e.detallediscapacidad,
                e.iddepartamento, depto.departamento, e.idmunicipio, muni.municipio, 
                e.idaldea, ald.aldea, e.caserio, e.direccion, e.sabecomputacion, 
                e.manejaprogramas, e.dispositivostecnologicos, e.plataformasvirtuales, 
                e.estudioencasa, e.pasarsindistraccion, e.migranteretornado, 
                e.motivomigracion, e.otromotivomigracion, e.llegousa, 
                e.familiarmigranteretornado, e.miembrosalioynoregreso, 
                e.volveriaamigrar, muc.nombre as creadopor, e.fechacreacion, 
                mum.nombre as modificadopor, e.fechamodificacion
            FROM estudiantes as e
            LEFT JOIN nacionalidades n ON e.idnacionalidad = n.id 
            LEFT JOIN etnias e2 ON e.idetnia = e2.id 
            LEFT JOIN nivelesacademicos na ON e.idniveleducativo = na.id 
            LEFT JOIN gradosacademicos g ON e.idgradoacademico = g.id
            LEFT JOIN discapacidades d ON e.iddiscapacidad = d.id
            LEFT JOIN departamentos depto ON e.iddepartamento = depto.id 
            LEFT JOIN municipios muni ON e.idmunicipio = muni.id
            LEFT JOIN aldeas ald ON e.idaldea = ald.id 
            LEFT JOIN ms_usuarios muc ON e.creadopor = muc.id 
            LEFT JOIN ms_usuarios mum ON e.modificadopor = mum.id
            LEFT JOIN educacionnoformal e3 ON e.id = e3.idestudiante
            GROUP BY 
                e.id, n.nacionalidad, e2.etnia, na.nivelacademico, g.gradoacademico, 
                d.discapacidad, depto.departamento, muni.municipio, ald.aldea,
                muc.nombre, mum.nombre
            ORDER BY e.id DESC;`);
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getEstudianteIdM = async (id) => {
    console.log('Estudiante enviado:', id);
    try {
        const { rows } = await pool.query(`
            SELECT e.id, e.identificacion, e.nombre,  TO_CHAR(e.fechanacimiento, 'DD/MM/YYYY') AS fechanacimiento, e.edad, e.genero, 
                e.idnacionalidad, n.nacionalidad ,  e.idetnia, e2.etnia,
                e.telefono, e.estadocivil, 
                e.idniveleducativo, na.nivelacademico, e.idgradoacademico, g.gradoacademico,
                e.estudianoformal, e.trabajaactualmente, 
                e.iddiscapacidad, d.discapacidad, e.detallediscapacidad,
                e.iddepartamento, depto.departamento, e.idmunicipio, muni.municipio, e.idaldea, ald.aldea,
                e.caserio, e.direccion, e.sabecomputacion, e.manejaprogramas, e.dispositivostecnologicos, 
                e.plataformasvirtuales, e.estudioencasa, e.pasarsindistraccion, e.migranteretornado, e.motivomigracion, e.otromotivomigracion, 
                e.llegousa, e.familiarmigranteretornado, e.miembrosalioynoregreso, e.volveriaamigrar, 
                muc.nombre as creadopor, e.fechacreacion, mum.nombre as modificadopor, e.fechamodificacion 
            FROM estudiantes as e
            left join nacionalidades n on e.idnacionalidad = n.id 
            left join etnias e2 on e.idetnia =e2.id 
            left join nivelesacademicos na on e.idniveleducativo = na.id 
            left join gradosacademicos g on e.idgradoacademico =g.id
            left join discapacidades d on e.iddiscapacidad = d.id
            left join departamentos depto on e.iddepartamento = depto.id 
            left join municipios muni on e.idmunicipio = muni.id
            left join aldeas ald on e.idaldea = ald.id 
            left join ms_usuarios muc on e.creadopor = muc.id 
            left join ms_usuarios mum on e.modificadopor = mum.id  
            WHERE id=$1`, [id]);
        console.log('Resultado de la consulta del Estudiante:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Estudiante:', error);
        throw error;
    }
}




export const postEstudianteM = async (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
    estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
    iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
    direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
    estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
    llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, creadopor) => {
    try {
        const { rows } = await pool.query(
            `INSERT INTO estudiantes 
                (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
                estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
                iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
                direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
                estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
                llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, 
                creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
                    $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,  CURRENT_TIMESTAMP, null, null) 
            RETURNING id`,
            [identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
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


export const postEducacionNoFormalM = async (educacionnoformal, idestudiante) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO educacionNoFormal 
                        (educacionNoFormal, idestudiante) 
            VALUES ($1, $2) RETURNING *`,
            [educacionnoformal, idestudiante]);
        return rows;
    } catch (error) {
        throw error;
    }
}




export const putEstudianteM = async (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
    estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
    iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
    direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
    estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
    llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE estudiantes SET
                    identificacion=$1, nombre=$2, fechanacimiento=$3, edad=$4, genero=$5, idnacionalidad=$6, idetnia=$7, telefono=$8,
                    estadocivil=$9, idniveleducativo=$10, idgradoacademico=$11, estudianoformal=$12, trabajaactualmente=$13,
                    iddiscapacidad=$14, detallediscapacidad=$15, iddepartamento=$16, idmunicipio=$17, idaldea=$18, caserio=$19,
                    direccion=$20, sabecomputacion=$21, manejaprogramas=$22, dispositivostecnologicos=$23, plataformasvirtuales=$24,
                    estudioencasa=$25, pasarsindistraccion=$26, migranteretornado=$27, motivomigracion=$28, otromotivomigracion=$29,
                    llegousa=$30, familiarmigranteretornado=$31, miembrosalioynoregreso=$32, volveriaamigrar=$33, modificadopor=$34, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$35 RETURNING *`,
            [identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
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

export const deleteEducacionNoFormalM = async (idestudiante) => {
    try {
        // Eliminar los cursos anteriores del estudiante
        await pool.query(`DELETE FROM educacionNoFormal WHERE idestudiante=$1`, [idestudiante]);
    } catch (error) {
        throw error;
    }
}
