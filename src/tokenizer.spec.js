const Tokenizer = require('./tokenizer');

describe('Tokenizer', () => {
	const tokenizer = new Tokenizer();

	it('should tokenize some arithmetic', () => {
		const tokens = tokenizer.parse('10 + 2');
		expect(allTypes(tokens)).toEqual(['number', 'operator', 'number']);
		expect(allTokens(tokens)).toEqual(['10', '+', '2']);
	})

	it('should tokenize arithmatic without space', () => {
		const tokens = tokenizer.parse('10+2000');
		expect(allTypes(tokens)).toEqual(['number', 'operator', 'number']);
		expect(allTokens(tokens)).toEqual(['10', '+', '2000']);
	})

	it('should tokenize some var definition', () => {
		const tokens = tokenizer.parse('var a = "hello"');
		expect(allTokens(tokens)).toEqual(['var', 'a', '=', '"hello"']);
		expect(allTypes(tokens)).toEqual(['keyword', 'identifier', 'equal', 'string']);
	})

	it('should tokenize some var definition without space', () => {
		const tokens = tokenizer.parse('var a="hello world"');
		expect(allTokens(tokens)).toEqual(['var', 'a', '=', '"hello world"']);
		expect(allTypes(tokens)).toEqual(['keyword', 'identifier', 'equal', 'string']);
	})

	it('should tokenize simple function definition', () => {
		const tokens = tokenizer.parse('fn a() { }');
		expect(allTokens(tokens)).toEqual(['fn', 'a', '(', ')', '{', '}']);
		expect(allTypes(tokens)).toEqual(['keyword', 'identifier', 'openParen', 'closeParen', 'openBrace', 'closeBrace']);
	})

	const allTypes = tokens => tokens.map(token => token.type);
	const allTokens = tokens => tokens.map(token => token.token);
})
