import FireworksEffect from './effects/FireworksEffect.js';
import FireEffect from './effects/FireEffect.js';
import SnowEffect from './effects/SnowEffect.js';
import RainEffect from './effects/RainEffect.js';
import WindEffect from './effects/WindEffect.js';
import EarthquakeEffect from './effects/EarthquakeEffect.js';
import ExplosionEffect from './effects/ExplosionEffect.js';
import MatrixEffect from './effects/MatrixEffect.js';
import BubblesEffect from './effects/BubblesEffect.js';
import LightningEffect from './effects/LightningEffect.js';
import GalaxyEffect from './effects/GalaxyEffect.js';
import ConfettiEffect from './effects/ConfettiEffect.js';
import TornadoEffect from './effects/TornadoEffect.js';
import AuroraEffect from './effects/AuroraEffect.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let animationId = null;
let currentEffect = null;

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (currentEffect && currentEffect.onResize) {
        currentEffect.onResize();
    }
};

window.addEventListener('resize', resize);
resize();

const effects = {
    fireworks: new FireworksEffect(canvas, ctx),
    fire: new FireEffect(canvas, ctx),
    snow: new SnowEffect(canvas, ctx),
    rain: new RainEffect(canvas, ctx),
    wind: new WindEffect(canvas, ctx),
    earthquake: new EarthquakeEffect(canvas, ctx),
    explosion: new ExplosionEffect(canvas, ctx),
    matrix: new MatrixEffect(canvas, ctx),
    bubbles: new BubblesEffect(canvas, ctx),
    lightning: new LightningEffect(canvas, ctx),
    galaxy: new GalaxyEffect(canvas, ctx),
    confetti: new ConfettiEffect(canvas, ctx),
    tornado: new TornadoEffect(canvas, ctx),
    aurora: new AuroraEffect(canvas, ctx)
};

const animate = () => {
    if (!currentEffect) {
        return;
    }
    currentEffect.render();
    animationId = requestAnimationFrame(animate);
};

const startEffect = (name) => {
    stopEffect();
    const effect = effects[name];
    if (!effect) {
        return;
    }
    currentEffect = effect;
    currentEffect.start();
    animate();
};

const stopEffect = () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (currentEffect) {
        currentEffect.stop();
    }
    currentEffect = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const effectButtons = document.querySelectorAll('[data-effect]');
effectButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const name = button.dataset.effect;
        startEffect(name);
    });
});

const stopButton = document.querySelector('[data-action="stop"]');
if (stopButton) {
    stopButton.addEventListener('click', () => {
        stopEffect();
    });
}
