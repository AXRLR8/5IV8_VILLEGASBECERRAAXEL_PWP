var http =require('http');
//vamos a crear nuestro propio servidor

var servidor = http.createServer(function (req, res){
    //req -> request es una solicitud, viene por parte de la arquitectura cliente servidor, todos los clientes (navegadores, usuarios, app, servicios, etc=
    res.writeHead(200, {'Content-Type' :  'text/html; charset=utf-8'});
    response.write('<h1>Hola mundo desde node.js </h1>')
    res.write('<h1>A mimir</h1>')
    console.log('Hola si entro al servidor')
    res.end();
});

servidor.listen(3000);

console.log('Servidor ejecutandose en http://localhost:3000')