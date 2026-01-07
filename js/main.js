let w, h, cx, cy, stars, menuOrder;
let activeLens = 0;
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const lensStatusDiv = document.getElementById("lens-status");

async function init() {
    try {
        await document.fonts.load('10px "LensSymbols"');
    } catch (e) {
        console.warn("Font loading failed.");
    }

    window.lenses = createLenses(CONFIG);
    menuOrder = window.lenses.map((_, i) => i).sort(() => Math.random() - 0.5);

    resize();
    requestAnimationFrame(drawLoop);
}

/**
 * Handle window resizing and coordinate updates.
 */
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cx = w / 2; cy = h / 2;
    stars = createStars(w, h);
    if (window.lenses) {
        const radius = Math.min(w, h) * CONFIG.telescope.innerRadiusFactor;
        sampleSymbols(window.lenses, radius);
    }
}

/**
 * Increments or decrements the target rotation of the current lens.
 */
function rotateLens(direction) {
    const step = 360 / CONFIG.telescope.sides;
    if (window.lenses[activeLens]) {
        window.lenses[activeLens].targetAngle += direction * step;
    }
}

/**
 * The main animation loop.
 */
function drawLoop(time) {
    if (!window.lenses) return;

    ctx.fillStyle = "#000"; 
    ctx.fillRect(0, 0, w, h);

    window.lenses.forEach(l => {
        let diff = ((l.targetAngle - l.angle + 540) % 360) - 180;
        l.angle += diff * CONFIG.rotation.lerpSpeed;
    });

    const isSolved = window.lenses.every(l => 
        Utils.getShortestDist(l.angle, l.correct) < CONFIG.rotation.snapTolerance
    );

    Renderer.drawNebula(ctx, time, window.lenses[activeLens], cx, cy);
    drawStars(ctx, stars, window.lenses, activeLens, time, isSolved, cx, cy, w, h);
    Renderer.drawTelescope(ctx, isSolved, activeLens, window.lenses, w, h, cx, cy);
    updateLensUI(lensStatusDiv, window.lenses, activeLens, menuOrder);
    
    requestAnimationFrame(drawLoop);
}

// Event Listeners
window.addEventListener("keydown", e => {
    if (e.key >= "1" && e.key <= "5") activeLens = menuOrder[+e.key - 1];
    if (e.key === "ArrowLeft") rotateLens(-1);
    if (e.key === "ArrowRight") rotateLens(1);
    if (e.key.toLowerCase() === "m") toggleMap();
});

window.addEventListener("wheel", e => {
    e.preventDefault();
    rotateLens(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

window.addEventListener("resize", resize);
init();