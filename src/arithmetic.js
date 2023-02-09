class ArithmaticParser {

	parse(tokens) {
		return realParse(tokens)
	}


}

function realParse(tokens) {
	if (tokens.length === 0) {
		throw new Error("arithmetic not correct")
	}

	if (tokens.length === 1) {
		const token = tokens[0]
		switch(token.type) {
			case 'number':
				// TODO check for NaN from parseInt
				return { type: 'Number', value: parseInt(token.token) }
			case 'identifier':
				return { type: 'Identifier', value: token.token }
			default:
				//return token
				throw new Error("Unexpected ", token)
		}
	}

	for (let i=tokens.length-1; i>=0; i--) {
		const token = tokens[i]

		if (token.type === 'operator') {
			if (token.token === "-") {
				return generateOpNode("SubOperator", tokens, i)
			}
			if (token.token === "+") {
				return generateOpNode("AddOperator", tokens, i)
			}
		}
	}


	for (let i=tokens.length-1; i>=0; i--) {
		const token = tokens[i]

		if (token.type === 'operator') {
			if (token.token === "*") {
				return generateOpNode("MulOperator", tokens, i)
			}
			if (token.token === "/") {
				return generateOpNode("DivOperator", tokens, i)
			}
		}
	}
}

function generateOpNode(type, tokens, index) {
	const left = realParse(tokens.splice(0, index))
	const right = realParse(tokens.splice(1, tokens.length))
	return { type, left, right }
}

module.exports = ArithmaticParser
