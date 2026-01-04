import Effect from '../Effect.js';
import Particle from '../Particle.js';

class GalaxyEffect extends Effect {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.stars = [];
        this.shootingStars = [];
    }

    init() {
        this.buildStars();
        this.shootingStars = [];
    }

    cleanup() {
        this.stars = [];
        this.shootingStars = [];
    }

    onResize() {
        this.buildStars();
    }

    clearBackground() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    buildStars() {
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.05
            });
        }
    }

    update() {
        if (this.stars.length === 0) {
            this.buildStars();
        }

        for (let star of this.stars) {
            star.twinkle += star.speed;
            const alpha = 0.5 + Math.sin(star.twinkle) * 0.5;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        if (Math.random() < 0.01) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.5;
            this.shootingStars.push(new Particle(x, y, {
                vx: 10 + Math.random() * 10,
                vy: 5 + Math.random() * 5,
                size: 2,
                color: '#fff',
                life: 30
            }));
        }

        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const p = this.shootingStars[i];
            p.update();
            if (p.life <= 0) {
                this.shootingStars.splice(i, 1);
            } else {
                this.ctx.globalAlpha = p.life / p.maxLife;
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }
    }
}

export default GalaxyEffect;
