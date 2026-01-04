import Effect from '../Effect.js';

class SnowEffect extends Effect {
    update() {
        if (Math.random() < 0.3) {
            this.addParticle(Math.random() * this.canvas.width, -10, {
                vx: (Math.random() - 0.5) * 2,
                vy: 1 + Math.random() * 2,
                size: 2 + Math.random() * 4,
                color: '#fff',
                life: 500
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx += (Math.random() - 0.5) * 0.1;
            p.update();
            if (p.y > this.canvas.height || p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default SnowEffect;
