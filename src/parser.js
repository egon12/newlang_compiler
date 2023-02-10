const ArithmaticParser = require('./arithmetic')
const Token = require('./token_utils')

const arithmaticParser = new ArithmaticParser()

class Parser {

	parse(tokens) {
		let result = [];

		if (tokens.length === 0) {
			return result;
		}

		const token = tokens.shift();
		if (token.type === 'keyword') {
			if (token.token == 'var') {
				result.push(this.parseVariableDefinition(tokens))
			}
			if (token.token == 'fn') {
				result.push(this.parseFunctionDefinition(tokens))
			}
		}
		return result;
	}

	parseFunctionDefinition(tokenList) {
		const name = tokenList.shift();
		const openParen = tokenList.shift();
		const closeParen = tokenList.shift();
		const openBrace = tokenList.shift();
		const body = this.parseBodyFunction(tokenList);
		const closeBrace = tokenList.shift();

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
			namespace: "main",
			name: name.token,
			parameters: [],
			body: body,
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
			}
		}
		return result

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
			value = this.parseExpression(tokenList.splice(0, lastIndex))
		}

		const ast = {
			type: 'VariableDefinition',
			name: name.token,
			value,
		};
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

	parseCallExpression(tokens) {
		const name = tokens.shift().token;
		const openParen = tokens.shift();
		const rawArgs = Token.splice(tokens, 'closeParen');
		const closeParen = tokens.shift();

		const parameters = Token
			.split(rawArgs, 'comma')
			.map(arg => this.parseExpression(arg));

		return {
			type: 'CallExpression',
			name,
			parameters
		}
	}

	parseExpression(tokens) {
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
			return  { type: 'Variable', value: token.token };
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



	spliceUntilType(tokens, type) {
		for (let i=0; i<tokens.length; i++) {
			if (tokens[i].type === type) {
				return tokens.splice(0, i)
			}
		}
		throw new Error(`expect to find ${type} but go nothing`)
	}

	parseStatement(tokens) {

	}

}

module.exports = Parser;
