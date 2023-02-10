const Tokenizer = require('./tokenizer');
const Parser = require('./parser');
const ArithmeticInterpreter = require('./arithmetic_interpreter');

const intepreter = new ArithmeticInterpreter();

function convertToAST(input) {
	const tokenizer = new Tokenizer();
	const tokenList = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokenList);
	return ast;
}

it('should parse a simple expression', () => {
	const input = 'var a = 10 + 1;';
	const ast = convertToAST(input);
	expect(ast).toEqual([{
		type: 'VariableDefinition',
		name: 'a',
		value: { 
			type: 'AddOperator', 
			left: { type: 'Number', value: 10 },
			right: { type: 'Number', value: 1 }
		},
	}]);
	expect(intepreter.visit(ast[0].value)).toEqual(11);
});

it('should parse two operator', () => {
	const input = 'var a = 10 + 1 + 3;';
	const ast = convertToAST(input);
	expect(ast).toEqual([{
		type: 'VariableDefinition',
		name: 'a',
		value: { 
			type: 'AddOperator', 
			left: {
				type: 'AddOperator',
				left: { type: 'Number', value: 10 },
				right: { type: 'Number', value: 1 },
			},
			right: { type: 'Number', value: 3 }
		},
	}]);
	expect(intepreter.visit(ast[0].value)).toEqual(14);
});


it('should parse minus operator', () => {
	const input = 'var a = 10 - 1 - 3;';
	const ast = convertToAST(input);
	expect(ast).toEqual([{
		type: 'VariableDefinition',
		name: 'a',
		value: { 
			type: 'SubOperator', 
			left: {
				type: 'SubOperator',
				left: { type: 'Number', value: 10 },
				right: { type: 'Number', value: 1 }
			},
			right: { type: 'Number', value: 3 }
		},
	}]);
	expect(intepreter.visit(ast[0].value)).toEqual(6);
});

it('should parse plus and minus operator', () => {
	const input = 'var a = 400 + 30 - 62 - 75 + 30;';
	const ast = convertToAST(input);
	expect(intepreter.visit(ast[0].value)).toEqual(323);
});


it('should parse multiplication and division operator', () => {
	const input = 'var a = 100 + 3 * 10 + 9 / 3;';
	const ast = convertToAST(input);
	expect(intepreter.visit(ast[0].value)).toEqual(133);
});


it('should parse a simple with variable', () => {
	const input = 'var a = 10 + somevar;';
	const ast = convertToAST(input);
	expect(ast).toEqual([{
		type: 'VariableDefinition',
		name: 'a',
		value: { 
			type: 'AddOperator', 
			left: { type: 'Number', value: 10 },
			right: { type: 'Identifier', value: "somevar" }
		},
	}]);
});
