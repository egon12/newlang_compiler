const Token = require('./token_utils')
const ExpressionParser = require('./expression')

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
			throw new Error(`Expect "{" or ":" got ${braceOrReturnType.type} (${braceOrReturnType.token}) at: ${braceOrReturnType.pos}`);
		}

		if (openBrace.type !== 'openBrace') {
			throw new Error(`Expect "{" got ${openBrace.type} (${openBrace.token}) at: ${openBrace.pos}`);
		}

		const body = this.parseBodyFunction(tokens);

		const parameters = Token
			.split(rawParams, 'comma')
			.map(arg => this.parseFunctionParam(arg));

		if (name.type !== 'identifier') {
			throw new Error('Expected identifier');
		}

		if (openParen.type !== 'openParen') {
			throw new Error('Expected open paren');
		}

		if (closeParen.type !== 'closeParen') {
			throw new Error('Expected close paren');
		}

		return {
			type: 'FunctionDefinition',
			namespace: 'main',
			name: name.token,
			parameters,
			body,
			return: returnType,
		}
	}

	parseFunctionParam(tokens) {
		const name = tokens.shift();
		if (name.type !== 'identifier') {
			throw new Error('Expected identifier');
		}
		const colon = tokens.shift();
		if (colon.type !== 'colon') {
			throw new Error('Expected colon');
		}
		const type = tokens.shift();
		if (type.type !== 'identifier') {
			throw new Error('Expected identifier');
		}

		const thetype = {
			name: type.token,
		}

		if (type.token == 'int') {
			thetype.type = 'BuiltInType'
		}

		return {
			name: name.token,
			type: thetype,
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
			if (this.isCallStatement(next, tokenList[0])) {
				result.push(this.parseCallStatement(next, tokenList))
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

		const value = this.expr.parse(tokenList.splice(0, lastIndex))

		const ast = {
			type: 'VariableDefinition',
			name: name.token,
			value,
		};

		// get the semicolon
		tokenList.shift()
		return ast;
	}

	isCallStatement(token, nextToken) {
		if (token.type !== 'identifier') {
			return false;
		}
		if (nextToken.type !== 'openParen') {
			return false;
		}
		return true;
	}

	parseCallStatement(first, tokens) {
		const openParen = tokens.shift();
		const args = Token.splice(tokens, 'closeParen');
		const closeParen = tokens.shift();

		args.unshift(openParen);
		args.unshift(first);
		args.push(closeParen);

		return {
			type: 'CallStatement',
			value: this.expr.parse(args),
		}
	}
}


module.exports = Parser;
