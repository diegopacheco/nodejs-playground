import Effect from '../Effect.js';

class FireEffect extends Effect {
    update() {
        for (let i = 0; i < 5; i++) {
            const x = this.canvas.width / 2 + (Math.random() - 0.5) * 200;
            this.addParticle(x, this.canvas.height, {
                vx: (Math.random() - 0.5) * 2,
                vy: -3 - Math.random() * 5,
                size: 10 + Math.random() * 20,
                color: `hsl(${Math.random() * 30 + 10}, 100%, ${50 + Math.random() * 30}%)`,
                life: 40 + Math.random() * 30,
                friction: 0.99
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.size *= 0.96;
            if (p.life <= 0 || p.size < 1) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default FireEffect;
