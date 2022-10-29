const Tokenizer = require('./tokenizer');

it('parse some arithmatic', () => {
  const tokenizer = new Tokenizer();
  const tokenList = tokenizer.parse('1 + 2');
  expect(tokenList[0].type).toEqual('number');
  expect(tokenList[1].type).toEqual('operator');
  expect(tokenList[2].type).toEqual('number');
})

it('parse some var definition', () => {
  const tokenizer = new Tokenizer();
  const tokenList = tokenizer.parse('var a = "hello"');
  expect(tokenList[0].type).toEqual('keyword');
  expect(tokenList[1].type).toEqual('identifier');
  expect(tokenList[2].type).toEqual('operator');
  expect(tokenList[3].type).toEqual('string');
})

