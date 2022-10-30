class Parser {

	parse(tokenList) {
		let result = [];

		if (tokenList.length === 0) {
			return result;
		}


		const token = tokenList.shift();
		if (token.type === 'keyword') {
			if (token.token == 'var') {
				result.push(this.parseVariableDefinition(tokenList))
			}
			if (token.token == 'fn') {
				result.push(this.parseFunctionDefinition(tokenList))
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
		const val = tokenList.shift();

		if (name.type !== 'identifier') {
			throw new Error('Expected identifier');
		}

		if (equal.type !== 'equal') {
			throw new Error('Expected equal sign');
		}


		let value;
		switch (val.type) {
			case 'number':
				value = { type: 'Number', value: val.token };
				break;
			default:
				throw new Error('Invalid value type: ' + val.type);

		}

		const ast = {
			type: 'VariableDefinition',
			name: name.token,
			value,
		};
		return ast;
	}

}

module.exports = Parser;
