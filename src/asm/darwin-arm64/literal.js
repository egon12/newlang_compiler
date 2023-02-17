class Collector {

	constructor() {
		this.data = []
	}

	dataToAsm() {
		return '\n' + this.data
			.map(({name, type, value}) => `${name}: ${type} "${value}"`)
			.join('\n') + '\n'
	}

	toAsm(nodes) {
		this.collect(nodes, '')
		return this.dataToAsm()
	}

	collect(nodes, prefix='') {
		for (let i = 0; i<nodes.length; i++) {
			this.collectSingle(nodes[i], prefix)
		}
		return this.data
	}

	collectSingle(node, prefix) {
		if (node.type == 'VariableDefinition') {
			const name = prefix ?  prefix + '.' + node.name : node.name
			this.collectSingle(node.value, name)
			return
		}

		if (node.type == 'Literal') {
			this.data.push({
				name: prefix,
				type: '.ascii',
				value: node.value,
			})
			return
		}
		if (node.type == 'FunctionDefinition') {
			this.collect(node.body, node.namespace + '.' + node.name)
		}
	}
}

module.exports = {
	Collector
	
}
