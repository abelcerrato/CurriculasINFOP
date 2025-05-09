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



export const getAccionFormativaIdM = async (id) => {
    console.log('Accion Formativa enviada:', id);
    try {
        const { rows } = await pool.query(`
            SELECT 
                af.accionformatica, af.salida, af.horaspracticas, af.horasteoricas, af.horastotales, af.fechainicio, af.fechafinal, 
                af.iddepartamento, depto.departamento, af.idmunicipio, muni.municipio,
                af.metodologia, af.modalidad, 
                af.tipomaterial, af.localdesarrollo, af.programaeducativo, af.donantessocios,
                muc.nombre as creadopor, af.fechacreacion, 
                mum.nombre as modificadopor, af.fechamodificacion
            FROM accionformativa as af
            left join ms_usuarios muc on af.creadopor = muc.id 
            left join ms_usuarios mum on af.modificadopor = mum.id
            left join departamentos depto on af.iddepartamento = depto.id 
            left join municipios muni on af.idmunicipio = muni.id
            WHERE af.id=$1`, [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener la Accion Formativa:', error); 
        throw error;
    }
}


export const postAccionFormativaM = async (
    accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, 
    metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, creadopor) =>{
    try {
        const { rows } = await pool.query(`
            INSERT INTO accionformativa 
                (accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal,
                iddepartamento, idmunicipio, metodologia, modalidad,tipomaterial, localdesarrollo, programaeducativo, donantessocios,
                creadopor, fechacreacion) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP) RETURNING *`, 
            [ 
                accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, 
                metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, creadopor
            ]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const putAccionFormativaM = async (
    accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal, iddepartamento, idmunicipio, 
    metodologia, modalidad, tipomaterial, localdesarrollo, programaeducativo, donantessocios, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE 
                accionformativa SET accionformatica=$1, salida=$2, horaspracticas=$3, horasteoricas=$4,
                horastotales=$5, fechainicio=$6, fechafinal=$7,
                iddepartamento=$8, idmunicipio=$9, metodologia=$10,
                modalidad=$11, tipomaterial=$12, localdesarrollo=$13,
                programaeducativo=$14, donantessocios=$15,
                modificadopor=$16, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$17 RETURNING *`, 
            [ 
                accionformatica, salida, horaspracticas, horasteoricas, horastotales, fechainicio, fechafinal,
                iddepartamento, idmunicipio,
                metodologia, modalidad, tipomaterial,
                localdesarrollo, programaeducativo, donantessocios,
                modificadopor,id
            ]);
        return rows;
    } catch (error) {
        throw error;
    }
}