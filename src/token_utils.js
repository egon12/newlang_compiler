function splice(tokens, type) {
	for (let i = 0; i<tokens.length; i++) {
		if (tokens[i].type === type) {
			return tokens.splice(0, i);
		}
	}
	throw new Error('Could not find type: ' + type);
}

function split(tokens, type) {
	const result = [];
	let current = [];
	for (let i = 0; i<tokens.length; i++) {
		if (tokens[i].type === type) {
			result.push(current);
			current = [];
		} else {
			current.push(tokens[i]);
		}
	}
	if (current.length > 0) {
		result.push(current);
	}
	return result;
}

module.exports = {
	splice,
	split,
}
