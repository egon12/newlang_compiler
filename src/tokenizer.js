const number = 'number';
const keyword = 'keyword';
const identifier = 'identifier';
const operator = 'operator';
const string = 'string';
const equal = 'equal';

class Token {
	constructor() {
		this._token = '';
	}

	set token(token) {
		this._token = token;
	}

	get token() {
		return this._token;
	}

	start(index, line, column) {
		this._start = { index, line, column };
	}

	end(index, line, column) {
		this._end = { index, line, column };
		if (this.type === identifier && isKeyword(this._token)) {
			this.type = keyword;
		}
	}

	isComplete() {
		return this._start && this._end;
	}

	isStarting() {
		return this._start && !this._end;
	}
}


class Tokenizer {
	constructor() {
		this._tokenList = [];
		this._index = 0;
	}

	parse(input) {
		this._index = 0;
		this._tokenList = [];
		this._line = 1;
		this._column = 1;

		this._token = new Token();

		while (this._index < input.length) {
			const char = input[this._index];

			if (char === '\n') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._line++;
				this._column = 1;
				this._index++;
				continue;
			}

			if (char === ' ' || char === '\t') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._index++;
				this._column++;
				continue;
			}

			if (isOperator(char)) {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = operator;
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;

				this._column = 1;
				this._index++;

				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (isLetter(char)) {
				if (this._token.isStarting()) {
					this._token.token += char;
				} else {
					this._token.type = identifier;
					this._token.start(this._index, this._line, this._column);
					this._token.token = char;
				}
				this._column++;
				this._index++;
				continue;
			}

			if (isNumber(char)) {
				if (this._token.isStarting()) {
					this._token.token += char;
				} else {
					this._token.type = number;
					this._token.start(this._index, this._line, this._column);
					this._token.token = char;
				}
				this._column++;
				this._index++;
				continue;
			}


			if (char === '=') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = equal;
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}


			if (char === '(') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'openParen';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === ')') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'closeParen';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === '{') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'openBrace';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === '}') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'closeBrace';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}


			if (char === ':') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'colon';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === ':') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'colon';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}


			if (char === ';') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'semicolon';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === ',') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'comma';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === '.') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'dot';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;
				this._column++;
				this._index++;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}

			if (char === '"') {
				if (this._token.isStarting()) {
					this._token.end(this._index, this._line, this._column);
					this._tokenList.push(this._token);
					this._token = new Token();
				}
				this._token.type = 'string';
				this._token.start(this._index, this._line, this._column);
				this._token.token = char;

				this._column++;
				this._index++;
				let newChar = input[this._index];
				while(newChar !== '"' && this._index < input.length) {
					this._column++;
					this._index++;
					newChar = input[this._index];
					this._token.token += newChar;
				}
				this._token.token += newChar;
				this._token.end(this._index, this._line, this._column);
				this._tokenList.push(this._token);
				this._token = new Token();
				continue;
			}


			throw new Error('Invalid character: ' + char + '('+ char.charCodeAt(0).toString(16) +') at ' + this._index + ' on line ' + this._line + ' column ' + this._column);
		}

		if (this._token.isStarting()) {
			this._token.end(this._index, this._line, this._column);
			this._tokenList.push(this._token);
			this._token = new Token();
		}

		return this._tokenList;
	}
}

/**
 * Below is the code generated by Github copilot
 */

/**
 * @param {string} input
 * @return {string}
 * @example
 * // returns 'hello'
 * unescapeString('"hello"');
 * @example
 * // returns 'hello'
 * unescapeString('"hello"');
 */

function isNumber(char) {
	return char >= '0' && char <= '9';
}

function isLetter(char) {
	return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
}

function isOperator(char) {
	return char === '+' || char === '-' || char === '*' || char === '/';
}

function isKeyword(char) {
	return char === 'var' || char === 'fn';
}

function isString(char) {
	return char === '"';
}

function isSpace(char) {
	return char === ' ';
}

function isEnd(char) {
	return char === ';';
}

function isIdentifier(char) {
	return isLetter(char) || isNumber(char);
}

function isToken(char) {
	return isNumber(char) || isLetter(char) || isOperator(char) || isKeyword(char) || isString(char) || isSpace(char) || isEnd(char);
}

function isWhiteSpace(char) {
	return char === ' ' || char === '\n' || char === '\t';
}

function isQuote(char) {
	return char === '"';
}

function isEscape(char) {
	return char === '\\';
}

function isSlash(char) {
	return char === '/';
}

function isStar(char) {
	return char === '*';
}

function isLineTerminator(char) {
	return char === '\n';
}

module.exports = Tokenizer;

