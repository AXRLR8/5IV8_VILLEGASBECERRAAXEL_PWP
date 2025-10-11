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

function califfinal() {
    var c1 = parseFloat(document.getElementById("calif1i").value) || 0;
    var c2 = parseFloat(document.getElementById("calif2i").value) || 0;
    var c3 = parseFloat(document.getElementById("calif3i").value) || 0;
    var trabajo = parseFloat(document.getElementById("trabajoFinali").value) || 0;
    var examen = parseFloat(document.getElementById("examenFinali").value) || 0;

    var promedioParciales = (c1 + c2 + c3) / 3;
    var ponderadoParciales = promedioParciales * 0.55;

    var ponderadoTrabajo = trabajo * 0.30;

    var ponderadoExamen = examen * 0.15;

    var calificacionFinal = ponderadoParciales + ponderadoTrabajo + ponderadoExamen;

    document.getElementById("califFinali").value = calificacionFinal.toFixed(2);
}

function calcularPorcentajes() {
    var hombres = parseInt(document.getElementById("cantHombresi").value) || 0;
    var mujeres = parseInt(document.getElementById("cantMujeresi").value) || 0;
    var total = hombres + mujeres;
    var porcHombres = (hombres / total) * 100;
    var porcMujeres = (mujeres / total) * 100;
    document.getElementById("porcHombresi").value = porcHombres.toFixed(2);
 
    document.getElementById("porcMujeresi").value = porcMujeres.toFixed(2);
}
/*
5 se debe de ingresar cantidad de hombre y cantidad de mujeres y mostrar sus porcentajes correspondientes
6 calcular la edad de una persona
*/