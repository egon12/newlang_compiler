const Tokenizer = require('../tokenizer');
const Parser = require('../parser');
const ArithmeticInterpreter = require('../arithmetic_interpreter');
const gen = require('../asm/darwin-arm64/asm')
const fs = require('fs')

const intepreter = new ArithmeticInterpreter();

function compile(filename) {
	const input = fs.readFileSync(filename).toString()
	const tokenizer = new Tokenizer();
	const tokenList = tokenizer.parse(input);
	const parser = new Parser();
	const ast = parser.parse(tokenList);
	const asm = gen(ast)

	fs.writeFileSync('source.asm', asm)
	fs.writeFileSync('source_ast.json', JSON.stringify(ast, null, 2))
}

compile('source.eg')


