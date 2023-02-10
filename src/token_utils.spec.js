const Token = require('./token_utils');

describe('Token.splice', () => {
	it('should splice until get the type', () => {
		const tokens = [
			{ type: 'openParen' },
			{ type: 'identifier', token: 'a' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'b' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'c' },
			{ type: 'closeParen' },
		];
		const result = Token.splice(tokens, 'closeParen');
		expect(result).toEqual([
			{ type: 'openParen' },
			{ type: 'identifier', token: 'a' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'b' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'c' },
		]);
		expect(tokens).toEqual([
			{ type: 'closeParen' },
		]);
	})

	it('should throw error if not found', () => {
		const tokens = [
			{ type: 'openParen' },
			{ type: 'identifier', token: 'a' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'b' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'c' },
			{ type: 'closeParen' },
		];

		const action = async () => {
			spliceUntil(tokens, 'semicolon')
		};

		expect(action()).rejects.toThrow();
	})
})

describe('Token.split', () => {

	it('should split tokens by type', () => {
		const tokens = [
			{ type: 'openParen' },
			{ type: 'identifier', token: 'a' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'b' },
			{ type: 'comma' },
			{ type: 'identifier', token: 'c' },
			{ type: 'closeParen' },
		];
		const result = Token.split(tokens, 'comma');
		expect(result).toEqual([
			[
				{ type: 'openParen' },
				{ type: 'identifier', token: 'a' },
			],
			[
				{ type: 'identifier', token: 'b' },
			],
			[
				{ type: 'identifier', token: 'c' },
				{ type: 'closeParen' },
			],
		]);
	})
})
