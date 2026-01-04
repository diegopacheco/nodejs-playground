import Effect from '../Effect.js';

class RainEffect extends Effect {
    update() {
        for (let i = 0; i < 10; i++) {
            this.addParticle(Math.random() * this.canvas.width, -10, {
                vx: -2,
                vy: 15 + Math.random() * 10,
                size: 1,
                color: '#74b9ff',
                life: 100,
                type: 'rect'
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.y > this.canvas.height) {
                for (let j = 0; j < 3; j++) {
                    this.addParticle(p.x, this.canvas.height, {
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 3,
                        size: 2,
                        color: '#74b9ff',
                        life: 20,
                        gravity: 0.2
                    });
                }
                this.particles.splice(i, 1);
            } else if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default RainEffect;
