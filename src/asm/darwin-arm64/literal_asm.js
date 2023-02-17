const { Collector } = require('./literal')

function isMathOperator(node) {
	if (node.type === 'AddOperator') return true
	if (node.type === 'SubOperator') return true
	if (node.type === 'MulOperator') return true
	if (node.type === 'DivOperator') return true
	return false
}


function genFunctionDefinition(node, data) {
	let result = ''
	const [stackVar, stackSize] = collectStackVar(node)

	result += `${node.namespace}.${node.name}:\n`
	result += '\tsub sp, sp, #' + stackSize + '\n'
	result += '\tstp x29, x30, [sp, #' + stackSize + ']\n'
	result += '\tadd x29, x29, #' + stackSize + '\n'
	result += genParameters(node.parameters, stackVar)

	for (let i = 0; i < node.body.length; i++) {
		if (node.body[i].type == 'ReturnStatement') {
			result += genReturnStatement(node.body[i], stackVar, data)
		}

		if (node.body[i].type == 'VariableDefinition') {
			result += genVariableDefinition(node.body[i], stackVar, data)
		}
		
		if (node.body[i].type == 'CallStatement') {
			result += genCallStatement(node.body[i], stackVar, data)
		}
	}
	
	result += '\tldp x29, x30, [sp, #' + stackSize + ']\n'
	result += '\tadd sp, sp, #' + stackSize + '\n'
	result += '\tret\n'
	return result
}

function collectStackVar(node) {
	let stackVar = {}
	let stackSize = 0
	for (let i = 0; i < node.parameters.length; i++) {
		stackSize += 8
		stackVar[node.parameters[i].name] = '[x29, #-' + stackSize + ']'
	}

	for (let i = 0; i < node.body.length; i++) {
		if (node.body[i].type == 'VariableDefinition') {
			stackSize += 8
			stackVar[node.body[i].name] = '[x29, #-' + stackSize + ']'
		}
	}

	if (stackSize < 16) {
		stackSize = 16
	}
	return [stackVar, stackSize]
}

function genVariableDefinition(node, stackVar, data) {
	let result = ''
	result += genExpression(node.value, 'x0', stackVar, data)
	result += '\tstr x0, ' + stackVar[node.name] + '\n'
	return result
}

function genCallStatement(node, stackVar) {
	return genCallExpression(node.value, 'x0', stackVar)
}

function genParameters(parameters, stackVar) {
	let result = ''
	for (let i = 0; i < parameters.length; i++) {
		result += '\tstr x' + i + ', ' + stackVar[parameters[i].name] + '\n'
	}
	return result
}

function genReturnStatement(node, stackVar) {
	let result = ''
	result += genExpression(node.value, 'x0', stackVar)
	return result
}

function genCallExpression(node, reg, stackVar) {
	let result = ''

	node.parameters.forEach((param, i) => {
		result += genExpression(param, `x${i}`, stackVar)
	})

	if (node.name == 'syscall3') {
		result += '\tmov x16, x3\n\tsvc #0x80\n'
	} else {
		result += genBranchLink(node)
	}

	result += `\tmov ${reg}, x0\n`
	return result
}

function genBranchLink(node) {
	if (!node.namespace) {
		result += `\tbl ${node.name}\n`
	} else {
		result += `\tbl ${node.namespace}.${node.name}\n`
	}
}

function genMathExpression(node, reg, stackVar) {
	let result = ''
	result += genExpression(node.left, 'x0', stackVar)
	result += genExpression(node.right, 'x1', stackVar)
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

function genLiteral(node, reg, stackVar, data) {
	const dataName = data.find(d => d.value == node.value).name
	const first = '\tadrp ' + reg + ', ' + dataName + '@page\n';
	const second = '\tadd ' + reg + ', ' + reg + ',' + dataName + '@pageoff\n';
	return first + second
}

function genExpression(node, reg, stackVar, data) {
	if (node.type == 'Variable') {
		return '\tldr ' + reg + ', ' + stackVar[node.id] + '\n'
	}
	if (node.type == 'Number') {
		return '\tmov ' + reg + ', #' + node.value + '\n'
	}
	if (isMathOperator(node)) {
		return genMathExpression(node, reg, stackVar)
	}
	if (node.type == 'CallExpression') {
		return genCallExpression(node, reg, stackVar)
	}
	if (node.type == 'Literal') {
		return genLiteral(node, reg, stackVar, data)
	}
	throw new Error('Unknown expression type: ' + node.type)
}


function head() {
	return `.global _main
.align 2
.extern _printf

_main:
	bl main.main
	mov x16, #1
	svc 0x80
`

}

function gen(ast) {
	const collector = new Collector()
	const data = collector.collect(ast)
	let result = ''
	result += head()
	result += genProgram(ast, data)
	result += 'data:\n' + collector.dataToAsm()
	return result
}

function genProgram(node, data) {
	let result = ''
	for (let i = 0; i < node.length; i++) {
		if (node[i].type == 'FunctionDefinition') {
			result += genFunctionDefinition(node[i], data)
		}
	}
	return result
}

module.exports = gen 
