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
    const idsX = ['p2-x1', 'p2-x2', 'p2-x3', 'p2-x4', 'p2-x5'];
    const idsY = ['p2-y1', 'p2-y2', 'p2-y3', 'p2-y4', 'p2-y5'];
    const outputElement = document.getElementById('p2-output');

    const obtenerVector = (ids) => {
        const vector = [];
        for (const id of ids) {
            const value = document.getElementById(id).value;
            const num = parseFloat(value);
            vector.push(num);
        }
        return vector;
    };

    const v1 = obtenerVector(idsX);
    const v2 = obtenerVector(idsY);

    v1.sort((a, b) => a - b); 
    v2.sort((a, b) => b - a); 

    let productoEscalarMinimo = 0;
    for (let i = 0; i < v1.length; i++) {
        productoEscalarMinimo += v1[i] * v2[i];
    }

    outputElement.textContent = `V1 ordenado (ascendente): (${v1.join(', ')})\nV2 ordenado (descendente): (${v2.join(', ')})\nProducto Escalar Mínimo: ${productoEscalarMinimo}`;
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