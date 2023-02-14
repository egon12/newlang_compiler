const ArithmaticParser = require('./arithmetic')
const Token = require('./token_utils')

const arithmaticParser = new ArithmaticParser()

class Parser {

	constructor() {
		this.expr = new ExpressionParser()
	}

	parse(tokens) {
		let result = [];

		if (tokens.length === 0) {
			return result;
		}

		while (tokens.length > 0) {
			const token = tokens.shift();
			if (token.type === 'keyword') {
				if (token.token == 'var') {
					result.push(this.parseVariableDefinition(tokens))
				}
				if (token.token == 'fn') {
					result.push(this.parseFunctionDefinition(tokens))
				}
			} else {
				throw new Error(`Unexpected token ${token.type} (${token.token}) at ${token.pos}`);
			}
		}
		return result;
	}

	parseFunctionDefinition(tokens) {
		const name = tokens.shift();
		const openParen = tokens.shift();
		const rawParams = Token.splice(tokens, 'closeParen');
		const closeParen = tokens.shift();

		const braceOrReturnType = tokens.shift();

		let returnType = ''
		let openBrace = null
		if (braceOrReturnType.type == 'colon') {
			const retType = tokens.shift()
			returnType = retType.token
			openBrace = tokens.shift();
		} else if (braceOrReturnType.type == 'openBrace') {
			openBrace = braceOrReturnType
		} else {
			throw new Error(`Expect { or : got ${braceOrReturnType.type} (${braceOrReturnType.token}) at: ${braceOrReturnType.pos}`);
		}

		if (openBrace.type !== 'openBrace') {
			throw new Error(`Expect openBrace got ${openBrace.type} (${openBrace.token}) at: ${openBrace.pos}`);
		}

		const body = this.parseBodyFunction(tokens);
		//const closeBrace = tokens.shift();

		const parameters = Token
			.split(rawParams, 'comma')
			.map(arg => this.expr.parse(arg));

		if (name.type !== 'identifier') {
			throw new Error('Expected identifier');
		}

		if (openParen.type !== 'openParen') {
			throw new Error('Expected open paren');
		}

		if (closeParen.type !== 'closeParen') {
			throw new Error('Expected close paren');
		}

		//if (closeBrace.type !== 'closeBrace') {
			//throw new Error(`Expected closeBrace got ${closeBrace.type} (${closeBrace.token}) at ${closeBrace.pos}`);
		//}
		return {
			type: 'FunctionDefinition',
			namespace: "main",
			name: name.token,
			parameters,
			body,
			return: returnType,
		}
	}

	parseBodyFunction(tokenList) {
		let result = [];

		while(tokenList.length > 0) {
			let next = tokenList.shift();
			if (next.type === 'closeBrace') {
				return result;
			}

			if (next.type === 'keyword') {
				if (next.token === 'var') {
					result.push(this.parseVariableDefinition(tokenList))
				}

				if (next.token === 'return') {
					result.push(this.parseReturnStatement(tokenList))
				}
			}
		}
		return result

	}

	parseReturnStatement(tokenList) {
		const expr = Token.splice(tokenList, 'semicolon');
		const semicolon = tokenList.shift();

		const ast = {
			type: 'ReturnStatement',
			value: this.expr.parse(expr),
		};
		return ast;
	}

	parseVariableDefinition(tokenList) {
		const name = tokenList.shift();
		const equal = tokenList.shift();

		if (name.type !== 'identifier') {
			throw new Error('Expected identifier');
		}

		if (equal.type !== 'equal') {
			throw new Error('Expected equal sign');
		}

		if (tokenList.length == 0) {
			throw new Error('Expected value after =');
		}

		// get token until 
		let index = 0;
		let lastIndex = 0;
		while(true) {
			if (index >= tokenList.length || 
				tokenList[index].type === 'semicolon' || 
				tokenList[index].type === '\n'
			) {
				lastIndex = index;
				break;
			}
			index++
		}

		let useOperator = false;
		for (let i = 0; i<lastIndex; i++) {
			const tok = tokenList[i];
			if (tok.type == 'operator') {
				useOperator = true;
				break;
			}
		}

		let value;
		if (useOperator) {
			value = arithmaticParser.parse(tokenList.splice(0, lastIndex))
		} else {
			value = this.expr.parse(tokenList.splice(0, lastIndex))
		}

		const ast = {
			type: 'VariableDefinition',
			name: name.token,
			value,
		};

		// get the semicolon
		tokenList.shift()
		return ast;
	}

	parseCallStatement(first, tokens) {
		const openParen = tokens.shift();
		const args = Token.splice(tokens, 'closeParen');
		const closeParen = tokens.shift();


		let parameters = Token.split(args, 'comma')
			//.map(arg => arg.token);

		parameters = parameters.map(expr => this.parseExpression(expr));

		return {
			type: 'CallExpression',
			name: first.token,
			parameters
		}
	}


	parseStatement(tokens) {

	}

}

class ExpressionParser {

	parse(tokens) {
		if (tokens.length === 0) {
			throw new Error('Expected expression got empty tokens');
		}

		if (tokens.length === 1) {
			return this.parseSingleExpressionToken(tokens[0]);
		}

		if (this.isCallExpression(tokens)) {
			return this.parseCallExpression(tokens);
		}
		return tokens[1].token
	}

	parseSingleExpressionToken(token) {
		if (token.type === 'number') {
			return  { type: 'Number', value: token.token };
		}

		if (token.type === 'identifier') {
			return  { type: 'Variable', id: token.token };
		}

		throw new Error('Invalid type for single token in expression: ' + val.type);
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

		return {
			type: 'CallExpression',
			name,
			parameters
		}
	}
}

module.exports = Parser;
