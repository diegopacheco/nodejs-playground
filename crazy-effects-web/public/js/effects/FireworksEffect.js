import Effect from '../Effect.js';

class FireworksEffect extends Effect {
    update() {
        if (Math.random() < 0.03) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height;
            const targetY = Math.random() * this.canvas.height * 0.5;
            const rocket = this.createParticle(x, y, {
                vy: -15,
                size: 3,
                color: '#fff',
                life: 60,
                type: 'circle'
            });
            rocket.targetY = targetY;
            rocket.isRocket = true;
            this.particles.push(rocket);
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();

            if (p.isRocket && p.y <= p.targetY) {
                const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                for (let j = 0; j < 80; j++) {
                    const angle = (Math.PI * 2 / 80) * j;
                    const speed = 2 + Math.random() * 4;
                    this.addParticle(p.x, p.y, {
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 2 + Math.random() * 2,
                        color: color,
                        life: 60 + Math.random() * 40,
                        gravity: 0.05,
                        friction: 0.98
                    });
                }
                this.particles.splice(i, 1);
                continue;
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default FireworksEffect;
