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
    var li = document.createElement("li");
    li.textContent = instruccion;
    ul.appendChild(li);
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
    return false
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
    var nuevaFilaPiezaVacia;
    var nuevaColumnaPiezaVacia;

    if(direccion === codigosDireccion.ABAJO){
        nuevaFilaPiezaVacia = filaVacia + 1;
        nuevaColumnaPiezaVacia = columnaVacia;
    }
    else if(direccion === codigosDireccion.ARRIBA){
        nuevaFilaPiezaVacia = filaVacia - 1;
        nuevaColumnaPiezaVacia = columnaVacia;
    }
    else if(direccion === codigosDireccion.DERECHA){
        nuevaFilaPiezaVacia = filaVacia;
        nuevaColumnaPiezaVacia = columnaVacia + 1;
    }
    else if(direccion === codigosDireccion.IZQUIERDA){
        nuevaFilaPiezaVacia = filaVacia;
        nuevaColumnaPiezaVacia = columnaVacia - 1;
    }

    if(posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)){
        intercambiarPosiciones(filaVacia, columnaVacia, nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
        actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
        actualizarUltimoMovimiento(direccion);
    }
}

function intercambiarPosiciones(fila1, columna1, fila2, columna2){
    var pieza1 = rompe[fila1][columna1];
    var pieza2 = rompe[fila2][columna2];

    intercambiarPosicionesRompe(fila1, columna1, fila2, columna2);
    intercambiarPosicionesDOM('pieza'+ pieza1, 'pieza'+ pieza2);
} 

function intercambiarPosicionesDOM(idPieza1, idPieza2){
    var pieza1 = document.getElementById(idPieza1);
    var pieza2 = document.getElementById(idPieza2);

    var padre = pieza1.parentNode;
    var padre2 = pieza2.parentNode;

    var clonElemento1 = pieza1.cloneNode(true);
    var clonElemento2 = pieza2.cloneNode(true);

    padre.replaceChild(clonElemento1, pieza2);
    padre2.replaceChild(clonElemento2, pieza1);
    
    // Al finalizar el intercambio, asegurar el fondo blanco en la pieza vacía (si es necesario)
    establecerFondoBlanco();
}

function actualizarUltimoMovimiento(direccion){
    var ultimoMovimiento = document.getElementById("flecha");
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

function mezclarPiezas(veces) {
    if(veces <= 0){
        alert("Asi no se puede");
        return;
    }

    var direcciones = [codigosDireccion.ABAJO, codigosDireccion.ARRIBA, codigosDireccion.DERECHA, codigosDireccion.IZQUIERDA];

    var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];

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
            var gano = checarSiGano();
            if(gano){
                setTimeout(function(){
                    mostrarCartelGanador();
                }, 500);
            }
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
        var imgElemento = pieza.querySelector('img');

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
        var imgElemento = pieza.querySelector('img');

        if (imgElemento) {
            var srcActual = imgElemento.getAttribute('src');
            var nuevoSrc = srcActual.replace(/(\d)\.jpg$/, '$10.jpg');
            
            imgElemento.setAttribute('src', nuevoSrc);
        }
    }
    esSetAlterno = false;
    establecerFondoBlanco(); 
}

function iniciar(){
    mostrarInstrucciones(instrucciones);
    establecerFondoBlanco(); 
    mezclarPiezas(30);
    capturarTeclas();
}

function reiniciar(){
    mezclarPiezas(30);
    capturarTeclas();
}

iniciar();