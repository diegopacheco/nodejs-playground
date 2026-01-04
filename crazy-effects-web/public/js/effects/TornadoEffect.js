import Effect from '../Effect.js';
import Particle from '../Particle.js';

class TornadoEffect extends Effect {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.angle = 0;
    }

    init() {
        this.particles = [];
        this.angle = 0;
    }

    cleanup() {
        this.particles = [];
    }

    update() {
        this.angle += 0.1;
        const centerX = this.canvas.width / 2;
        const baseY = this.canvas.height;

        for (let i = 0; i < 5; i++) {
            const heightRatio = Math.random();
            const y = baseY - heightRatio * this.canvas.height * 0.8;
            const radius = 20 + (1 - heightRatio) * 150;
            const angle = this.angle + heightRatio * 10 + Math.random() * 0.5;
            const x = centerX + Math.cos(angle) * radius;

            this.particles.push(new Particle(x, y, {
                vx: Math.cos(angle + Math.PI / 2) * 5,
                vy: -2 - Math.random() * 3,
                size: 3 + Math.random() * 5,
                color: `hsl(${200 + Math.random() * 40}, 30%, ${40 + Math.random() * 30}%)`,
                life: 40 + Math.random() * 30,
                friction: 0.98
            }));
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            const dx = p.x - centerX;
            const dy = baseY - p.y;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle + Math.PI / 2) * 0.5;
            p.vy -= 0.1;
            p.update();

            if (p.life <= 0 || p.y < 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default TornadoEffect;
