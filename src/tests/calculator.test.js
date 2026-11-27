'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { add, subtract, multiply, divide } = require('../calculator');

describe('operações aritméticas', () => {
  test.each([
    [add, 2, 3, 5],
    [add, -5, 2, -3],
    [add, 0, 0, 0],
    [subtract, 10, 4, 6],
    [subtract, 4, 10, -6],
    [subtract, -4, -10, 6],
    [multiply, 45, 2, 90],
    [multiply, -2.5, 4, -10],
    [multiply, 123, 0, 0],
    [divide, 20, 5, 4],
    [divide, -9, 2, -4.5],
    [divide, 0, 5, 0],
  ])('%p(%s, %s) = %s', (operation, a, b, expected) => {
    expect(operation(a, b)).toBe(expected);
  });
});

describe('CLI', () => {
  const calculator = path.join(__dirname, '..', 'calculator.js');
  const run = (...args) => spawnSync(process.execPath, [calculator, ...args], { encoding: 'utf8' });

  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
    [['add', '1e2', '.5'], '100.5'],
  ])('executa %j', (args, expected) => {
    const result = run(...args);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
    expect(result.stderr).toBe('');
  });

  test.each(['0', '-0', '0.0'])('rejeita divisão por %s', (zero) => {
    const result = run('divide', '20', zero);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/divisão por zero/i);
  });

  test.each([
    [[]],
    [['add', '2']],
    [['add', '2', '3', '4']],
    [['pow', '2', '3']],
    [['constructor', '2', '3']],
    [['add', '', '3']],
    [['add', '2x', '3']],
    [['add', '0x10', '3']],
    [['add', 'Infinity', '3']],
    [['add', '1e999', '3']],
  ])('rejeita argumentos inválidos %j', (args) => {
    const result = run(...args);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/Uso:/);
  });

  test('rejeita resultados fora do intervalo suportado', () => {
    const result = run('multiply', '1e308', '2');
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/resultado fora do intervalo/i);
  });
});
