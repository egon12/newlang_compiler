const Tokenizer = require('./tokenizer');

it('parse some arithmatic', () => {
  const tokenizer = new Tokenizer();
  const tokenList = tokenizer.parse('10 + 2');
  expect(tokenList[0].type).toEqual('number');
  expect(tokenList[1].type).toEqual('operator');
  expect(tokenList[2].type).toEqual('number');
})

it('parse some var definition', () => {
  const tokenizer = new Tokenizer();
  const tokenList = tokenizer.parse('var a = "hello"');
  expect(tokenList[0].type).toEqual('keyword');
  expect(tokenList[1].type).toEqual('identifier');
  expect(tokenList[2].type).toEqual('equal');
  expect(tokenList[3].type).toEqual('string');
})


it('tokenize simple function definition', () => {
  const tokenizer = new Tokenizer();
  const tokenList = tokenizer.parse('fn a() { }');
  expect(tokenList[0].type).toEqual('keyword');
  expect(tokenList[1].type).toEqual('identifier');
  expect(tokenList[2].type).toEqual('openParen');
  expect(tokenList[3].type).toEqual('closeParen');
  expect(tokenList[4].type).toEqual('openBrace');
  expect(tokenList[5].type).toEqual('closeBrace');
})
