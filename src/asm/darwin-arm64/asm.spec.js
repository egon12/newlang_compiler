const fs = require('fs');
const asm = require('./asm');
const { Generator }  = require('./literal_asm');

it('should compile to asm', () => {
	const result = asm(node)
	expect(result).toMatchSnapshot();
	fs.writeFileSync(__dirname + '/asm.spec.s', result);
})

it('Generator should compile to asm', () => {
	const generator = new Generator();
	const result = generator.generate(node)
	expect(result).toMatchSnapshot();
})

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
						{ type: 'Number', value: "4" },
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
			{ name: 'x', type: { type: 'BuiltInType', name: 'int' } },
		],
		body: [
			{
				type: 'ReturnStatement',
				value: {
					type: 'AddOperator',
					left: { type: 'Number', value: "1" },
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
			{ name: 'a', type: { type: 'BuiltInType', name: 'int' } },
			{ name: 'b', type: { type: 'BuiltInType', name: 'int' } },
		],
		body: [
			{
				type: 'ReturnStatement',
				value: {
					type: 'AddOperator',
					left: { type: 'Variable', id: 'a' },
					right: { type: 'Variable', id: 'b' },
				}
			}
		]
	}
]
