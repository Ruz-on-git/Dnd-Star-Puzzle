const Renderer = {
    /**
     * Draws a single star shape based on its type.
     */
    drawStarShape(ctx, x, y, size, shape) {
        ctx.beginPath();
        switch (shape) {
            case "sparkle":
                for (let i = 0; i < 8; i++) {
                    const r = i % 2 === 0 ? size * 2.2 : size * 0.5;
                    const a = (i * Math.PI) / 4;
                    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
                }
                break;
            case "diamond":
                ctx.moveTo(x, y - size * 1.5);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size * 1.5);
                ctx.lineTo(x - size, y);
                break;
            case "hexagon":
                for (let i = 0; i < 6; i++) {
                    const a = (i * Math.PI * 2) / 6;
                    ctx.lineTo(x + Math.cos(a) * size * 1.2, y + Math.sin(a) * size * 1.2);
                }
                break;
            default:
                ctx.arc(x, y, size, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill();
    },

    /**
     * Draws the nebula background for the active lens.
     */
    drawNebula(ctx, time, activeL, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((activeL.angle * CONFIG.nebula.driftFactor) * Math.PI / 180);
        ctx.globalCompositeOperation = "screen"; 

        activeL.nebula.forEach(n => {
            const breath = Math.sin(time * CONFIG.nebula.breathingSpeed + n.phase) * CONFIG.nebula.breathingIntensity;
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius + breath);
            grad.addColorStop(0, n.color);
            grad.addColorStop(0.6, n.color + "44"); 
            grad.addColorStop(1, "rgba(0,0,0,0)");

            ctx.globalAlpha = CONFIG.nebula.opacity;
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius + breath, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    },

    /**
     * Draws the lens shape for the telescope UI.
     */
    drawTelescope(ctx, isSolved, activeLensIdx, lenses, w, h, cx, cy) {
        const l = lenses[activeLensIdx];
        const { sides, innerRadiusFactor, outerRadiusFactor } = CONFIG.telescope;
        const outerR = Math.min(w, h) * outerRadiusFactor;
        const innerR = Math.min(w, h) * innerRadiusFactor;
        const faceStep = (Math.PI * 2) / sides;

        ctx.save();
        ctx.translate(cx, cy);

        // Aperture Mask
        ctx.beginPath();
        const maskSize = Math.max(w, h) * 2;
        ctx.rect(-maskSize/2, -maskSize/2, maskSize, maskSize);
        ctx.moveTo(innerR, 0); 
        ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
        ctx.fillStyle = "#000";
        ctx.fill();

        // Mechanical Body
        ctx.save();
        ctx.rotate(l.angle * Math.PI / 180);
        const grad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
        grad.addColorStop(0, CONFIG.telescope.bodyGradient[0]);
        grad.addColorStop(1, CONFIG.telescope.bodyGradient[1]);
        
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const a = i * faceStep - Math.PI / 2;
            const px = Math.cos(a) * outerR;
            const py = Math.sin(a) * outerR;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.moveTo(innerR, 0); 
        ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
        ctx.fillStyle = grad;
        ctx.fill();

        // Rim and Numbers
        ctx.strokeStyle = CONFIG.telescope.rimColor;
        ctx.lineWidth = CONFIG.telescope.rimWidth;
        ctx.stroke();

        ctx.font = `bold ${CONFIG.telescope.numberFontSize}px serif`;
        ctx.textAlign = "center";
        for (let i = 0; i < sides; i++) {
            const a = i * faceStep - Math.PI / 2;
            ctx.save();
            ctx.translate(Math.cos(a) * (outerR - CONFIG.telescope.numberPadding), Math.sin(a) * (outerR - CONFIG.telescope.numberPadding));
            ctx.rotate(a + Math.PI / 2);
            ctx.fillStyle = CONFIG.telescope.numberColor;
            ctx.fillText(i + 1, 0, 5);
            ctx.restore();
        }
        ctx.restore();
        ctx.restore();
    }
};