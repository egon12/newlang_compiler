let node = [
	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'main',
		parameters: [],
		body: [
			{
				type: 'VariableDefinition',
				name: 'a',
				value: {
					type: 'CallExpression',
					namespace: 'main',
					name: 'plusOne',
					parameters: [
						{ type: 'Number', value: 4 },
					],
				}
			},
			{
				type: 'CallStatement',
				value: {
					type: 'CallExpression',
					namespace: '',
					name: 'printint', // using stdio
					parameters: [
						{ type: 'Variable', id: 'a' },
					],
				}
			},
			{
				type: 'CallStatement',
				value: {
					type: 'CallExpression',
					namespace: '',
					name: 'println', // using stdio
					parameters: [],
				}
			},
			{
				type: 'ReturnStatement',
				value: {
					type: 'Number',
					value: 0,
				}
			}
		]
	},

	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'plusOne',
		parameters: [
			{ name: 'x', typeName: { type: 'BuiltInType', name: 'int' } },
		],
		body: [
			{
				type: 'ReturnStatement',
				value: {
					type: 'MathExpression',
					operator: '+',
					left: { type: 'Number', value: 1 },
					right: { type: 'Variable', id: 'x' },
				}
			}
		]
	},
	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'add',
		parameters: [
			{ name: 'a', typeName: { type: 'BuiltInType', name: 'int' } },
			{ name: 'b', typeName: { type: 'BuiltInType', name: 'int' } },
		],
		body: [
			{
				type: 'ReturnStatement',
				value: {
					type: 'MathExpression',
					operator: '+',
					left: { type: 'Variable', id: 'a' },
					right: { type: 'Variable', id: 'b' },
				}
			}
		]
	}
]

function genFunctionDefinition(node) {
	let result = ''
	const [stackVar, stackSize] = collectStackVar(node)

	result += `${node.namespace}.${node.name}:\n`
	result += '\tsub sp, sp, #' + stackSize + '\n'
	result += '\tstp x29, x30, [sp, #' + stackSize + ']\n'
	result += '\tadd x29, x29, #' + stackSize + '\n'
	result += genParameters(node.parameters, stackVar)

	for (let i = 0; i < node.body.length; i++) {
		if (node.body[i].type == 'ReturnStatement') {
			result += genReturnStatement(node.body[i], stackVar)
		}

		if (node.body[i].type == 'VariableDefinition') {
			result += genVariableDefinition(node.body[i], stackVar)
		}
		
		if (node.body[i].type == 'CallStatement') {
			result += genCallStatement(node.body[i], stackVar)
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

function genVariableDefinition(node, stackVar) {
	let result = ''
	result += genExpression(node.value, 'x0', stackVar)
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

	if (node.namespace == '') {
		result += `\tbl ${node.name}\n`
	} else {
		result += `\tbl ${node.namespace}.${node.name}\n`
	}
	result += `\tmov ${reg}, x0\n`
	return result
}

function genMathExpression(node, reg, stackVar) {
	let result = ''
	result += genExpression(node.left, 'x0', stackVar)
	result += genExpression(node.right, 'x1', stackVar)
	if (node.operator == '+') {
		result += '\tadd x0, x0, x1\n'
	}
	if (node.operator == '-') {
		result += '\tsub x0, x0, x1\n'
	}
	if (node.operator == '*') {
		result += `\tmul ${reg}, x0, x1\n`
	}

	return result
}

function genExpression(node, reg, stackVar) {
	if (node.type == 'Variable') {
		return '\tldr ' + reg + ', ' + stackVar[node.id] + '\n'
	}
	if (node.type == 'Number') {
		return '\tmov ' + reg + ', #' + node.value + '\n'
	}
	if (node.type == 'MathExpression') {
		return genMathExpression(node, reg, stackVar)
	}
	if (node.type == 'CallExpression') {
		return genCallExpression(node, reg, stackVar)
	}
}

function included() {
	return `
printint:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, sp, #16
	str x0, [sp, #0]
	adrp x0, intStr@page
	add x0, x0, intStr@pageoff
	bl _printf
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret

println:
	sub sp, sp, #16
	stp x29, x30, [sp, #16]
	add x29, sp, #16
	adrp x0, lnstr@page
	add x0, x0, lnstr@pageoff
	bl _printf
	ldp x29, x30, [sp, #16]
	add sp, sp, #16
	ret


.data
lnstr: .asciz "\\n"
intStr: .asciz "%d"
	`

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
	let result = ''
	result += head()
	result += genProgram(ast)
	result += included()
	return result
}

function genProgram(node) {
	let result = ''
	for (let i = 0; i < node.length; i++) {
		result += genFunctionDefinition(node[i])
	}
	return result
}

module.exports = gen 
