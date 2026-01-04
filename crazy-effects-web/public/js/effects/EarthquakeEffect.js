import Effect from '../Effect.js';

class EarthquakeEffect extends Effect {
    init() {
        this.shakeIntensity = 20;
    }

    cleanup() {
        document.body.style.transform = 'none';
        this.shakeIntensity = 0;
    }

    update() {
        this.shakeIntensity = 20;

        if (Math.random() < 0.1) {
            const x = Math.random() * this.canvas.width;
            for (let i = 0; i < 10; i++) {
                this.addParticle(x + (Math.random() - 0.5) * 100, this.canvas.height, {
                    vx: (Math.random() - 0.5) * 8,
                    vy: -Math.random() * 10,
                    size: 5 + Math.random() * 15,
                    color: `hsl(${30 + Math.random() * 20}, ${50 + Math.random() * 30}%, ${30 + Math.random() * 30}%)`,
                    life: 80,
                    gravity: 0.3
                });
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.y > this.canvas.height || p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }

        const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
        const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
        document.body.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
}

export default EarthquakeEffect;
