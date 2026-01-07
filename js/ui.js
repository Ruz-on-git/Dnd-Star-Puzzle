/**
 * Updates the side-panel UI with lens status.
 * @param {Element} container - The DOM element to inject HTML into.
 * @param {Array} lenses - The lens data.
 * @param {number} activeIdx - Current active lens index.
 * @param {Array} menuOrder - The randomized order of the menu.
 */
function updateLensUI(container, lenses, activeIdx, menuOrder) {
    if (!menuOrder) return;
    const sides = CONFIG.telescope.sides;
    
    container.innerHTML = menuOrder.map((lensIndex) => {
        const l = lenses[lensIndex];
        const isSolved = Utils.getShortestDist(l.angle, l.correct) < CONFIG.rotation.snapTolerance;
        const step = 360 / sides;
        const face = (sides - (Math.round(l.angle / step) % sides)) % sides + 1;
        
        return `
          <div class="lens-row ${activeIdx === lensIndex ? 'active' : ''} ${isSolved ? 'solved' : ''}" 
               style="border-left: 4px solid ${l.color}">
            <div style="display:flex; flex-direction:column">
              <span style="font-weight:600; font-size:13px; color: ${activeIdx === lensIndex ? '#fff' : l.color}">${l.name}</span>
            </div>
            <span class="face-indicator" style="color: ${l.color}">F-${face}</span>
          </div>`;
    }).join('') + 
    `<div style="margin-top:20px; text-align:center; font-size:10px; opacity:0.5; letter-spacing:1px;">
       PRESS [M] FOR STAR MAP
     </div>`;
}