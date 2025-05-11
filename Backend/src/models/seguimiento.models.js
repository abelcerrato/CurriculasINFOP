import { pool } from '../db.js'

export const getSeguimientoM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                s.id, s.idaccionformativa, a.accionformatica,
                s.idestudiante, e.identificacion, e.nombre,
                s.completocurso, s.fechaabandono, s.razonabandono, s.tipocertificacion, 
                s.hasidoempleado, s.tipoempleo, s.trabajacampoestudio, 
                muc.creadopor, s.fechacreacion,  mum.modificadopor, s.fechamodificacion
            FROM seguimiento as s
            left join ms_usuarios muc on s.creadopor = muc.id 
            left join ms_usuarios mum on s.modificadopor = mum.id 
            left join accionformativa a on s.idaccionformativa = a.id 
            left join estudiantes e on s.idestudiante = e.id 
            ORDER BY s.id ASC;    
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getSegumientoIdM = async (id) => {
    console.log('Segumiento enviado:', id);
    try {
        const { rows } = await pool.query(`
            SELECT 
                s.idaccionformativa, a.accionformatica,
                s.idestudiante, e.identificacion, e.nombre,
                s.completocurso, s.fechaabandono, s.razonabandono, s.tipocertificacion, 
                s.hasidoempleado, s.tipoempleo, s.trabajacampoestudio, 
                muc.creadopor, s.fechacreacion,  mum.modificadopor, s.fechamodificacion
            FROM seguimiento as s
            left join ms_usuarios muc on s.creadopor = muc.id 
            left join ms_usuarios mum on s.modificadopor = mum.id 
            left join accionformativa a on s.idaccionformativa = a.id 
            left join estudiantes e on s.idestudiante = e.id 
            WHERE s.id =$1
            ORDER BY s.id ASC; `, [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Segumiento:', error); 
        throw error;
    }
}



export const getSegumientoIdAccFormM = async (id) => {
    console.log('Id de Acción Formativa enviada:', id);
    try {
        const { rows } = await pool.query(`
            SELECT 
                s.idaccionformativa, a.accionformatica,
                s.idestudiante, e.identificacion, e.nombre, 
                e.iddepartamento, de.departamento, e.idmunicipio, m.municipio,
                s.completocurso, s.fechaabandono, s.razonabandono, s.tipocertificacion, 
                s.hasidoempleado, s.tipoempleo, s.trabajacampoestudio, 
                muc.creadopor, s.fechacreacion,  mum.modificadopor, s.fechamodificacion
            FROM seguimiento as s
            left join ms_usuarios muc on s.creadopor = muc.id 
            left join ms_usuarios mum on s.modificadopor = mum.id 
            left join accionformativa a on s.idaccionformativa = a.id 
            left join estudiantes e on s.idestudiante = e.id
            left join departamentos de on e.iddepartamento = de.id 
            left join municipios m on e.idmunicipio = m.id 
            WHERE s.idaccionformativa = $1
            ORDER BY s.idaccionformativa ASC;`, [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Segumiento:', error); 
        throw error;
    }
}



export const postSeguimientoM = async (completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO seguimiento 
                (completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, 
                trabajacampoestudio, idaccionformativa, idestudiante, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES 
                ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10, CURRENT_TIMESTAMP, null, null) RETURNING *`, 
            [completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putSeguimientoM = async ( completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE 
                seguimiento SET completocurso=$1, fechaabandono=$2, razonabandono=$3, tipocertificacion=$4, 
                hasidoempleado=$5, tipoempleo=$6, trabajacampoestudio=$7, idaccionformativa=$8, idestudiante=$9, modificadopor=$10, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$11 RETURNING *`, 
            [completocurso, fechaabandono, razonabandono, tipocertificacion, hasidoempleado, tipoempleo, trabajacampoestudio, idaccionformativa, idestudiante, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const deleteSeguimientoEstudianteM = async (idestudiante, idaccionformativa) => {
    try {
        const { rows } = await pool.query(`
            DELETE FROM seguimiento WHERE idestudiante=$1 and idaccionformativa=$2 RETURNING *`, [idestudiante, idaccionformativa]);
        return rows;
    } catch (error) {
        throw error;
    }
}