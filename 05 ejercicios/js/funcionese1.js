function validarn(e){
    var teclado = (document.all)?e.keyCode:e.which;
    if(teclado==8)return true;
    var patron =/[0-9\d .]/;
    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);
}

function interes(){
    var valor = document.getElementById("cantidadi").value;
    var parseo = parseFloat(valor);
    alert(parseo);
    var interes = parseo * (0.085);//Limite a 2 decimales
    alert(interes);
    var total = parseo + interes;
    alert(total);
    document.getElementById("saldoi").value = "$ " + total;//Limite a 2 decimales
}

function borrari(){
    document.getElementById("cantidadi").value = "";
    document.getElementById("saldoi").value = "";
}
/*
Del ejercicio 1, tenemos que agregar el campo numero de meses y sera una inversion de meximo 18 meses

2 se deben de ingresar 3 ventas, un sueldo base, y despues calcular el monto total, debe aparecer cuanto cobra por comiion y la suma

3 se debe ingresar un producto con su precio y aplicarle el 15% y el sistema debe mostrar el producto, el precio, el desceunto y el total a pagar

4 se debe de ingresar calif 1, 2 y 3, se aplica el promedio y su porcentaje, se ingresa trabajo fianl y se aplica un porcentaje, y examen final se aplica el porcentaje y se debe mostrar la calif final

5 se debe de ingresar cantidad de hombre y cantidad de mujeres y mostrar sus porcentajes correspondientes

6 calcular la edad de una persona
*/