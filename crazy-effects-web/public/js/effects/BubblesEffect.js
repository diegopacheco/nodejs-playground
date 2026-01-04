import Effect from '../Effect.js';
import Particle from '../Particle.js';

class BubblesEffect extends Effect {
    init() {
        this.particles = [];
    }

    cleanup() {
        this.particles = [];
    }

    update() {
        if (Math.random() < 0.1) {
            const colors = [
                'rgba(255, 159, 243, 0.6)',
                'rgba(116, 185, 255, 0.6)',
                'rgba(162, 155, 254, 0.6)',
                'rgba(129, 236, 236, 0.6)'
            ];
            this.particles.push(new Particle(Math.random() * this.canvas.width, this.canvas.height + 20, {
                vx: (Math.random() - 0.5) * 2,
                vy: -1 - Math.random() * 2,
                size: 10 + Math.random() * 30,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 300
            }));
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx += (Math.random() - 0.5) * 0.2;
            p.update();

            if (p.y < -50 || p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                this.ctx.globalAlpha = p.life / p.maxLife;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.fill();
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        }
    }
}

export default BubblesEffect;
