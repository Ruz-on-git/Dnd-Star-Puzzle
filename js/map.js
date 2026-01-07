const mapOverlay = document.createElement('div');
mapOverlay.id = "star-map";
document.body.appendChild(mapOverlay);

let mapVisible = false;

/**
 * Toggles the visibility of the Star Map overlay.
 */
function toggleMap() {
    if (!window.lenses) return;
    mapVisible = !mapVisible;
    mapOverlay.style.display = mapVisible ? 'flex' : 'none';
    if (mapVisible) renderMap();
}

/**
 * Renders the constellation map based on lens progress.
 */
function renderMap() {
    const lensesArr = window.lenses;
    const isAllSolved = lensesArr.every(l => Utils.getShortestDist(l.angle, l.correct) < CONFIG.rotation.snapTolerance);
    
    mapOverlay.innerHTML = `
        <h1>Star Map</h1>
        <div class="map-container">
            ${lensesArr.map((l, i) => {
                const solved = Utils.getShortestDist(l.angle, l.correct) < CONFIG.rotation.snapTolerance;
                const nameColor = solved ? l.color : "#4a3b2a";
                
                let displayName = l.constellationName || "Unknown";
                if (isAllSolved && displayName.length >= 2) {
                    // Underline the first two letters if the full puzzle is solved
                    displayName = `<span style="text-decoration: underline; text-underline-offset: 4px;">${displayName.slice(0,2)}</span>${displayName.slice(2)}`;
                }

                return `
                    <div class="scroll-wrap">
                        <div style="text-align: center;">
                            <canvas id="const-canvas-${i}" width="150" height="150"></canvas>
                            <div class="constellation-name" style="color: ${nameColor};">
                                ${displayName}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="map-footer">PRESS 'M' TO CLOSE MAP</div>
    `;

    // Draw individual constellation skeletons onto the map canvases
    lensesArr.forEach((l, i) => {
        const canvas = document.getElementById(`const-canvas-${i}`);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const solved = Utils.getShortestDist(l.angle, l.correct) < CONFIG.rotation.snapTolerance;
        
        ctx.clearRect(0,0,150,150);

        // Draw background rune symbol lightly
        ctx.save();
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = `bold 120px "LensSymbols", serif`;
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillText(l.symbol || "?", 75, 75);
        ctx.restore();

        if (!l.skeleton || !l.skeleton.points) return;

        ctx.strokeStyle = solved ? l.color : "rgba(60, 40, 20, 0.3)";
        ctx.fillStyle = solved ? "#fff" : "rgba(60, 40, 20, 0.6)";
        ctx.lineWidth = 1.5;
        
        const pad = 20;
        const drawArea = 110;

        // Draw connecting lines
        if (l.skeleton.lines) {
            ctx.setLineDash([3, 5]);
            l.skeleton.lines.forEach(pair => {
                const p1 = l.skeleton.points[pair[0]];
                const p2 = l.skeleton.points[pair[1]];
                if (p1 && p2) {
                    ctx.beginPath();
                    ctx.moveTo(pad + p1[0] * drawArea, pad + p1[1] * drawArea);
                    ctx.lineTo(pad + p2[0] * drawArea, pad + p2[1] * drawArea);
                    ctx.stroke();
                }
            });
        }

        // Draw stars/points
        ctx.setLineDash([]);
        l.skeleton.points.forEach(p => {
            const px = pad + p[0] * drawArea;
            const py = pad + p[1] * drawArea;
            ctx.beginPath();
            ctx.arc(px, py, solved ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fill();

            if (solved) {
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = l.color;
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.restore();
            }
        });
    });
}

window.toggleMap = toggleMap;