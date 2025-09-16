import { 
    CharStream, 
    CommonTokenStream, 
    Lexer, 
    Parser, 
    ParserRuleContext,
    TerminalNode
} from "antlr4ng";

console.log("🧮 Mathematical Expression Parser with ANTLR4ng");
console.log("=".repeat(50));

// Create a simple lexer for mathematical expressions
class MathLexer extends Lexer {
    constructor(input) {
        super(input);
        this.tokenTypes = {
            NUMBER: 1,
            PLUS: 2,
            MINUS: 3,
            MULTIPLY: 4,
            DIVIDE: 5,
            LPAREN: 6,
            RPAREN: 7,
            WHITESPACE: 8,
            EOF: -1
        };
    }

    nextToken() {
        this.skip(); // Skip whitespace
        
        if (this._input.LA(1) === -1) {
            return this.createToken(this.tokenTypes.EOF, "");
        }

        const char = String.fromCharCode(this._input.LA(1));
        
        if (/\d/.test(char)) {
            return this.readNumber();
        }

        switch (char) {
            case '+': this._input.consume(); return this.createToken(this.tokenTypes.PLUS, "+");
            case '-': this._input.consume(); return this.createToken(this.tokenTypes.MINUS, "-");
            case '*': this._input.consume(); return this.createToken(this.tokenTypes.MULTIPLY, "*");
            case '/': this._input.consume(); return this.createToken(this.tokenTypes.DIVIDE, "/");
            case '(': this._input.consume(); return this.createToken(this.tokenTypes.LPAREN, "(");
            case ')': this._input.consume(); return this.createToken(this.tokenTypes.RPAREN, ")");
            default:
                throw new Error(`Unexpected character: ${char}`);
        }
    }

    readNumber() {
        let text = "";
        while (this._input.LA(1) !== -1 && /[\d.]/.test(String.fromCharCode(this._input.LA(1)))) {
            text += String.fromCharCode(this._input.LA(1));
            this._input.consume();
        }
        return this.createToken(this.tokenTypes.NUMBER, text);
    }

    skip() {
        while (this._input.LA(1) !== -1 && /\s/.test(String.fromCharCode(this._input.LA(1)))) {
            this._input.consume();
        }
    }

    createToken(type, text) {
        return {
            type,
            text,
            start: this._input.index,
            stop: this._input.index + text.length - 1
        };
    }
}

// Simple expression evaluator
class ExpressionEvaluator {
    static evaluate(expression) {
        try {
            // Simple recursive descent parser for: expr = term (('+' | '-') term)*
            const tokens = this.tokenize(expression);
            const result = this.parseExpression(tokens, 0);
            return result.value;
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    static tokenize(expression) {
        const input = CharStream.fromString(expression);
        const lexer = new MathLexer(input);
        const tokens = [];
        
        let token;
        do {
            token = lexer.nextToken();
            if (token.type !== lexer.tokenTypes.WHITESPACE) {
                tokens.push(token);
            }
        } while (token.type !== lexer.tokenTypes.EOF);
        
        return tokens;
    }

    static parseExpression(tokens, pos) {
        let result = this.parseTerm(tokens, pos);
        pos = result.pos;

        while (pos < tokens.length && (tokens[pos].type === 2 || tokens[pos].type === 3)) { // PLUS or MINUS
            const op = tokens[pos].text;
            pos++;
            const right = this.parseTerm(tokens, pos);
            pos = right.pos;
            
            if (op === '+') {
                result.value += right.value;
            } else {
                result.value -= right.value;
            }
        }

        return { value: result.value, pos };
    }

    static parseTerm(tokens, pos) {
        let result = this.parseFactor(tokens, pos);
        pos = result.pos;

        while (pos < tokens.length && (tokens[pos].type === 4 || tokens[pos].type === 5)) { // MULTIPLY or DIVIDE
            const op = tokens[pos].text;
            pos++;
            const right = this.parseFactor(tokens, pos);
            pos = right.pos;
            
            if (op === '*') {
                result.value *= right.value;
            } else {
                if (right.value === 0) throw new Error("Division by zero");
                result.value /= right.value;
            }
        }

        return { value: result.value, pos };
    }

    static parseFactor(tokens, pos) {
        if (pos >= tokens.length) throw new Error("Unexpected end of expression");

        const token = tokens[pos];
        
        if (token.type === 1) { // NUMBER
            return { value: parseFloat(token.text), pos: pos + 1 };
        }
        
        if (token.type === 6) { // LPAREN
            pos++; // consume '('
            const result = this.parseExpression(tokens, pos);
            pos = result.pos;
            
            if (pos >= tokens.length || tokens[pos].type !== 7) { // RPAREN
                throw new Error("Missing closing parenthesis");
            }
            
            return { value: result.value, pos: pos + 1 };
        }
        
        if (token.type === 3) { // MINUS (unary)
            pos++; // consume '-'
            const result = this.parseFactor(tokens, pos);
            return { value: -result.value, pos: result.pos };
        }

        throw new Error(`Unexpected token: ${token.text}`);
    }
}

// Test the calculator with various expressions
const testExpressions = [
    "2 + 3",
    "10 - 4",
    "5 * 6",
    "20 / 4",
    "2 + 3 * 4",
    "(2 + 3) * 4",
    "10 - 2 * 3",
    "(10 - 2) * 3",
    "15 / 3 + 2",
    "2 * (3 + 4) - 1",
    "-5 + 3",
    "-(2 + 3)",
    "100 / (5 * 4)",
    "2.5 * 4",
    "7.5 / 2.5"
];

console.log("Testing mathematical expressions:");
console.log("-".repeat(40));

testExpressions.forEach(expr => {
    const result = ExpressionEvaluator.evaluate(expr);
    console.log(`${expr.padEnd(20)} = ${result}`);
});

console.log("\n🎉 Interactive Calculator Ready!");
console.log("This demonstrates:");
console.log("• Custom lexer for tokenizing mathematical expressions");
console.log("• Recursive descent parser with operator precedence");
console.log("• Support for parentheses, unary minus, and decimal numbers");
console.log("• Error handling for invalid expressions");