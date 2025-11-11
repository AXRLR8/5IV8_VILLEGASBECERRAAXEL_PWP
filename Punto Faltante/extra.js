/**
 * @param {Function} fn
 * @return {Function}
 */
function memoize(fn) {
    const entradas = []; 
    const salidas = []; 

    return function(a, b) {
        for (let i = 0; i < entradas.length; i++) {
            const [m, n] = entradas[i];
            if (m === a && n === b) {
                return salidas[i];
            }
        }

        const result = fn(a, b);

        entradas.push([a, b]);
        salidas.push(result);

        return result;
    };

}
/** 
 * let callCount = 0;
 * const memoizedFn = memoize(function (a, b) {
 *	 callCount += 1;
 *   return a + b;
 * })
 * memoizedFn(2, 3) // 5
 * memoizedFn(2, 3) // 5
 * console.log(callCount) // 1 
 */