class ArithmeticIntepreter {
	visit(node) {
		switch(node.type) {
			case 'Number':
				return node.value
			case 'Identifier':
				return this.environment[node.value]
			case 'MulOperator':
				return this.visit(node.left) * this.visit(node.right)
			case 'DivOperator':
				return this.visit(node.left) / this.visit(node.right)
			case 'AddOperator':
				return this.visit(node.left) + this.visit(node.right)
			case 'SubOperator':
				return this.visit(node.left) - this.visit(node.right)
			default:
				throw new Error("Unexpected node type: ", node.type)
		}
	}
}

module.exports = ArithmeticIntepreter
