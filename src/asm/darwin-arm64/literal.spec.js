const { Collector } = require('./literal')
const fs = require('fs');
const { asm, Generator } = require('./literal_asm');

describe('literalCollector', () => {

	it('should able to collect global literal', ()=> {
		const collector = new Collector()
		const data = collector.collect(node)

		expect(data).toEqual([
			{ name: 'hello', type: '.ascii', value: 'Hello' },
			{ name: 'main.main.world', type: '.ascii', value: ' world!\n' },
		])
	})

	it('should able to output format in asm', () =>  {
		const collector = new Collector()
		const data = collector.toAsm(node)
		expect(data).toEqual(`
hello: .ascii "Hello"
main.main.world: .ascii " world!
"
`
		)
	})

	it('lets try to compile this tree', () => {
		const generator = new Generator()
		const result = generator.generate(node);
		expect(result).toMatchSnapshot();
		fs.writeFileSync(__dirname + '/literal_asm.spec.s', result);
	})
})

const node = [
	{ 
		type: 'VariableDefinition',
		name: 'hello',
		value: {
			type: 'Literal',
			value: 'Hello'
		}
	},
	{
		type: 'FunctionDefinition',
		namespace: 'main',
		name: 'main',
		parameters: [],
		return: 'int',
		body: [
			{
				type: 'VariableDefinition',
				name: 'world',
				value: {
					type: 'Literal',
					value: ' world!\n'
				},
			},
			{
				type: 'CallStatement',
				value: {
					type: 'CallExpression',
					name: 'syscall3',
					parameters: [
						{ type: 'Number', value: '1' },
						{ type: 'Variable', id: 'world' },
						{ type: 'Number', value: '8' },
						{ type: 'Number', value: '4' },
					]
				}
			},
			{
				type: 'ReturnStatement',
				value: {
					type: 'Number',
					value: '0'
				}
			},
		]
	},
]

const symbolTables = {
	'int': {size: 8, name: 'int'},
	'void': {size: 0, name: 'void'},
	'char': {size: 1, name: 'char'},
	'float': {size: 8, name: 'float'},
	'array_of_char_8': {size: 8, name: 'array', subtype: 'char'},
}
