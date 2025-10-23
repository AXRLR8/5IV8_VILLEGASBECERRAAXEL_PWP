var instrucciones = [
    "Utiliza las flechas de navegación para mover las piezas",
    "Para ordenar las piezas guíate por la imagen objetivo"
];

var esSetAlterno = false;

var movimientos = [];

var rompe = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];

var rompeCorrecta = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];

var filaVacia = 2;
var columnaVacia = 2;

function mostrarInstrucciones(instrucciones){
    for(var i = 0; i < instrucciones.length; i++){
        mostrarInstruccionesLista(instrucciones[i], "lista-instrucciones");
    }
}

function mostrarInstruccionesLista(instruccion, idLista) {
    var ul = document.getElementById(idLista);
    if (ul) {
        var li = document.createElement("li");
        li.textContent = instruccion;
        ul.appendChild(li);
    }
}

function checarSiGano(){
    for(var i = 0; i < rompe.length; i++){
        for(var j = 0; j < rompe[i].length; j++){
            var rompeActual = rompe[i][j];
            if(rompeActual !== rompeCorrecta[i][j]){
                return false;
            }
        }
    }
    return true;
}

function mostrarCartelGanador(){
    if(checarSiGano()){
        alert("¡Felicidades, ganaste jeje!");
    }
}

function intercambiarPosicionesRompe(filaPos1, columnaPos1, filaPos2, columnaPos2){
    var pos1 = rompe[filaPos1][columnaPos1];
    var pos2 = rompe[filaPos2][columnaPos2];

    rompe[filaPos1][columnaPos1] = pos2;
    rompe[filaPos2][columnaPos2] = pos1;
}

function actualizarPosicionVacia(nuevaFila, nuevaColumna){
    filaVacia = nuevaFila;
    columnaVacia = nuevaColumna;
}

function posicionValida(fila, columna){
    return (fila >= 0 && fila <= 2 && columna >= 0 && columna <= 2);
}

var codigosDireccion = {
    IZQUIERDA : 37 ,
    ARRIBA : 38,
    DERECHA : 39,
    ABAJO : 40
};

function moverEnDireccion(direccion){
    var nuevaFilaPiezaAMover;
    var nuevaColumnaPiezaAMover;

    if(direccion === codigosDireccion.ABAJO){
        nuevaFilaPiezaAMover = filaVacia - 1; 
        nuevaColumnaPiezaAMover = columnaVacia;
    }
    else if(direccion === codigosDireccion.ARRIBA){
        nuevaFilaPiezaAMover = filaVacia + 1;
        nuevaColumnaPiezaAMover = columnaVacia;
    }
    else if(direccion === codigosDireccion.DERECHA){
        nuevaFilaPiezaAMover = filaVacia;
        nuevaColumnaPiezaAMover = columnaVacia - 1;
    }
    else if(direccion === codigosDireccion.IZQUIERDA){
        nuevaFilaPiezaAMover = filaVacia;
        nuevaColumnaPiezaAMover = columnaVacia + 1;
    } else {
        return;
    }

    if(posicionValida(nuevaFilaPiezaAMover, nuevaColumnaPiezaAMover)){
        intercambiarPosiciones(filaVacia, columnaVacia, nuevaFilaPiezaAMover, nuevaColumnaPiezaAMover);
        actualizarPosicionVacia(nuevaFilaPiezaAMover, nuevaColumnaPiezaAMover);
        actualizarUltimoMovimiento(direccion);
        
        var gano = checarSiGano();
        if(gano){
             setTimeout(mostrarCartelGanador, 500); 
        }
    }
}

function intercambiarPosiciones(fila1, columna1, fila2, columna2){
    var piezaVaciaVal = rompe[fila1][columna1];
    var piezaAMoverVal = rompe[fila2][columna2];

    intercambiarPosicionesRompe(fila1, columna1, fila2, columna2);
    intercambiarPosicionesDOM('pieza'+ piezaVaciaVal, 'pieza'+ piezaAMoverVal);
} 

function intercambiarPosicionesDOM(idPieza1, idPieza2){
    var pieza1 = document.getElementById(idPieza1);
    var pieza2 = document.getElementById(idPieza2);

    if (!pieza1 || !pieza2) {
        return;
    }

    var padre = pieza1.parentNode;

    var pieza1Siguiente = pieza1.nextSibling;
    var pieza2Siguiente = pieza2.nextSibling;

    padre.insertBefore(pieza2, pieza1);
    if (pieza1Siguiente && pieza1Siguiente !== pieza2) {
        padre.insertBefore(pieza1, pieza2Siguiente);
    } else {
        padre.appendChild(pieza1);
    }
    
    establecerFondoBlanco();
}

function actualizarUltimoMovimiento(direccion){
    var ultimoMovimiento = document.getElementById("flecha");
    if (ultimoMovimiento) {
        switch(direccion){
            case codigosDireccion.ARRIBA:
                ultimoMovimiento.textContent = "↑";
                break;
            case codigosDireccion.ABAJO:
                ultimoMovimiento.textContent = "↓";
                break;
            case codigosDireccion.IZQUIERDA:
                ultimoMovimiento.textContent = "←";
                break;
            case codigosDireccion.DERECHA:
                ultimoMovimiento.textContent = "→";
                break;
        }
    }
}

function mezclarPiezas(veces) {
    if(veces <= 0){
        for(var i=0; i<rompe.length; i++) {
            var col = rompe[i].indexOf(9);
            if (col !== -1) {
                actualizarPosicionVacia(i, col);
                break;
            }
        }
        return;
    }

    var direcciones = [codigosDireccion.ABAJO, codigosDireccion.ARRIBA, codigosDireccion.DERECHA, codigosDireccion.IZQUIERDA];
    var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
    
    // Llamar a moverEnDireccion, que ya valida si el movimiento es posible
    moverEnDireccion(direccion); 

    setTimeout(function(){
        mezclarPiezas(veces - 1);
    }, 100);
}

function capturarTeclas(){
    document.body.onkeydown = (function(evento){
        if(evento.which === codigosDireccion.ARRIBA ||
                       evento.which === codigosDireccion.ABAJO ||
                       evento.which === codigosDireccion.DERECHA ||
                       evento.which === codigosDireccion.IZQUIERDA){
            moverEnDireccion(evento.which); 
            evento.preventDefault();
        }
    });
}

function alternarSetImagenes() {
    if (esSetAlterno) {
        cambiarImagenesASetDecena();
    } else {
        cambiarImagenesASetAlterno();
    }
}

function cambiarImagenesASetAlterno() {
    var body = document.body;
    body.style.backgroundColor = 'white';

    for (var i = 1; i <= 8; i++) {
        var pieza = document.getElementById('pieza' + i);
        var imgElemento = pieza ? pieza.querySelector('img') : null;

        if (imgElemento) {
            var srcActual = imgElemento.getAttribute('src');
            var nuevoSrc = srcActual.replace(/(\d)0\.jpg$/, '$1.jpg');
            
            imgElemento.setAttribute('src', nuevoSrc);
        }
    }
    esSetAlterno = true;
    establecerFondoBlanco(); 
}

function cambiarImagenesASetDecena() {
    var body = document.body;
    body.style.backgroundColor = '';

    for (var i = 1; i <= 8; i++) {
        var pieza = document.getElementById('pieza' + i);
        var imgElemento = pieza ? pieza.querySelector('img') : null;

        if (imgElemento) {
            var srcActual = imgElemento.getAttribute('src');
            var nuevoSrc = srcActual.replace(/(\d)\.jpg$/, '$10.jpg');
            
            imgElemento.setAttribute('src', nuevoSrc);
        }
    }
    esSetAlterno = false;
    establecerFondoBlanco(); 
}

function establecerFondoBlanco() {
    var idPiezaActualVacia = 'pieza' + rompe[filaVacia][columnaVacia];
    var piezaActualVacia = document.getElementById(idPiezaActualVacia);
     if (piezaActualVacia) {
        piezaActualVacia.style.backgroundImage = 'none';
        piezaActualVacia.style.backgroundColor = 'white'; 
    }
}

function iniciar(){
    mostrarInstrucciones(instrucciones);
    for(var i=0; i<rompe.length; i++) {
        var col = rompe[i].indexOf(9);
        if (col !== -1) {
            actualizarPosicionVacia(i, col);
            break;
        }
    }
    establecerFondoBlanco(); 
    mezclarPiezas(30);
    capturarTeclas();
}

function reiniciar(){
    rompe = [
        [1,2,3],
        [4,5,6],
        [7,8,9]
    ];
    // Se asume que tienes una función para redibujar el DOM a la posición inicial, 
    // pero como no está, solo reiniciamos la lógica.
    actualizarPosicionVacia(2, 2); 
    establecerFondoBlanco(); 
    mezclarPiezas(30);
}

iniciar();