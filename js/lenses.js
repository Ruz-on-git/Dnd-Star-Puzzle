/**
 * Generates the lens data based on the configuration.
 * @param {Object} config - The global CONFIG object.
 * @returns {Array} Array of lens objects.
 */
function createLenses(config) {
    const step = 360 / config.telescope.sides;

    return config.lenses.map((l, i) => {
        const nebulaBlobs = [];
        const range = 1000; 

        // Generate random nebula particles for each lens
        for (let j = 0; j < config.nebula.blobsPerLens; j++) {
            nebulaBlobs.push({
                x: (Math.random() - 0.5) * range,
                y: (Math.random() - 0.5) * range,
                radius: (Math.random() * (config.nebula.maxRadiusFactor - config.nebula.minRadiusFactor) + config.nebula.minRadiusFactor) * 400,
                color: l.nebulaColors[Math.floor(Math.random() * l.nebulaColors.length)],
                phase: Math.random() * Math.PI * 2
            });
        }

        return {
            angle: 0,
            targetAngle: 0,
            correct: ((l.targetFace - 1) * step) % 360,
            name: l.name || `Lens ${i + 1}`,
            color: l.color,
            symbol: l.symbol || "?",
            nebula: nebulaBlobs,
            constellationName: l.constellationName,
            skeleton: l.skeleton
        };
    });
}