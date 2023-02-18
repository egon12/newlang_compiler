const { Collector } = require('./literal')

class Generator {
	// #collector is collector that will collect
	// literal data from ast
	#collector = new Collector()

	// global literal data are string that length is 
	// known at compile time
	#literalData = []

	// #stackVar is variable that declared in function
	#stackVar = {} 

	#fastReturn = false

	#inFunction = ''

	#numIfStatement = 1

	constructor() {
		this.globalVar = []
		this.#literalData = []
	}

	generate(ast) {
		this.#literalData = this.#collector.collect(ast)
		let result = ''
		result += head();
		result += this.#genCode(ast);
		result += 'data:\n' + this.#collector.dataToAsm();
		return result
	}


	#genCode(node) {
		let result = ''
		for (let i = 0; i < node.length; i++) {
			if (node[i].type == 'FunctionDefinition') {
				result += this.#genStackFunction(node[i])
			}
		}
		return result
	}

	#genStackFunction(node) {
		const data = this.#literalData
		let result = ''

		// this will fill thss.#stackVar
		const stackSize = this.#collectStackVar(node)

		this.#fastReturn = false
		this.#inFunction = node
		this.#numIfStatement = 1

		result += `${node.namespace}.${node.name}:\n`
		result += '\tsub sp, sp, #' + stackSize + '\n'
		result += '\tstp x29, x30, [sp, #' + stackSize + ']\n'
		result += '\tadd x29, x29, #' + stackSize + '\n'
		result += this.#genParameters(node.parameters)

		for (let i = 0; i < node.body.length; i++) {
			const isLast = i == node.body.length - 1;
			result += this.#genStatement(node.body[i], isLast)
		}

		if (this.#fastReturn) {
			result += `${node.namespace}.${node.name}.return:\n`
		}

		result += '\tldp x29, x30, [sp, #' + stackSize + ']\n'
		result += '\tadd sp, sp, #' + stackSize + '\n'
		result += '\tret\n'
		return result
	}

	#genStatement(node, isLast) {
		if (node.type == 'ReturnStatement') {
			return this.#genReturnStatement(node, isLast)
		}

		if (node.type == 'VariableDefinition') {
			return this.#genVariableDefinition(node)
		}

		if (node.type == 'CallStatement') {
			return this.#genCallStatement(node)
		}

		if (node.type == 'IfStatement') {
			return this.#genIfStatement(node)
		}
		throw new Error('Unknown statement type: ' + node.type)
	}


	#genReturnStatement(node, isLast) {
		if (isLast) {
			return this.#genExpression(node.value, 'x0')
		}

		this.#fastReturn = true
		let result = ''
		result += this.#genExpression(node.value, 'x0')
		result += '\tb ' + this.#inFunction.namespace + '.' + this.#inFunction.name + '.return\n'
		return result
	}

	#genVariableDefinition(node) {
		let result = ''
		result += this.#genExpression(node.value, 'x0')
		result += '\tstr x0, ' + this.#stackVar[node.name] + '\n'
		return result
	}

	#genCallStatement(node) {
		return this.#genCallExpression(node.value, 'x0')
	}

	#genIfStatement(node) {
		let trueBody = ''
		for (let i = 0; i < node.body.length; i++) {
			// so we don't change return statment in another spec
			trueBody += this.#genStatement(node.body[i], false)
		}
		//const trueLabel = this.#genLabel(node)
		const { trueLabel, elseLabel }  = this.#genIfLabels()

		// TODO remove this assignment
		node = node.condition

		let result = ''
		result += this.#genExpression(node.left, 'x0')
		result += this.#genExpression(node.right, 'x1')

		if (node.operator == '==') {
			result += '\tcmp x0, x1\n'
			result += '\tbeq ' + trueLabel + '\n'
		} else if (node.operator == '!=') {
			result += '\tcmp x0, x1\n'
			result += '\tbne ' + trueLabel + '\n'
		} else if (node.operator == '<') {
			result += '\tcmp x0, x1\n'
			result += '\tblt ' + trueLabel + '\n'
		} else if (node.operator == '>') {
			result += '\tcmp x0, x1\n'
			result += '\tbgt ' + trueLabel + '\n'
		} else if (node.operator == '<=') {
			result += '\tcmp x0, x1\n'
			result += '\tble ' + trueLabel + '\n'
		} else if (node.operator == '>=') {
			result += '\tcmp x0, x1\n'
			result += '\tbge ' + trueLabel + '\n'
		} else {
			throw new Error('Unknown operator: ' + node.operator)
		}

		result += '\tb ' + elseLabel + '\n'
		result += trueLabel + ':\n'
		result += trueBody
		//result += '\tb ' + elseLabel + '\n'
		result += elseLabel + ':\n'
		return result
	}	

	#genIfLabels() {
		const { namespace, name } = this.#inFunction
		const num = this.#numIfStatement
		const trueLabel = namespace + '.' + name + '.if' + num + '.true'
		this.#numIfStatement++
		const elseLabel = namespace + '.' + name + '.if' + num + '.else'
		return { trueLabel, elseLabel }
	}

	#genExpression(node, reg) {
		const { type, value, id } = node
		if (type == 'Variable') {
			const sv = this.#stackVar[id];
			if (sv == undefined) {
				throw new Error('Unknown variable: ' + id)
			}
			return `\tldr ${reg}, ${sv}\n`
		}
		if (type == 'Number') {
			return `\tmov ${reg}, #${value}\n`
		}
		if (this.#isMathOperator(type)) {
			return this.#genMathExpression(node, reg)
		}
		if (type == 'CallExpression') {
			return this.#genCallExpression(node, reg)
		}
		if (type == 'Literal') {
			return this.#genLiteral(value, reg)
		}
		throw new Error('Unknown expression type: ' + node.type)
	}

	#genParameters(parameters) {
		let result = ''
		for (let i = 0; i < parameters.length; i++) {
			result += '\tstr x' + i + ', ' + this.#stackVar[parameters[i].name] + '\n'
		}
		return result
	}

	#genLiteral(value, reg) {
		const dataName = this.#literalData.find(d => d.value == value).name
		const first = '\tadrp ' + reg + ', ' + dataName + '@page\n';
		const second = '\tadd ' + reg + ', ' + reg + ',' + dataName + '@pageoff\n';
		return first + second
	}

	#genMathExpression(node, reg) {
		let result = ''
		result += this.#genExpression(node.left, 'x0')
		result += this.#genExpression(node.right, 'x1')
		if (node.type == 'AddOperator') {
			result += '\tadd x0, x0, x1\n'
		}
		if (node.type == 'SubOperator') {
			result += '\tsub x0, x0, x1\n'
		}
		if (node.type == 'MulOperator') {
			result += `\tmul ${reg}, x0, x1\n`
		}
		return result
	}

	#genCallExpression(node, reg) {
		let result = ''

		node.parameters.forEach((param, i) => {
			result += this.#genExpression(param, `x${i}`)
		})

		if (node.name == 'syscall3') {
			result += '\tmov x16, x3\n\tsvc #0x80\n'
		} else {
			result += this.#genBranchLink(node)
		}

		result += `\tmov ${reg}, x0\n`
		return result
	}

	#isMathOperator(type) {
		if (type === 'AddOperator') return true
		if (type === 'SubOperator') return true
		if (type === 'MulOperator') return true
		if (type === 'DivOperator') return true
		return false
	}

	#genBranchLink(node) {
		let result = ''
		if (!node.namespace) {
			result += `\tbl ${node.name}\n`
		} else {
			result += `\tbl ${node.namespace}.${node.name}\n`
		}
		return result;
	}

	#collectStackVar(node) {
		let stackSize = 0
		this.#stackVar = {}
		for (let i = 0; i < node.parameters.length; i++) {
			stackSize += 8
			this.#stackVar[node.parameters[i].name] = '[x29, #-' + stackSize + ']'
		}

		for (let i = 0; i < node.body.length; i++) {
			if (node.body[i].type == 'VariableDefinition') {
				stackSize += 8
				this.#stackVar[node.body[i].name] = '[x29, #-' + stackSize + ']'
			}
		}

		if (stackSize < 16) {
			stackSize = 16
		}
		return stackSize
	}

}

function head() {
	return `.global _main
.align 2

_main:
	bl main.main
	mov x16, #1
	svc 0x80
`
}

module.exports = {
	Generator,
}
