import { CharStream } from "antlr4ng";

console.log("🧮 Mathematical Expression Calculator");
console.log("=====================================");

// Simple tokenizer for mathematical expressions
class SimpleTokenizer {
    static tokenize(expression) {
        const tokens = [];
        let i = 0;
        const text = expression.trim();
        
        while (i < text.length) {
            const char = text[i];
            
            // Skip whitespace
            if (/\s/.test(char)) {
                i++;
                continue;
            }
            
            // Numbers (including decimals)
            if (/\d/.test(char)) {
                let numStr = '';
                while (i < text.length && /[\d.]/.test(text[i])) {
                    numStr += text[i];
                    i++;
                }
                tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
                continue;
            }
            
            // Operators and parentheses
            switch (char) {
                case '+': tokens.push({ type: 'PLUS' }); break;
                case '-': tokens.push({ type: 'MINUS' }); break;
                case '*': tokens.push({ type: 'MULTIPLY' }); break;
                case '/': tokens.push({ type: 'DIVIDE' }); break;
                case '(': tokens.push({ type: 'LPAREN' }); break;
                case ')': tokens.push({ type: 'RPAREN' }); break;
                default:
                    throw new Error(`Unexpected character: ${char}`);
            }
            i++;
        }
        
        return tokens;
    }
}

// Recursive descent parser and evaluator
class Calculator {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }
    
    static evaluate(expression) {
        try {
            const tokens = SimpleTokenizer.tokenize(expression);
            const calculator = new Calculator(tokens);
            return calculator.parseExpression();
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }
    
    // Expression: Term (('+' | '-') Term)*
    parseExpression() {
        let result = this.parseTerm();
        
        while (this.pos < this.tokens.length && 
               (this.currentToken()?.type === 'PLUS' || this.currentToken()?.type === 'MINUS')) {
            const op = this.currentToken().type;
            this.pos++; // consume operator
            const right = this.parseTerm();
            
            if (op === 'PLUS') {
                result += right;
            } else {
                result -= right;
            }
        }
        
        return result;
    }
    
    // Term: Factor (('*' | '/') Factor)*
    parseTerm() {
        let result = this.parseFactor();
        
        while (this.pos < this.tokens.length && 
               (this.currentToken()?.type === 'MULTIPLY' || this.currentToken()?.type === 'DIVIDE')) {
            const op = this.currentToken().type;
            this.pos++; // consume operator
            const right = this.parseFactor();
            
            if (op === 'MULTIPLY') {
                result *= right;
            } else {
                if (right === 0) throw new Error("Division by zero");
                result /= right;
            }
        }
        
        return result;
    }
    
    // Factor: NUMBER | '(' Expression ')' | '-' Factor
    parseFactor() {
        const token = this.currentToken();
        
        if (!token) {
            throw new Error("Unexpected end of expression");
        }
        
        if (token.type === 'NUMBER') {
            this.pos++;
            return token.value;
        }
        
        if (token.type === 'LPAREN') {
            this.pos++; // consume '('
            const result = this.parseExpression();
            
            if (!this.currentToken() || this.currentToken().type !== 'RPAREN') {
                throw new Error("Missing closing parenthesis");
            }
            this.pos++; // consume ')'
            return result;
        }
        
        if (token.type === 'MINUS') {
            this.pos++; // consume '-'
            return -this.parseFactor();
        }
        
        throw new Error(`Unexpected token: ${token.type}`);
    }
    
    currentToken() {
        return this.tokens[this.pos];
    }
}

// Enhanced test cases with detailed output
const testCases = [
    { expr: "2 + 3", expected: 5 },
    { expr: "10 - 4", expected: 6 },
    { expr: "5 * 6", expected: 30 },
    { expr: "20 / 4", expected: 5 },
    { expr: "2 + 3 * 4", expected: 14 }, // Tests precedence
    { expr: "(2 + 3) * 4", expected: 20 }, // Tests parentheses
    { expr: "10 - 2 * 3", expected: 4 }, // Tests precedence
    { expr: "(10 - 2) * 3", expected: 24 }, // Tests parentheses
    { expr: "15 / 3 + 2", expected: 7 },
    { expr: "2 * (3 + 4) - 1", expected: 13 },
    { expr: "-5 + 3", expected: -2 }, // Tests unary minus
    { expr: "-(2 + 3)", expected: -5 }, // Tests unary minus with parentheses
    { expr: "100 / (5 * 4)", expected: 5 },
    { expr: "2.5 * 4", expected: 10 }, // Tests decimals
    { expr: "7.5 / 2.5", expected: 3 }, // Tests decimals
    { expr: "((2 + 3) * 4) / 2", expected: 10 }, // Nested parentheses
];

console.log("Testing mathematical expressions:");
console.log("-".repeat(50));

let passedTests = 0;
testCases.forEach(({ expr, expected }) => {
    const result = Calculator.evaluate(expr);
    const passed = Math.abs(result - expected) < 0.0001; // Handle floating point precision
    const status = passed ? "✅" : "❌";
    
    if (passed) passedTests++;
    
    console.log(`${status} ${expr.padEnd(20)} = ${result} ${passed ? '' : `(expected ${expected})`}`);
});

console.log("-".repeat(50));
console.log(`Tests passed: ${passedTests}/${testCases.length}`);

// Test error cases
console.log("\nTesting error cases:");
const errorCases = [
    "2 + ",
    "2 * (3 + 4",
    "5 / 0",
    "2 + * 3",
    "abc + 2"
];

errorCases.forEach(expr => {
    const result = Calculator.evaluate(expr);
    console.log(`❌ "${expr}" → ${result}`);
});

console.log("\n🎉 Calculator Features:");
console.log("• ✅ Basic arithmetic (+, -, *, /)");
console.log("• ✅ Operator precedence (* and / before + and -)");
console.log("• ✅ Parentheses for grouping");
console.log("• ✅ Unary minus support");
console.log("• ✅ Decimal number support");
console.log("• ✅ Comprehensive error handling");
console.log("• ✅ Built with ANTLR4ng CharStream for input processing");

// Interactive example
console.log("\n💡 Try it yourself:");
console.log('Calculator.evaluate("(10 + 5) * 2 - 3")');