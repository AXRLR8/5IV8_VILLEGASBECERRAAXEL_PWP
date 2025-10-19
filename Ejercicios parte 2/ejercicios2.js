/* Archivo: script.js */

const obtenerNumeroYValidar = (idInput, idError) => {
    const inputElement = document.querySelector(`#${idInput}`);
    const errorElement = document.querySelector(`#${idError}`);
    const valor = inputElement.value;
    
    errorElement.textContent = ''; 

    if (valor.trim() === '' || isNaN(Number(valor))) {
        errorElement.textContent = 'Campo obligatorio y debe ser un número.';
        return null; 
    }

    return Number(valor);
};

const limpiarError = (idError) => {
    document.querySelector(`#${idError}`).textContent = '';
}

// PROBLEMA 1: Operación con dos números
const resolverP1 = () => {
    limpiarError('error1_num1');
    limpiarError('error1_num2');

    const num1 = obtenerNumeroYValidar('num1_p1', 'error1_num1');
    const num2 = obtenerNumeroYValidar('num2_p1', 'error1_num2');
    const resultadoElement = document.querySelector('#resultado_p1');

    if (num1 === null || num2 === null) {
        resultadoElement.textContent = 'Ingrese dos números válidos.';
        return;
    }

    let resultado;
    let operacion;

    if (num1 === num2) {
        resultado = num1 * num2;
        operacion = `Multiplicación (${num1} * ${num2})`;
    } else if (num1 > num2) {
        resultado = num1 - num2;
        operacion = `Resta (${num1} - ${num2})`;
    } else {
        resultado = num1 + num2;
        operacion = `Suma (${num1} + ${num2})`;
    }

    resultadoElement.textContent = `Esta operación es de: ${operacion}. El resultado es: ${resultado}`;
};

// PROBLEMA 2: Número Mayor de Tres
const resolverP2 = () => {
    limpiarError('error2_num1');
    limpiarError('error2_num2');
    limpiarError('error2_num3');

    const numA = obtenerNumeroYValidar('num1_p2', 'error2_num1');
    const numB = obtenerNumeroYValidar('num2_p2', 'error2_num2');
    const numC = obtenerNumeroYValidar('num3_p2', 'error2_num3');
    const resultadoElement = document.querySelector('#resultado_p2');

    if (numA === null || numB === null || numC === null) {
        resultadoElement.textContent = 'Ingrese los tres números válidos.';
        return;
    }

    if (numA === numB || numA === numC || numB === numC) {
        resultadoElement.textContent = 'Error: Los números deben ser diferentes entre sí.';
        document.querySelector('#error2_num1').textContent = 'Deben ser diferentes.';
        document.querySelector('#error2_num2').textContent = 'Deben ser diferentes.';
        document.querySelector('#error2_num3').textContent = 'Deben ser diferentes.';
        return;
    }

    let mayor = numA;

    if (numB > mayor) {
        mayor = numB;
    }

    if (numC > mayor) {
        mayor = numC;
    }
    
    resultadoElement.textContent = `El número mayor es: ${mayor}`;
};

// PROBLEMA 3: Cálculo de Horas Extra
const resolverP3 = () => {
    limpiarError('error3_horas');
    limpiarError('error3_pago');

    const horasTrabajadas = obtenerNumeroYValidar('horas_p3', 'error3_horas');
    const pagoNormal = obtenerNumeroYValidar('pago_p3', 'error3_pago');
    const resultadoElement = document.querySelector('#resultado_p3');

    if (horasTrabajadas === null || pagoNormal === null || horasTrabajadas < 0 || pagoNormal <= 0) {
        resultadoElement.textContent = 'Ingrese horas y pago base válidos y positivos.';
        return;
    }

    const HORAS_NORMALES_BASE = 40;
    const pagoDoble = pagoNormal * 2;
    const pagoTriple = pagoNormal * 3;

    let pagoBase;
    let horasExtra;
    let pagoExtra = 0;
    
    if (horasTrabajadas <= HORAS_NORMALES_BASE) {
        pagoBase = horasTrabajadas * pagoNormal;
        horasExtra = 0;
    } else {
        pagoBase = HORAS_NORMALES_BASE * pagoNormal;
        horasExtra = horasTrabajadas - HORAS_NORMALES_BASE;

        if (horasExtra <= 8) {
            pagoExtra = horasExtra * pagoDoble;
        } else {
            const hrsDoble = 8;
            const hrsTriple = horasExtra - hrsDoble;

            pagoExtra = (hrsDoble * pagoDoble) + (hrsTriple * pagoTriple);
        }
    }

    const pagoTotal = pagoBase + pagoExtra;
    
    resultadoElement.innerHTML = `
        Pago Normal (hasta 40 hrs): \$${pagoBase.toFixed(2)} <br>
        Horas Extra: ${horasExtra} hrs <br>
        Pago Extra: \$${pagoExtra.toFixed(2)} <br>
        **Pago Total del Trabajador: \$${pagoTotal.toFixed(2)}**
    `;
};

// PROBLEMA 4: Cálculo de Utilidad Anual
const resolverP4 = () => {
    limpiarError('error4_salario');
    limpiarError('error4_antiguedad');
    
    const salarioMensual = obtenerNumeroYValidar('salario_p4', 'error4_salario');
    const antiguedad = obtenerNumeroYValidar('antiguedad_p4', 'error4_antiguedad');
    const resultadoElement = document.querySelector('#resultado_p4');

    if (salarioMensual === null || antiguedad === null || salarioMensual < 0 || antiguedad < 0) {
        resultadoElement.textContent = 'Ingrese salario y antigüedad válidos y no negativos.';
        return;
    }

    let porcentajeUtilidad;
    let categoria;

    if (antiguedad < 1) {
        porcentajeUtilidad = 0.05; 
        categoria = 'Menos de 1 año (5%)';
    } else if (antiguedad < 2) {
        porcentajeUtilidad = 0.07; 
        categoria = '1 a 2 años (7%)';
    } else if (antiguedad < 5) {
        porcentajeUtilidad = 0.10; 
        categoria = '2 a 5 años (10%)';
    } else if (antiguedad < 10) {
        porcentajeUtilidad = 0.15; 
        categoria = '5 a 10 años (15%)';
    } else { 
        porcentajeUtilidad = 0.20; 
        categoria = 'Más de 10 años (20%)';
    }

    const utilidad = salarioMensual * porcentajeUtilidad;
    
    resultadoElement.innerHTML = `
        Salario Mensual: \$${salarioMensual.toFixed(2)} <br>
        Antigüedad: ${antiguedad} años (${categoria}) <br>
        **Utilidad Asignada: \$${utilidad.toFixed(2)}**
    `;
};