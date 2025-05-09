import { pool } from '../db.js'

export const getAccionFormativaM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                af.id, af.accionformatica, af.salida, af.horaspracticas, af.horasteoricas, af.horastotales, af.fechainicio, af.fechafinal, 
                af.iddepartamento, depto.departamento, af.idmunicipio, muni.municipio,
                af.metodologia, af.modalidad, 
                af.tipomaterial, af.localdesarrollo, af.programaeducativo, af.donantessocios, 
                muc.nombre as creadopor, af.fechacreacion, 
                mum.nombre as modificadopor, af.fechamodificacion
                ---------------------------------------
            FROM accionformativa as af
            left join ms_usuarios muc on af.creadopor = muc.id 
            left join ms_usuarios mum on af.modificadopor = mum.id
            left join departamentos depto on af.iddepartamento = depto.id 
            left join municipios muni on af.idmunicipio = muni.id
            ORDER BY af.id ASC;
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}
