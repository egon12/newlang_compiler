




function translateValue(ast, gen) {
	if (ast.type === "Number") {
		return gen.ldrToTemp(ast.value)
		return
	}

	if (ast.type === "AddOperator") {
		const t1 = translateValue(ast.left, gen)
		const t2 = translateValue(ast.right, gen)
		return gen.add(t1, t2)
	}

	if (ast.type === "MulOperator") {
		const t1 = translateValue(ast.left, gen)
		const t2 = translateValue(ast.right, gen)
		return gen.mul(t1, t2)
	}

	if (ast.type === "Literal") {
		return ast.value
	} else if (ast.type === "Identifier") {
		return ast.name
	} else if (ast.type === "CallExpression") {
		return translateCall(ast)
	} else {
		throw new Error("Unknown type: " + ast.type)
	}

}

function translateFunctionBody(ast, gen) {
	for (let i = 0; i < ast.length; i++) {
		const stmt = ast[i]
		if (stmt.type === "VariableDefinition") {
			translateVariableDefinition(stmt, gen)
		} else if (stmt.type === "ExpressionStatement") {
			translateExpressionStatement(stmt, gen)
		} else {
			throw new Error("Unknown type: " + stmt.type)
		}

	}
}

function translateVariableDefinition(ast, gen) {
	translateValue(ast.value, gen)
	gen.storeLastTempTo(ast.name)
	//throw new Error("error " + ast.type)

}

class Generator {

	constructor() {
		this.code = []
		this.lastTempIndex = 1;
	}

	emit(op, arg1, arg2, result) {
		this.code.push({op, arg1, arg2, result})
	}

	storeToTemp(arg1) {
		const result = "t" + this.lastTempIndex
		this.code.push({op: str, arg1, arg2:"", result})
		this.lastTempIndex++
	}

	storeLastTempTo(result) {
		const arg1 = "t" + (this.lastTempIndex - 1)
		this.code.push({op: 'str', arg1, arg2:"", result})
	}

	storeTo(arg1, result) {
		this.code.push({op: 'str', arg1, arg2:"", result})
	}

	add(arg1, arg2) {
		const result = "t" + this.lastTempIndex
		this.code.push({op: 'add', arg1, arg2, result})
		this.lastTempIndex++
		return result
	}

	mul(arg1, arg2) {
		const result = "t" + this.lastTempIndex
		this.code.push({op: 'mul', arg1, arg2, result})
		this.lastTempIndex++
		return result
	}


	ldrToTemp(arg1) {
		const result = "t" + this.lastTempIndex
		this.code.push({op: 'ldr', arg1, arg2:"", result})
		this.lastTempIndex++
		return result
	}


	get lastResult() {
		return this.code[this.code.length - 1].result
	}
}


module.exports = function (ast) {
	if (ast.type === "FunctionDefinition") {

		const gen = new Generator()
		
		translateFunctionBody(ast.body, gen)

		return {
			statements: gen.code,
		}
	}

	return "hallo"
}

