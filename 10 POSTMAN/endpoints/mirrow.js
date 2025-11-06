const mirrow = (req,res) =>{
    const method = [{
        method: 'POST',
        hasbody: true,
        purpouse: "El metodo post se utiliza para enviar una entidad a un recurso, especifico, causando a menudo un cambioen el estado o efectos secundarios en el servidor."
    },{
        method: 'PUT',
        hasbody: true,
        purpouse: "El metodo put se remplaza todas las representaciones actuales del recurso de destino con la carga util enviada."
    },{
        method: 'PATCH',
        hasbody: true,
        purpouse: "El metodo patch se utiliza para aplicar modificaciones parciales a un recurso."
    },{
        method: 'HEAD',
        hasbody: false,
        purpouse: "El metodo get pide una respuesta identica a la de una peticion GET, pero sin el cuerpo de la reespuesta"
    },{
        method: 'GET',
        hasbody: false,
        purpouse: "El metodo get solicita una representacion de un recurso especifico. Las peticiones que utilizan el metodo get solo deben recuperar datos."
    },{
        method: 'DELETE',
        hasbody: false,
        purpouse: "El metodo delete elimina un recurso especifico."  
    }];

    const requestMethod = method.find(m => m.method === req.method) || {
        method: req.method,
        hasbody: false,
        purpouse: "No tiene un body, no hay una respuesta, Metodo no soportado"
    };
    requestMethod.purpouse+= requestMethod.hasbody ? " Y tiene un body." : " Y no tiene un body.";
    if(requestMethod.hasbody){
        req.body; //js debe de parsear mediante un JSON  el obj necesario
        res.json({...req.body, ruta_consumida:
            req.route.path, ...requestMethod});
    }else{
        res.json({ruta_consumida:
            req.originalUrl, ...requestMethod});
    }
};

module.exports = mirrow;

