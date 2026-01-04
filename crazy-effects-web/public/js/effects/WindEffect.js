import Effect from '../Effect.js';

class WindEffect extends Effect {
    update() {
        if (Math.random() < 0.2) {
            const colors = ['#55efc4', '#81ecec', '#74b9ff', '#a29bfe'];
            this.addParticle(-20, Math.random() * this.canvas.height, {
                vx: 10 + Math.random() * 15,
                vy: (Math.random() - 0.5) * 4,
                size: 5 + Math.random() * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 100,
                type: 'leaf',
                friction: 0.99
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vy += (Math.random() - 0.5) * 0.5;
            p.update();
            if (p.x > this.canvas.width + 50 || p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default WindEffect;
