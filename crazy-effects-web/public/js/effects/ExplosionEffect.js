import Effect from '../Effect.js';

class ExplosionEffect extends Effect {
    update() {
        if (this.particles.length < 50 && Math.random() < 0.05) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const colors = ['#e74c3c', '#f39c12', '#fdcb6e', '#ff6b6b', '#fff'];

            for (let i = 0; i < 100; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 10;
                this.addParticle(x, y, {
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 3 + Math.random() * 8,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: 40 + Math.random() * 40,
                    gravity: 0.1,
                    friction: 0.96
                });
            }

            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 100;
                this.addParticle(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, {
                    vx: 0,
                    vy: -1 - Math.random() * 2,
                    size: 15 + Math.random() * 20,
                    color: '#333',
                    life: 60,
                    friction: 0.98
                });
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.size *= 0.98;
            if (p.life <= 0 || p.size < 0.5) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default ExplosionEffect;
