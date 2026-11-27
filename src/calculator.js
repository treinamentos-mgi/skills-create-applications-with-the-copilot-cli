'use strict';

// Operações suportadas: adição (add), subtração (subtract),
// multiplicação (multiply), divisão (divide), módulo (modulo),
// potenciação (power) e raiz quadrada (sqrt).
const addition = (a, b) => a + b;
const subtraction = (a, b) => a - b;
const multiplication = (a, b) => a * b;
const division = (a, b) => a / b;
const modulo = (a, b) => {
  if (b === 0) {
    throw new RangeError('módulo por zero não é permitido.');
  }
  return a % b;
};
const power = (base, exponent) => base ** exponent;
const squareRoot = (n) => {
  if (n < 0) {
    throw new RangeError('raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(n);
};

const operations = {
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
  modulo,
  power,
  sqrt: squareRoot,
};

if (require.main === module) {
  const [operation, ...args] = process.argv.slice(2);
  const numberPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
  const expectedArgumentCount = operation === 'sqrt' ? 1 : 2;

  if (!Object.hasOwn(operations, operation) || args.length !== expectedArgumentCount ||
      args.some((value) => !numberPattern.test(value) || !Number.isFinite(Number(value)))) {
    console.error(
      'Uso: node src/calculator.js <add|subtract|multiply|divide|modulo|power> <número> <número> ou <sqrt> <número>',
    );
    process.exitCode = 1;
  } else {
    const [first, second] = args.map(Number);
    if (operation === 'divide' && second === 0) {
      console.error('Erro: divisão por zero não é permitida.');
      process.exitCode = 1;
    } else if (operation === 'modulo' && second === 0) {
      console.error('Erro: módulo por zero não é permitido.');
      process.exitCode = 1;
    } else if (operation === 'sqrt' && first < 0) {
      console.error('Erro: raiz quadrada de número negativo não é permitida.');
      process.exitCode = 1;
    } else {
      const result = operation === 'sqrt'
        ? operations[operation](first)
        : operations[operation](first, second);
      if (!Number.isFinite(result)) {
        console.error('Erro: resultado fora do intervalo numérico suportado.');
        process.exitCode = 1;
      } else {
        console.log(result);
      }
    }
  }
}

module.exports = { addition, subtraction, multiplication, division, modulo, power, squareRoot };
