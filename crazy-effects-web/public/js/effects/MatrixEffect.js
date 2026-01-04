import Effect from '../Effect.js';

class MatrixEffect extends Effect {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.columns = [];
        this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    }

    init() {
        this.buildColumns();
    }

    cleanup() {
        this.columns = [];
    }

    onResize() {
        this.buildColumns();
    }

    clearBackground() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    buildColumns() {
        const columnCount = Math.max(1, Math.floor(this.canvas.width / 20));
        this.columns = [];
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * 20,
                y: Math.random() * this.canvas.height,
                speed: 5 + Math.random() * 10
            });
        }
    }

    update() {
        if (this.columns.length === 0) {
            this.buildColumns();
        }

        this.ctx.font = '18px monospace';
        for (let col of this.columns) {
            const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            this.ctx.fillStyle = '#0f0';
            this.ctx.fillText(char, col.x, col.y);
            this.ctx.fillStyle = '#0a0';
            this.ctx.fillText(this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)], col.x, col.y - 20);
            this.ctx.fillStyle = '#050';
            this.ctx.fillText(this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)], col.x, col.y - 40);

            col.y += col.speed;
            if (col.y > this.canvas.height + 50) {
                col.y = -20;
                col.speed = 5 + Math.random() * 10;
            }
        }
    }
}

export default MatrixEffect;
