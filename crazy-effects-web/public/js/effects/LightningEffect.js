import Effect from '../Effect.js';

class LightningEffect extends Effect {
    init() {
        this.bolts = [];
    }

    cleanup() {
        this.bolts = [];
    }

    update() {
        if (Math.random() < 0.02) {
            const startX = Math.random() * this.canvas.width;
            const bolt = { segments: [], life: 10 };
            let x = startX;
            let y = 0;
            while (y < this.canvas.height) {
                const newX = x + (Math.random() - 0.5) * 100;
                const newY = y + 20 + Math.random() * 30;
                bolt.segments.push({ x1: x, y1: y, x2: newX, y2: newY });
                if (Math.random() < 0.3) {
                    const branchX = newX + (Math.random() - 0.5) * 80;
                    const branchY = newY + 30 + Math.random() * 50;
                    bolt.segments.push({ x1: newX, y1: newY, x2: branchX, y2: branchY, branch: true });
                }
                x = newX;
                y = newY;
            }
            this.bolts.push(bolt);
        }

        for (let i = this.bolts.length - 1; i >= 0; i--) {
            const bolt = this.bolts[i];
            bolt.life--;

            if (bolt.life <= 0) {
                this.bolts.splice(i, 1);
            } else {
                this.ctx.globalAlpha = bolt.life / 10;
                for (let seg of bolt.segments) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(seg.x1, seg.y1);
                    this.ctx.lineTo(seg.x2, seg.y2);
                    this.ctx.strokeStyle = seg.branch ? '#aaf' : '#fff';
                    this.ctx.lineWidth = seg.branch ? 1 : 3;
                    this.ctx.shadowColor = '#00f';
                    this.ctx.shadowBlur = 20;
                    this.ctx.stroke();
                    this.ctx.shadowBlur = 0;
                }
                this.ctx.globalAlpha = 1;
            }
        }
    }
}

export default LightningEffect;
