const Tokenizer = require('./tokenizer');
const Parser = require('./parser');

it('should parse a simple expression', () => {
	const input = 'var a = 10';
	const tokenizer = new Tokenizer();
	const tokenList = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokenList);
	expect(ast).toEqual([{
		type: 'VariableDefinition',
		name: 'a',
		value: { type: 'Number', value: "10" },
	}]);
});

it('should parse function definition', () => {
	const input = 'fn main(): int { var a = 10; }';
	const tokenizer = new Tokenizer();
	const tokenList = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokenList);
	expect(ast).toEqual([{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'main',
		parameters: [],
		body: [
			{
				type: 'VariableDefinition',
				name: 'a',
				value: { type: 'Number', value: "10" },
			}
		]
	}]);
})


it('should parse function with new line', () => {
	const input = 'fn main(): int {\n\tvar a = 10\n}';
	const tokenizer = new Tokenizer();
	const tokenList = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokenList);
	expect(ast).toEqual([{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'main',
		parameters: [],
		body: [
			{
				type: 'VariableDefinition',
				name: 'a',
				value: { type: 'Number', value: "10" },
			}
		]
	}]);
})
