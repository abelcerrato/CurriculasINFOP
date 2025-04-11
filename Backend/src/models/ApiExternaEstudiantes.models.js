import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas



//Trae los permisos que se le han dado al rol
export const getPermisosUsuarioM = async (usuario) => {
    console.log('Usuario enviado:', usuario);
    try {
        const { rows } = await pool.query(
            `SELECT  			
                mu.usuario, mu.nombre,
                mr.id AS idrol,
                mr.descripcion,
                mr.rol,
                muc.nombre AS creadopor,
                mr.estado,
                json_agg(json_build_object(
                    'idobjeto', mo.id,
                    'objeto', mo.objeto,
                    'idmodulo', mm.id,
                    'modulo', mm.modulo,
                    'consultar', p.consultar,
                    'insertar', p.insertar,
                    'actualizar', p.actualizar
                )) AS permisos
            FROM ms_permisos p
            LEFT JOIN ms_roles mr ON p.idrol = mr.id
            LEFT JOIN ms_objetos mo ON p.idobjeto = mo.id
            LEFT JOIN ms_modulos mm ON mo.idmodulo = mm.id
            LEFT JOIN ms_usuarios muc ON p.creadopor = muc.id
            INNER JOIN ms_usuarios mu ON mr.id = mu.idrol
            WHERE mu.usuario = $1
            GROUP BY mr.id, mr.rol, mr.estado, mu.usuario, mu.nombre, muc.nombre`, 
            [usuario]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los permisos que tiene el Usuario:', error);
        throw error;
    }
}



export const postEstudianteExternoM = async (identificacion, nombre, fechanacimiento, edad, genero, idnacionalidad, idetnia, telefono,
    estadocivil, idniveleducativo, idgradoacademico, estudianoformal, trabajaactualmente,
    iddiscapacidad, detallediscapacidad, iddepartamento, idmunicipio, idaldea, caserio,
    direccion, sabecomputacion, manejaprogramas, dispositivostecnologicos, plataformasvirtuales,
    estudioencasa, pasarsindistraccion, migranteretornado, motivomigracion, otromotivomigracion,
    llegousa, familiarmigranteretornado, miembrosalioynoregreso, volveriaamigrar, creadopor, client) => {
    try {
        const { rows } = await client.query(
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


export const postEducacionNoFormalEExternoM = async (educacionNoFormal, idestudiante, client) => {
    try {
        const { rows } = await client.query(`
            INSERT INTO educacionNoFormal 
                        (educacionNoFormal, idestudiante) 
            VALUES ($1, $2) RETURNING *`,
            [educacionNoFormal, idestudiante]);
        return rows;
    } catch (error) {
        throw error;
    }
}
