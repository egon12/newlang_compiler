const Token = require('./token_utils')
const ArithmeticParser = require('./arithmetic')

class ExpressionParser {

	constructor() {
		this.arithmetic = new ArithmeticParser()
	}

	parse(tokens) {
		if (tokens.length === 0) {
			throw new Error('Expected expression got empty tokens');
		}

		if (tokens.length === 1) {
			return this.parseSingleExpressionToken(tokens[0]);
		}

		if (this.hasOperator(tokens)) {
			return this.arithmetic.parse(tokens)
		}

		if (this.isCallExpression(tokens)) {
			return this.parseCallExpression(tokens);
		}

		throw new Error('Invalid expression');
	}

	parseSingleExpressionToken(token) {
		if (token.type === 'number') {
			return  { type: 'Number', value: token.token };
		}

		if (token.type === 'identifier') {
			return  { type: 'Variable', id: token.token };
		}

		// TODO
		// Literal (string)

		throw new Error('Invalid type for single token in expression: ' + val.type);
	}

	hasOperator(tokens) {
		for (let i = 0; i<tokens.length; i++) {
			if (tokens[i].type == 'operator') {
				return true
			}
		}
		return false
	}

	isCallExpression(tokens) {
		if (tokens < 3) return false
		if (tokens[0].type !== 'identifier') return false
		if (tokens[1].type !== 'openParen') return false
		//if (tokens[tokens.length - 1].type !== 'closeParen') return false
		return true
	}

	parseCallExpression(tokens) {
		const name = tokens.shift().token;
		const openParen = tokens.shift();
		const rawArgs = Token.splice(tokens, 'closeParen');
		const closeParen = tokens.shift();

		const parameters = Token
			.split(rawArgs, 'comma')
			.map(arg => this.parse(arg));

		let namespace = 'main'
		if (['printint', 'println'].indexOf(name) > -1) {
			namespace = ''
		}

		return {
			type: 'CallExpression',
			namespace,
			name,
			parameters
		}
	}
}

module.exports = ExpressionParser
