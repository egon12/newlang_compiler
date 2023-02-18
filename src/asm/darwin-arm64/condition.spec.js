const { Generator } = require('./literal_asm.js');
const fs = require('fs');

it('should generate condition codes', () => {
	const g = new Generator();
	const result = g.generate(node);
	expect(result).toMatchSnapshot();
	fs.writeFileSync(__dirname + '/condition.spec.s', result);
})

const node = [
	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'main',
		parameters: [],
		body: [
			{
				type: 'VariableDefinition',
				name: 'a',
				value: { type: 'Number', value: "4" },
			},
			{
				type: 'IfStatement',
				condition: {
					type: 'MathBoolExpression',
					operator: '==',
					left: { type: 'Number', value: "4" },
					right: { type: 'Variable', id: "a" },
				},
				body: [
					{
						type: 'ReturnStatement',
						value: { type: 'Number', value: 4, }
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


