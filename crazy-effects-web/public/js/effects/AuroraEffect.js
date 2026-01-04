import Effect from '../Effect.js';
import Particle from '../Particle.js';

class AuroraEffect extends Effect {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.time = 0;
    }

    init() {
        this.time = 0;
        this.particles = [];
    }

    cleanup() {
        this.particles = [];
    }

    clearBackground() {
        this.ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        this.time += 0.02;

        const colors = [
            'rgba(0, 255, 150, 0.3)',
            'rgba(0, 200, 255, 0.3)',
            'rgba(150, 0, 255, 0.3)',
            'rgba(0, 255, 200, 0.3)'
        ];

        for (let layer = 0; layer < 4; layer++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height);

            for (let x = 0; x <= this.canvas.width; x += 10) {
                const wave1 = Math.sin(x * 0.01 + this.time + layer) * 50;
                const wave2 = Math.sin(x * 0.02 + this.time * 1.5 + layer * 2) * 30;
                const wave3 = Math.sin(x * 0.005 + this.time * 0.5) * 80;
                const y = this.canvas.height * 0.3 + wave1 + wave2 + wave3 + layer * 40;
                this.ctx.lineTo(x, y);
            }

            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.closePath();

            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, colors[layer]);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        if (Math.random() < 0.05) {
            this.particles.push(new Particle(Math.random() * this.canvas.width, Math.random() * this.canvas.height * 0.5, {
                size: 1 + Math.random(),
                color: '#fff',
                life: 30 + Math.random() * 30
            }));
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                this.ctx.globalAlpha = p.life / p.maxLife;
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
    }
}

export default AuroraEffect;
