import Particle from './Particle.js';

class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.active = false;
    }

    start() {
        this.active = true;
        this.particles = [];
        this.init();
    }

    stop() {
        this.active = false;
        this.particles = [];
        this.cleanup();
    }

    init() {}

    cleanup() {}

    update() {}

    render() {
        this.clearBackground();
        this.update();
        this.drawParticles();
    }

    clearBackground() {
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }

    createParticle(x, y, options) {
        return new Particle(x, y, options);
    }

    addParticle(x, y, options) {
        this.particles.push(this.createParticle(x, y, options));
    }
}

export default Effect;
export { Particle };
