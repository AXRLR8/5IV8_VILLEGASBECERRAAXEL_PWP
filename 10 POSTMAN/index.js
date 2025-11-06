const express = require('express');
const mirrow = require('./endpoints/mirrow');
// vamos a hacer una importacion del servidor
const app = express();
const PORT = 3000;

app.use(express.json()); //middleware para parsear json
//definimos las rutas
app.get('/', mirrow);
app.post('/', mirrow);
app.put('/', mirrow);
app.patch('/', mirrow);
app.delete('/', mirrow);
app.head('/', mirrow);

app.listen(PORT, () => {
    console.log("Servidor escuchando");
});