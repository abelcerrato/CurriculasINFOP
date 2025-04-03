import { pool } from '../db.js'

export const getMunicipiosM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
             m.id, 
              m.municipio, 
              d.departamento, 
              d.id AS iddepartamento
            FROM municipios m
            INNER JOIN departamentos d ON m.iddepartamento = d.id
            ORDER BY m.id ASC;
            `);  
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getMunicipioIdM = async (id) => {
    console.log('Municipio enviado:', id);
    try {
        const { rows } = await pool.query('SELECT municipio,id, iddepartamento FROM municipios WHERE iddepartamento =$1', [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Municipio:', error); 
        throw error;
    }
}


export const postMunicipiosM = async (municipio, iddepartamento) =>{
    try {
        const { rows } = await pool.query('INSERT INTO municipios (municipio, iddepartamento, fechacreacion, fechamodificacion) VALUES ($1, $2, CURRENT_TIMESTAMP, null) RETURNING *', [municipio, iddepartamento]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const putMunicipioM = async (id, municipio, iddepartamento) => {
    try {
        const { rows } = await pool.query('UPDATE municipios SET municipio=$1, iddepartamento=$2, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', [municipio, iddepartamento, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}