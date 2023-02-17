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

		result += `${node.namespace}.${node.name}:\n`
		result += '\tsub sp, sp, #' + stackSize + '\n'
		result += '\tstp x29, x30, [sp, #' + stackSize + ']\n'
		result += '\tadd x29, x29, #' + stackSize + '\n'
		result += this.#genParameters(node.parameters)

		for (let i = 0; i < node.body.length; i++) {
			if (node.body[i].type == 'ReturnStatement') {
				result += this.#genReturnStatement(node.body[i])
			}

			if (node.body[i].type == 'VariableDefinition') {
				result += this.#genVariableDefinition(node.body[i])
			}

			if (node.body[i].type == 'CallStatement') {
				result += this.#genCallStatement(node.body[i])
			}
		}

		result += '\tldp x29, x30, [sp, #' + stackSize + ']\n'
		result += '\tadd sp, sp, #' + stackSize + '\n'
		result += '\tret\n'
		return result
	}

	#collectStackVar(node) {
		let stackSize = 0
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

	#genReturnStatement(node) {
		let result = ''
		result += this.#genExpression(node.value, 'x0')
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

	#genExpression(node, reg) {
		const { type, value, id } = node
		if (type == 'Variable') {
			const sv = this.#stackVar[id];
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
