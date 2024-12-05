const fs = require('fs');
const BigNumber = require('bignumber.js');

// Function to decode a value based on its base
function decodeValue(value, base) {
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = new BigNumber(0);
    for (let i = 0; i < value.length; i++) {
        const digitIndex = digits.indexOf(value[value.length - 1 - i].toUpperCase());
        result = result.plus(new BigNumber(digitIndex).times(new BigNumber(base).pow(i)));
    }
    return result;
}

function lagrangeInterpolation(points, k) {
    let c = new BigNumber(0);
    for (let i = 0; i < k; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let term = yi;
        for (let j = 0; j < k; j++) {
            if (j !== i) {
                let xj = points[j][0];
                term = term.times(xj).div(xj.minus(xi));
            }
        }
        c = c.plus(term);
    }
    return c;
}

function findSecret(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const { keys: { n, k } } = data;
    let points = [];
    for (let key in data) {
        if (key !== 'keys') {
            const base = parseInt(data[key].base, 10);
            const value = data[key].value;
            const x = new BigNumber(key, 10);
            const y = decodeValue(value, base);
            points.push([x, y]);
        }
    }
    points.sort((a, b) => (a[0].lt(b[0])) ? -1 : 1);
    points = points.slice(0, k);
    return lagrangeInterpolation(points, k);
}

const secret1 = findSecret('sampleTestcase1.json');
const secret2 = findSecret('sampleTestcase2.json');
console.log(`Secret for sampleTestcase1: ${secret1}`);
console.log(`Secret for sampleTestcase2: ${secret2}`);
