'use strict';

// Operações suportadas: adição (add), subtração (subtract),
// multiplicação (multiply) e divisão (divide).
const addition = (a, b) => a + b;
const subtraction = (a, b) => a - b;
const multiplication = (a, b) => a * b;
const division = (a, b) => a / b;

const operations = {
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
};

if (require.main === module) {
  const [operation, first, second, ...extra] = process.argv.slice(2);
  const numberPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;

  if (extra.length || !Object.hasOwn(operations, operation) ||
      first === undefined || second === undefined ||
      !numberPattern.test(first) || !numberPattern.test(second) ||
      !Number.isFinite(Number(first)) || !Number.isFinite(Number(second))) {
    console.error('Uso: node src/calculator.js <add|subtract|multiply|divide> <número> <número>');
    process.exitCode = 1;
  } else if (operation === 'divide' && Number(second) === 0) {
    console.error('Erro: divisão por zero não é permitida.');
    process.exitCode = 1;
  } else {
    const result = operations[operation](Number(first), Number(second));
    if (!Number.isFinite(result)) {
      console.error('Erro: resultado fora do intervalo numérico suportado.');
      process.exitCode = 1;
    } else {
      console.log(result);
    }
  }
}

module.exports = { addition, subtraction, multiplication, division };
