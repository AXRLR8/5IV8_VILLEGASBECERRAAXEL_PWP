function problema1(){
    const inputElement = document.getElementById('p1-input');
    const outputElement = document.getElementById('p1-output');
    const texto = inputElement.value.trim();
    const palabras = texto.split(' ').filter(word => word.length > 0);
    const palabrasInvertidas = palabras.reverse();
    const resultado = palabrasInvertidas.join(' ');
    outputElement.textContent = resultado;
}

function problema2(){
    const inputElement = document.getElementById('p1-input');
    const outputElement = document.getElementById('p1-output');
    
    const texto = inputElement.value.trim();

    const palabras = texto.split(' ').filter(word => word.length > 0);
    const palabrasInvertidas = palabras.reverse();
    const resultado = palabrasInvertidas.join(' ');

    outputElement.textContent = resultado;
}

function problema2() {
     //jaime
    //primero necesitamos los valores
    var p2_x1 = document.querySelector("#p2_x1").value;
    var p2_x2 = document.querySelector("#p2_x2").value;
    var p2_x3 = document.querySelector("#p2_x3").value;
    var p2_x4 = document.querySelector("#p2_x4").value;
    var p2_x5 = document.querySelector("#p2_x5").value;

    var p2_y1 = document.querySelector("#p2_y1").value;
    var p2_y2 = document.querySelector("#p2_y2").value;
    var p2_y3 = document.querySelector("#p2_y3").value;
    var p2_y4 = document.querySelector("#p2_y4").value;
    var p2_y5 = document.querySelector("#p2_y5").value;

    //Creamos los vectores
    var v1 = [p2_x1, p2_x2, p2_x3, p2_x4, p2_x5];
    var v2 = [p2_y1, p2_y2, p2_y3, p2_y4, p2_y5];

    //Creamos el vector resultado
    v1 = v1.sort(function(a, b){return b-a});
    v2 = v2.sort(function(a, b){return b-a});

    v2 = v2.reverse();

    var p2_producto = 0;
    
    for(var i=0; i<v1.length; i ++){

        p2_producto += v1[i] * v2[i];
    }
    document.querySelector("#p2_output").innerHTML = "El producto escalar minimo es: " + p2_producto;


}

function problema3(){
    const inputElement = document.getElementById('p3-input');
    const outputElement = document.getElementById('p3-output');
    
    const texto = inputElement.value.toUpperCase().replace(/\s/g, ''); 

    const palabras = texto.split(',').filter(word => word.length > 0);

    let palabraConMasCaracteresUnicos = "";
    let maxCaracteresUnicos = -1;

    for (const palabra of palabras) {
        const caracteresUnicos = new Set(palabra);
        const count = caracteresUnicos.size;

        if (count > maxCaracteresUnicos) {
            maxCaracteresUnicos = count;
            palabraConMasCaracteresUnicos = palabra;
        }
    }

    outputElement.textContent = `La palabra con más caracteres únicos es: ${palabraConMasCaracteresUnicos} (con ${maxCaracteresUnicos} caracteres únicos).`;
}

