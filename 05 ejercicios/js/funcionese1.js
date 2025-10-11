function validarn(e){
    var teclado = (document.all)?e.keyCode:e.which;
    if(teclado==8)return true;
    var patron =/[0-9\d .]/;
    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);
}

function interes(){
    var valor = document.getElementById("cantidadi").value;
    var meses = document.getElementById("mesesi").value;
    var parseo = parseFloat(valor);
    var numMeses = parseInt(meses);
    if (numMeses > 18) {
        alert("El numero de meses no puede ser mayor a 18");
        document.getElementById("mesesi").value = 18;
        numMeses = 18;
    }

    var tasaAnual = 0.085; // 8.5% anual
    var tasaMensual = tasaAnual / 12; // Tasa mensual
    var interes = parseo * tasaMensual * numMeses;
    var total = parseo + interes;
    document.getElementById("saldoi").value = "$ " + total;//Limite a 2 decimales
}

function borrari(){
    document.getElementById("cantidadi").value = "";
    document.getElementById("saldoi").value = "";
}

function comision(){
    var sueldobase = parseFloat(document.getElementById("sueldobasei").value || 0);
    var venta1 = parseFloat(document.getElementById("ventai1").value || 0);
    var venta2 = parseFloat(document.getElementById("ventai2").value || 0);
    var venta3 = parseFloat(document.getElementById("ventai3").value || 0);

    var totalVentas = venta1 + venta2 + venta3;
    var comision = totalVentas * 0.10;
    var totalPagar = sueldobase + comision;


    document.getElementById("comisioni").value = "$ " + comision.toFixed(2);
    document.getElementById("totalpagar").value = "$ " + totalPagar.toFixed(2);
}

function descuento(){
    var nombre = document.getElementById("nombrei").value;
    var precio = parseFloat(document.getElementById("precioi").value) || 0;
    
    var precioParseado = precio; 
    var descuentoCalculado = precioParseado * 0.15;
    var totalPagar = precioParseado - descuentoCalculado;

    document.getElementById("productoResultadoi").value = nombre;
    document.getElementById("precioOriginalResultadoi").value = "$ " + precioParseado.toFixed(2);
    document.getElementById("descuentoi").value = "$ " + descuentoCalculado.toFixed(2);
    document.getElementById("totalPagari").value = "$ " + totalPagar.toFixed(2);
}
/*
2 se deben de ingresar 3 ventas, un sueldo base, y despues calcular el monto total, debe aparecer cuanto cobra por comiion y la suma

3 se debe ingresar un producto con su precio y aplicarle el 15% y el sistema debe mostrar el producto, el precio, el desceunto y el total a pagar

4 se debe de ingresar calif 1, 2 y 3, se aplica el promedio y su porcentaje, se ingresa trabajo fianl y se aplica un porcentaje, y examen final se aplica el porcentaje y se debe mostrar la calif final

5 se debe de ingresar cantidad de hombre y cantidad de mujeres y mostrar sus porcentajes correspondientes

6 calcular la edad de una persona
*/