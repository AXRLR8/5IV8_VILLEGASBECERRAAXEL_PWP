require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require ('path');

const app = express();
const PORT = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'css'))); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    let connection;
    let scores = [];
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT ganador, DATE_FORMAT(fecha, '%d-%m-%Y %H:%i:%s') as fecha_formato FROM puntajes ORDER BY fecha DESC LIMIT 10"
        );
        scores = rows;
        res.render('index', { scores: scores }); 
    } catch (error) {
        console.error('Error al obtener puntajes:', error);
        res.render('index', { scores: [], dbError: true }); 
    } finally {
        if (connection) connection.release();
    }
});

app.post('/save-score', async (req, res) => {
    let connection;
    try {
        const { ganador } = req.body;
        if (!ganador) {
            return res.status(400).json({ success: false, message: 'Ganador no proporcionado.' });
        }

        connection = await pool.getConnection();
        const sql = "INSERT INTO puntajes (ganador) VALUES (?)";
        await connection.execute(sql, [ganador]);

        res.json({ success: true, message: 'Score guardado exitosamente.' });

    } catch (error) {
        console.error('Error al guardar score:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al guardar el score.' });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});