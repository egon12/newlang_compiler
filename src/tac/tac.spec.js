const translate = require('./tac');

it('should able to translate FunctionDefinition', () => {
	const node = {
		type: "FunctionDefinition",
		namespace: "main",
		name: "main",
		parameters: [],
		body: [{
			type: "VariableDefinition",
			name: "a",
			value: {
				type: "Number",
				value: "1"
			}
		}],
		return: ''
	}

	const result = translate(node)

	expect(result).toEqual({
		statements: [ 
			{op:'ldr',arg1:'1',arg2:'',result: 't1'},
			{op:'str',arg1:'t1',arg2:'',result: 'a'},
		]}
	)
})

it('should able to translate math operation', () => {
	const node = {
		type: "FunctionDefinition",
		namespace: "main",
		name: "main",
		parameters: [],
		body: [{
			type: "VariableDefinition",
			name: "a",
			value: {
				type: "AddOperator",
				left: {
					type: "Number",
					value: "1"
				},
				right: {
					type: "MulOperator",
					left: {
						type: "Number",
						value: "2"
					},
					right: {
						type: "Number",
						value: "3"
					}
				}
			}
		}],
		return: ''
	}

	const result = translate(node)

	expect(result).toEqual({
		statements: [ 
			{op:'ldr',arg1:'1',arg2:'',result: 't1'},
			{op:'ldr',arg1:'2',arg2:'',result: 't2'},
			{op:'ldr',arg1:'3',arg2:'',result: 't3'},
			{op:'mul',arg1:'t2',arg2:'t3',result: 't4'},
			{op:'add',arg1:'t1',arg2:'t4',result: 't5'},
			{op:'str',arg1:'t5',arg2:'',result: 'a'},
		]}
	)
})


const node = {
	"type": "FunctionDefinition",
	"namespace": "main",
	"name": "main",
	"parameters": [],
	"body": [
		{
			"type": "VariableDefinition",
			"name": "a",
			"value": {
				"type": "Number",
				"value": "1"
			}
		},
		{
			"type": "VariableDefinition",
			"name": "b",
			"value": {
				"type": "Number",
				"value": "2"
			}
		},
		{
			"type": "VariableDefinition",
			"name": "c",
			"value": {
				"type": "Number",
				"value": "1"
			}
		},
		{
			"type": "VariableDefinition",
			"name": "x",
			"value": {
				"type": "Number",
				"value": "70"
			}
		},
		{
			"type": "VariableDefinition",
			"name": "ca",
			"value": {
				"type": "CallExpression",
				"name": "countA",
				"parameters": [
					{
						"type": "Variable",
						"id": "a"
					},
					{
						"type": "Variable",
						"id": "x"
					}
				]
			}
		},
		{
			"type": "VariableDefinition",
			"name": "cb",
			"value": {
				"type": "CallExpression",
				"name": "countB",
				"parameters": [
					{
						"type": "Variable",
						"id": "b"
					},
					{
						"type": "Variable",
						"id": "x"
					}
				]
			}
		},
		{
			"type": "VariableDefinition",
			"name": "cc",
			"value": {
				"type": "CallExpression",
				"name": "countC",
				"parameters": [
					{
						"type": "Variable",
						"id": "c"
					},
					{
						"type": "Variable",
						"id": "x"
					}
				]
			}
		},
		{
			"type": "VariableDefinition",
			"name": "result",
			"value": {
				"type": "AddOperator",
				"left": {
					"type": "AddOperator",
					"left": {
						"type": "Identifier",
						"value": "ca"
					},
					"right": {
						"type": "Identifier",
						"value": "cb"
					}
				},
				"right": {
					"type": "Identifier",
					"value": "cc"
				}
			}
		}
	],
	"return": ""
}
