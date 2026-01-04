import Particle from './Particle.js';

class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
    }

    start() {
        this.particles = [];
        this.init();
    }

    stop() {
        this.particles = [];
        this.cleanup();
    }

    init() {}

    cleanup() {}

    update() {}

    render() {
        this.clearBackground();
        this.update();
    }

    clearBackground() {
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createParticle(x, y, options) {
        return new Particle(x, y, options);
    }

    addParticle(x, y, options) {
        this.particles.push(this.createParticle(x, y, options));
    }
}

export default Effect;
