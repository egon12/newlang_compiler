const { Generator } = require('./literal_asm.js');
const fs = require('fs');

it('should generate condition codes', () => {
	const g = new Generator();
	const result = g.generate(forNode);
	//expect(result).toEqual('');
	//expect(result).toMatchSnapshot();
	fs.writeFileSync(__dirname + '/print_int.spec.s', result);
})

const forNode = [
	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'main',
		parameters: [],
		body: [
			{
				type: 'CallStatement',
				value: {
					type: 'CallExpression',
					namespace: 'main',
					name: 'printInt',
					parameters: [
						{ type: 'Number', value: '1123' },
					]
				},
			},
			{
				type: 'ReturnStatement',
				value: { type: 'Number', value: 0, }
			},
		]
	},
	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'printInt',
		parameters: [
			{ name: 'i', type: 'int' }
		],
		body: [
			{
				type: 'VariableDefinition',
				name: 'str',
				value: { type: 'Literal', value: '       1\n' },
			},
			{
				type: 'VariableDefinition',
				name: 'astr',
				value: { 
					type: 'ArrayExpression', 
					values: [
						{ type: 'Number', value: 1, },
						{ type: 'Number', value: 2, },
						{ type: 'Number', value: 3, },
						{ type: 'Number', value: 4, },
					],
				},
			},
			{
				type: 'VariableDefinition',
				name: 'index',
				value: { type: 'Number', value: '7' },
			},
			{
				type: 'ForStatement',
				condition: { },
				body: [
					{
						type: 'VariableDefinition',
						name: 'n',
						//value: {
						//	type: 'MathExpression',
						//	operator: '%',
						//	left: { type: 'Variable', id: 'n' },
						//	right: { type: 'Number', value: 1 },
						//},
						value: { type: 'Number', value: 4, }
					},
					{
						type: 'VariableDefinition',
						name: 'c',
						// value: CallExpression
						value: { type: 'Number', value: 4, }
					},
					{
						type: 'CallStatement',
						value: {
							type: 'CallExpression',
							name: 'syscall3',
							parameters: [
								{ type: 'Number', value: '1' },
								{ type: 'Variable', id: 'str' },
								{ type: 'Number', value: '9' },
								{ type: 'Number', value: '4' },
							]
						},
					},
					{ 
						type: 'AssignmentStatement', 
						name: 'index',
						value: { 
							type: 'SubOperator', 
							left: { type: 'Variable', id: 'index' },
							right: { type: 'Number', value: 1 },
						}
					},
					{
						type: 'IfStatement',
						condition: {
							type: 'MathBoolExpression',
							operator: '<',
							left: { type: 'Variable', id: 'index' },
							right: { type: 'Number', value: 0 },
						},
						body: [
							{
								type: 'BreakStatement',
							}
						]
					}
				],
			},
			{
				type: 'ReturnStatement',
				value: { type: 'Number', value: 0, }
			}
		]
	}
]
