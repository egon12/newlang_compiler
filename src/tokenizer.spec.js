const Tokenizer = require('./tokenizer');

describe('Tokenizer', () => {
	const tokenizer = new Tokenizer();

	it('should tokenize some arithmetic', () => {
		const tokens = tokenizer.parse('10 + 2');
		expect(tokens[0].type).toEqual('number');
		expect(tokens[1].type).toEqual('operator');
		expect(tokens[2].type).toEqual('number');
	})

	it('should tokenize arithmatic without space', () => {
		const tokens = tokenizer.parse('10+2000');
		expect(tokens[0].type).toEqual('number');
		expect(tokens[1].type).toEqual('operator');
		expect(tokens[2].type).toEqual('number');
	})

	it('should tokenize some var definition', () => {
		const tokens = tokenizer.parse('var a = "hello"');
		expect(tokens[0].type).toEqual('keyword');
		expect(tokens[1].type).toEqual('identifier');
		expect(tokens[2].type).toEqual('equal');
		expect(tokens[3].type).toEqual('string');
	})

	it('should tokenize simple function definition', () => {
		const tokens = tokenizer.parse('fn a() { }');
		expect(tokens[0].type).toEqual('keyword');
		expect(tokens[1].type).toEqual('identifier');
		expect(tokens[2].type).toEqual('openParen');
		expect(tokens[3].type).toEqual('closeParen');
		expect(tokens[4].type).toEqual('openBrace');
		expect(tokens[5].type).toEqual('closeBrace');
	})

	it('tokenize string into variable', () => {
		const tokens = tokenizer.parse('var a = "hello"');
		expect(tokens[0].type).toEqual('keyword');
		expect(tokens[1].type).toEqual('identifier');
		expect(tokens[2].type).toEqual('equal');
		expect(tokens[3].type).toEqual('string');
	})
})
