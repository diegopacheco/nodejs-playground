class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.size = options.size || 3;
        this.color = options.color || '#fff';
        this.life = options.life || 100;
        this.maxLife = this.life;
        this.gravity = options.gravity || 0;
        this.friction = options.friction || 1;
        this.type = options.type || 'circle';
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;
    }

    update() {
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;

        if (this.type === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'rect') {
            ctx.fillRect(this.x, this.y, this.size, this.size * 3);
        } else if (this.type === 'leaf') {
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size / 2, this.vx, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'confetti') {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }
}

export default Particle;
