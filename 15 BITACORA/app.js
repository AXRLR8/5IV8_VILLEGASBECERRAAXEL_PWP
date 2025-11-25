const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

// Función auxiliar para formatear la fecha a un string compatible con MySQL DATETIME
function formatToMySQLDateTime(dateString) {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return null; // Retorna null si la fecha no es válida
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
        return null; // En caso de cualquier error de parsing
    }
}

// Carga las variables de entorno del archivo .env
require('dotenv').config({path: './.env'});

const app = express();
const port = 3000;

const bd = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
});

bd.connect((error) => {
    if (error) {
        console.log('Error de conexión a la base de datos: ' + error);
    } else {
        console.log('Conexion exitosa a la base de datos');
    }
});

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de EJS y vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configuración de archivos estáticos (CSS)
app.use('/css', express.static(path.join(__dirname, 'css')));

// Middleware para validación
function validateBitacora(req, res, next) {
    const { fecha_hora_ronda, area_sector, punto_control, observaciones, inspector } = req.body;
    let errors = [];
    const MAX_LEN_SMALL = 20;
    const MAX_LEN_OBS = 400;

    // Validación de fecha
    const fechaHoraFormateada = formatToMySQLDateTime(fecha_hora_ronda);
    if (!fecha_hora_ronda || !fechaHoraFormateada) {
        errors.push('La fecha y hora de ronda es requerida y debe ser una fecha válida.');
    }

    // Validación de límites de caracteres (Cambiado a 20)
    if (!area_sector || area_sector.length > MAX_LEN_SMALL) {
        errors.push(`Área/Sector es requerido y no debe exceder los ${MAX_LEN_SMALL} caracteres.`);
    }
    if (!punto_control || punto_control.length > MAX_LEN_SMALL) {
        errors.push(`Punto de Control es requerido y no debe exceder los ${MAX_LEN_SMALL} caracteres.`);
    }
    if (!inspector || inspector.length > MAX_LEN_SMALL) {
        errors.push(`Inspector es requerido y no debe exceder los ${MAX_LEN_SMALL} caracteres.`);
    }
    // Validación de límites de observaciones (Se mantiene 400)
    if (!observaciones || observaciones.length > MAX_LEN_OBS) {
        errors.push(`Observaciones es requerido y no debe exceder los ${MAX_LEN_OBS} caracteres.`);
    }

    if (errors.length > 0) {
        // Almacena los errores y los datos para volver a renderizar el formulario
        req.validationErrors = errors;
        req.validatedData = req.body;
    }
    next();
}

// Ruta para mostrar errores con un alert
app.get('/bitacora/error', (req, res) => {
    const errorMessage = req.query.msg || 'Ha ocurrido un error inesperado.';
    // Script para mostrar un alert y redirigir
    res.send(`
        <script>
            alert('${errorMessage}');
            window.location.href = '/bitacora';
        </script>
    `);
});

// Ruta raíz: Redirige al index de la bitácora
app.get('/', (req, res) => {
    res.redirect('/bitacora');
});

// Mostrar el formulario de registro y la lista de registros de bitácora
app.get('/bitacora', (req, res)=>{
    const querry = 'SELECT id, fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector FROM bitacora ORDER BY id DESC';
    bd.query(querry, (error, resultados)=>{
        if(error){
            console.log('Error al obtener la bitácora: ' + error);
            return res.redirect('/bitacora/error?msg=Error+al+obtener+la+bitácora+de+la+base+de+datos');
        }
        // Se pasa un objeto vacío para errorMsg en caso de que no haya errores de validación
        res.render('index', { registros: resultados, errorMsg: null, oldData: {} }); 
    });
});

// Crear un nuevo registro en la bitácora
app.post('/bitacora', validateBitacora, (req, res) => {
    if (req.validationErrors) {
        // Si hay errores, volvemos a obtener los registros y renderizamos el index con el error
        const querry = 'SELECT id, fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector FROM bitacora ORDER BY id DESC';
        bd.query(querry, (error, resultados)=>{
            if(error){
                console.log('Error al obtener la bitácora para mostrar error: ' + error);
                return res.redirect('/bitacora/error?msg=Error+al+mostrar+el+formulario+con+errores');
            }
            // Creamos un mensaje de error único
            const msg = req.validationErrors.join('\\n');
            res.render('index', { registros: resultados, errorMsg: msg, oldData: req.validatedData });
        });
        return;
    }

    const { area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector } = req.body;
    const fechaHoraFormateada = formatToMySQLDateTime(req.body.fecha_hora_ronda);

    const querry = `INSERT INTO bitacora (fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const values = [fechaHoraFormateada, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector];

    bd.query(querry, values, (error, resultados) => {
        if (error) {
            console.log('Error al crear el registro de bitácora: ' + error);
            return res.redirect('/bitacora/error?msg=Error+al+crear+el+registro+en+la+base+de+datos');
        }
        res.redirect('/bitacora');
    });
});

// Eliminar un registro
app.get('/bitacora/delete/:id', (req, res) =>{
    const registroId = req.params.id;
    const querry = `DELETE FROM bitacora WHERE id = ?;`;
    
    bd.query(querry, [registroId], (error, resultados) =>{
        if(error){
            console.log('Error al eliminar el registro: ' + error);
            return res.redirect('/bitacora/error?msg=Error+al+eliminar+el+registro');
        }
        res.redirect('/bitacora');
    });
});

// Mostrar el formulario de seguimiento/edición para un registro específico
app.get('/bitacora/seguimiento/:id', (req, res) =>{ 
    const registroId = req.params.id;
    const querry = `SELECT id, fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector FROM bitacora WHERE id = ?;`;
    
    bd.query(querry, [registroId], (error, resultados) =>{
        if(error || resultados.length === 0){
            console.log('Error al obtener el registro para seguimiento: ' + (error || 'Registro no encontrado'));
            return res.redirect('/bitacora/error?msg=Registro+no+encontrado+o+error+de+base+de+datos');
        }
        // Pasamos el registro y un errorMsg nulo (o el que venga de una redirección de error)
        res.render('seguimiento', { registro: resultados[0], errorMsg: req.query.errorMsg || null }); 
    });
});

// Actualizar los datos de un registro (desde la vista de seguimiento)
app.post('/bitacora/update/:id', validateBitacora, (req, res) =>{
    const registroId = req.params.id;

    if (req.validationErrors) {
        // Si hay errores de validación, redirigimos a la vista de seguimiento con los errores
        // Se codifica el mensaje de error para pasarlo como query parameter
        const msg = encodeURIComponent(req.validationErrors.join(' | '));
        return res.redirect(`/bitacora/seguimiento/${registroId}?errorMsg=${msg}`);
    }

    const { fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector } = req.body; 
    
    const querry = `UPDATE bitacora SET fecha_hora_ronda=?, area_sector=?, punto_control=?, estado=?, observaciones=?, seguimiento_requerido=?, inspector=? WHERE id=?;`;
    
    const fechaHoraFormateada = formatToMySQLDateTime(fecha_hora_ronda);
    
    const values = [fechaHoraFormateada, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector, registroId];

    bd.query(querry, values, (error, resultados) =>{
        if(error){
            console.log('Error al actualizar el registro: ' + error);
            return res.redirect('/bitacora/error?msg=Error+al+actualizar+el+registro+en+la+base+de+datos');
        }
        res.redirect('/bitacora');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});