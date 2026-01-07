/**
 * Handles star movement, symbol snapping logic, and rendering.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {Array} stars - Array of star objects.
 * @param {Array} lenses - Array of lens objects.
 * @param {number} activeLens - Index of currently selected lens.
 * @param {number} time - Current animation timestamp.
 * @param {boolean} isSolved - Whether the entire puzzle is complete.
 * @param {number} cx - Center X coordinate.
 * @param {number} cy - Center Y coordinate.
 * @param {number} w - Canvas width.
 * @param {number} h - Canvas height.
 */
function drawStars(ctx, stars, lenses, activeLens, time, isSolved, cx, cy, w, h) {
    ctx.save();
    ctx.translate(cx, cy);

    const l = lenses[activeLens];
    const rotationVelocity = Math.abs(l.targetAngle - l.angle);
    const movement = Math.min(1, rotationVelocity / 5);
    const radius = Math.min(w, h) * CONFIG.telescope.innerRadiusFactor;

    // Calculate how close the current lens is to its correct alignment (0 to 1)
    const angleDiff = Utils.getShortestDist(l.angle, l.correct);
    const accuracy = Math.pow(Math.max(0, 1 - (angleDiff / CONFIG.stars.discoveryRange)), 2);

    // Draw background glow for stars belonging to the current symbol
    if (accuracy > CONFIG.stars.glowThreshold) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const glowAlpha = (accuracy - CONFIG.stars.glowThreshold) * CONFIG.stars.glowIntensity;
        ctx.fillStyle = "#ffffff";
        for (let s of stars) {
            if (s.lensIndex === activeLens) {
                ctx.globalAlpha = glowAlpha * 0.1;
                ctx.beginPath();
                ctx.arc(s.currX, s.currY, s.size * CONFIG.stars.glowSizeFactor * accuracy, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // Process and draw each star
    for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        
        // Apply movement when the lens is rotating
        if (movement > 0.01) {
            s.driftX += (Math.random() - 0.5) * movement * CONFIG.stars.movementStrength;
            s.driftY += (Math.random() - 0.5) * movement * CONFIG.stars.movementStrength;
            const d = Math.hypot(s.originX + s.driftX, s.originY + s.driftY);
            if (d > radius) {
                const f = radius / d;
                s.driftX *= f; s.driftY *= f;
            }
        }

        const baseX = s.originX + s.driftX;
        const baseY = s.originY + s.driftY;
        let targetX = baseX, targetY = baseY;
        let isCurrentSymbolStar = (s.lensIndex === activeLens);

        // Snap stars to symbol points based on alignment accuracy
        if (isCurrentSymbolStar && accuracy > 0) {
            const points = symbolPoints[activeLens];
            if (points?.length > 0) {
                const p = points[i % points.length];
                targetX = Utils.lerp(baseX, p.x, accuracy);
                targetY = Utils.lerp(baseY, p.y, accuracy);
            }
        }

        s.currX += (targetX - s.currX) * CONFIG.stars.snapLerp;
        s.currY += (targetY - s.currY) * CONFIG.stars.snapLerp;

        const twinkle = Math.sin(time * s.twinkleSpeed + s.phase) * CONFIG.stars.twinkle.factorA + CONFIG.stars.twinkle.factorB;
        let color = CONFIG.stars.unsolvedColor;
        let sizeBoost = 1.0;
        let alpha = 0.5 * twinkle;

        if (isCurrentSymbolStar) {
            sizeBoost = 1 + (accuracy * 0.8);
            alpha = (0.5 + accuracy * 0.5) * twinkle;
            color = "#ffffff";
        } else if (isSolved) {
            alpha *= 0.5; // Dim non-active stars when puzzle is solved
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        Renderer.drawStarShape(ctx, s.currX, s.currY, s.size * sizeBoost, s.shape);
        ctx.globalAlpha = 1;
    }
    ctx.restore();
}

/**
 * Renders hidden symbols to an offscreen canvas to sample point data.
 */
async function sampleSymbols(lenses, innerRadius) {
    const offscreen = document.createElement("canvas");
    const octx = offscreen.getContext("2d", { willReadFrequently: true });
    const size = 300;
    offscreen.width = size;
    offscreen.height = size;

    symbolPoints = lenses.map((l) => {
        octx.clearRect(0, 0, size, size);
        octx.fillStyle = "white";
        octx.font = `bold ${size * 0.5}px "LensSymbols", serif`;
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillText(l.symbol || "?", size / 2, size / 2);

        const imageData = octx.getImageData(0, 0, size, size).data;
        const points = [];
        const scale = innerRadius * CONFIG.stars.symbolSamplingScale;
        const step = CONFIG.stars.symbolSamplingDensity;
        
        for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
                if (imageData[(y * size + x) * 4 + 3] > 128) {
                    points.push({ x: (x - size / 2) * scale, y: (y - size / 2) * scale });
                }
            }
        }
        return points;
    });
}

/**
 * Creates the initial randomized star field.
 */
function createStars(w, h) {
    const stars = [];
    const radius = Math.min(w, h) * CONFIG.telescope.innerRadiusFactor;

    for (let i = 0; i < CONFIG.stars.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        const lensGroup = Math.random() < CONFIG.stars.groupPercentage ? (i % CONFIG.lenses.length) : -1;

        stars.push({
            lensIndex: lensGroup,
            originX: Math.cos(angle) * r,
            originY: Math.sin(angle) * r,
            driftX: 0,
            driftY: 0,
            size: Math.random() * (CONFIG.stars.maxSize - CONFIG.stars.minSize) + CONFIG.stars.minSize,
            twinkleSpeed: CONFIG.stars.twinkle.min + Math.random() * (CONFIG.stars.twinkle.max - CONFIG.stars.twinkle.min),
            phase: Math.random() * Math.PI * 2,
            shape: CONFIG.stars.shapes[Math.floor(Math.random() * CONFIG.stars.shapes.length)],
            currX: Math.cos(angle) * r,
            currY: Math.sin(angle) * r
        });
    }
    return stars;
}