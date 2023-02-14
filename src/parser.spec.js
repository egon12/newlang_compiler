const Tokenizer = require('./tokenizer');
const Parser = require('./parser');

it('should parse a simple expression', () => {
	const input = 'var a = 10;';
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
		],
		return: 'int'
	}]);
})


it('should parse function with new line', () => {
	//TODO try to make this work. It's not working because the tokenizer is not
	//working with new lines.
	//const input = 'fn main(): int {\n\tvar a = 10\n}';
	const input = 'fn main(): int {\n\tvar a = 10;\n}';
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
		],
		return: 'int'
	}]);
})

it('should parse multiple function', () => {

	const input = `
fn main(): int {
	return 1;
}

fn countA(): int {
	return 5;
}

fn countB(): int {
	return 10;
}
	`;
	const tokenizer = new Tokenizer();
	const tokens = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokens);


	expect(ast).toEqual([
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'main',
			parameters: [],
			return: 'int',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Number', value: "1" },
				}
			]
		},
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'countA',
			parameters: [],
			return: 'int',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Number', value: "5" },
				}
			]
		},
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'countB',
			parameters: [],
			return: 'int',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Number', value: "10" },
				}
			]
		},
	]);
})

it('should parse multiple function with some void function', () => {

	const input = `
fn main() {
	return 1;
}

fn countA(): int {
	return 5;
}

fn countB(): int {
	return 10;
}
	`;
	const tokenizer = new Tokenizer();
	const tokens = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokens);


	expect(ast).toEqual([
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'main',
			parameters: [],
			return: '',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Number', value: "1" },
				}
			]
		},
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'countA',
			parameters: [],
			return: 'int',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Number', value: "5" },
				}
			]
		},
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'countB',
			parameters: [],
			return: 'int',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Number', value: "10" },
				}
			]
		},
	]);
})

it('should parse function with parameters', () => {

	const input = `
fn countA(a: int, b: int): int {
	return a;
}
	`;
	const tokenizer = new Tokenizer();
	const tokens = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokens);


	expect(ast).toEqual([
		{
			type: 'FunctionDefinition',
			namespace: 'main',
			name: 'countA',
			parameters: [
				{ name: 'a', type: { type: 'BuiltInType', name: 'int' } },
				{ name: 'b', type: { type: 'BuiltInType', name: 'int' } },
			],
			return: 'int',
			body: [
				{
					type: 'ReturnStatement',
					value: { type: 'Variable', id: "a" },
				}
			]
		},
	]);
})


it('should parse callStatement', () => {
	const input = 'var a = countA(30, d)';
	const tokenizer = new Tokenizer();
	const tokenList = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokenList);
	expect(ast).toEqual([{
		type: 'VariableDefinition',
		name: 'a',
		value: { 
			type: 'CallExpression', 
			name: "countA",
			parameters: [
				{ type: 'Number', value: '30' },
				{ type: 'Variable', id: 'd' }
			]
		},
	}]);
})
