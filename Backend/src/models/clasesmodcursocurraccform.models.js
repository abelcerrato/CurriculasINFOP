import { pool } from '../db.js'

export const getClasModCurrAccFormM = async () => {
    try {
        const { rows } = await pool.query(`
            select 	
                c.id, c.idaccionformativa, a2.accionformatica,
                c.idcurriculas, 
                    curr.curricula, curr.sector, curr.duracionteorica as duracionteoricaCurricula, curr.duracionpractica as duracionpracticaCurricula, curr.duraciontotal as duraciontotalCurricula,
                    curr.nombresalida, curr.objetivo, curr.versioncurricula, curr.idareaformacion, a.areaformacion, 
                c.idmoduloscurriculas,
                    mc.modulo, mc.duracionteorica as duracionteoricaModulo, mc.duracionpractica as duracionpractiaModulo, mc.duraciontotal as duraciontotalModulo,
                c.idclasescurriculas,
                    cc.clase, cc.duracionteorica as duracionteoricaClase, cc.duracionpractica as duracionpracticaClase, cc.duraciontotal as duraciontotalClase,
                c.duracionteorica,
                c.duracionpractica,
                c.duraciontotal,
                muc.creadopor, c.fechacreacion,  mum.modificadopor, c.fechamodificacion
            FROM ClassModCurrAF as c
            left join accionformativa a2 on c.idaccionformativa = a2.id 
            left join curriculas curr on c.idcurriculas = curr.id 
            left join areasformacion a on curr.idareaformacion = a.id
            left join moduloscurriculas mc on c.idmoduloscurriculas = mc.id
            left join clasescurriculas cc on c.idclasescurriculas = cc.id
            left join ms_usuarios muc on c.creadopor = muc.id 
            left join ms_usuarios mum on c.modificadopor = mum.id 
            order by c.id asc 
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getClasModCurrAccFormIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            select 	
                c.id, c.idaccionformativa, a2.accionformatica,
                c.idcurriculas, 
                    curr.curricula, curr.sector, curr.duracionteorica as duracionteoricaCurricula, curr.duracionpractica as duracionpracticaCurricula, curr.duraciontotal as duraciontotalCurricula,
                    curr.nombresalida, curr.objetivo, curr.versioncurricula, curr.idareaformacion, a.areaformacion, 
                c.idmoduloscurriculas,
                    mc.modulo, mc.duracionteorica as duracionteoricaModulo, mc.duracionpractica as duracionpractiaModulo, mc.duraciontotal as duraciontotalModulo,
                c.idclasescurriculas,
                    cc.clase, cc.duracionteorica as duracionteoricaClase, cc.duracionpractica as duracionpracticaClase, cc.duraciontotal as duraciontotalClase,
                c.duracionteorica,
                c.duracionpractica,
                c.duraciontotal,
                muc.creadopor, c.fechacreacion,  mum.modificadopor, c.fechamodificacion
            FROM ClassModCurrAF as c
            left join accionformativa a2 on c.idaccionformativa = a2.id 
            left join curriculas curr on c.idcurriculas = curr.id 
            left join areasformacion a on curr.idareaformacion = a.id
            left join moduloscurriculas mc on c.idmoduloscurriculas = mc.id
            left join clasescurriculas cc on c.idclasescurriculas = cc.id
            left join ms_usuarios muc on c.creadopor = muc.id 
            left join ms_usuarios mum on c.modificadopor = mum.id 
            where c.id=$1`, [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export const postClasModCurrAccFormM = async (
    idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO ClassModCurrAF 
                (idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, creadopor)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, creadopor]);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const putClasModCurrAccFormM = async (
    idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE ClassModCurrAF 
                SET idaccionformativa=$1, idcurriculas=$2, idmoduloscurriculas=$3, idclasescurriculas=$4,
                duracionteorica=$5, duracionpractica=$6, duraciontotal=$7,
                modificadopor=$8, fechamodificacion=CURRENT_TIMESTAMP
            WHERE id=$9 RETURNING *`, [idaccionformativa, idcurriculas, idmoduloscurriculas, idclasescurriculas, duracionteorica, duracionpractica, duraciontotal, modificadopor, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}