import Effect from '../Effect.js';

class ConfettiEffect extends Effect {
    update() {
        if (Math.random() < 0.3) {
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1'];
            this.addParticle(Math.random() * this.canvas.width, -20, {
                vx: (Math.random() - 0.5) * 4,
                vy: 2 + Math.random() * 3,
                size: 8 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 200,
                type: 'confetti',
                gravity: 0.05,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx += (Math.random() - 0.5) * 0.2;
            p.update();
            if (p.y > this.canvas.height + 50 || p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
    }
}

export default ConfettiEffect;
