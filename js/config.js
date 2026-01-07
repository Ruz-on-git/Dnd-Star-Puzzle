const CONFIG = {
    nebula: {
        blobsPerLens: 16,
        minRadiusFactor: 0.4, 
        maxRadiusFactor: 0.6,
        opacity: 0.15,
        driftFactor: 0.05,
        breathingSpeed: 0.001,
        breathingIntensity: 30
    },
    stars: {
        count: 1800,
        minSize: 0.6,
        maxSize: 1.8,
        groupPercentage: 1.0,
        twinkle: { min: 0.0008, max: 0.0012, factorA: 0.4, factorB: 0.6 },
        discoveryRange: 360,
        shapes: ["circle", "sparkle", "diamond", "hexagon"],
        solvedColor: "#ffffff",
        unsolvedColor: "#eef2ff",
        bgSolvedColor: "rgba(255, 255, 255, 0.3)",
        symbolSamplingScale: 0.008,
        symbolSamplingDensity: 4,
        snapLerp: 0.15,
        movementStrength: 3.0,
        glowIntensity: 2.5,
        glowThreshold: 0.8,
        glowSizeFactor: 8
    },
    rotation: { 
        snapTolerance: 3, 
        lerpSpeed: 0.08 
    },
    telescope: {
        sides: 9,
        innerRadiusFactor: 0.32,
        outerRadiusFactor: 0.46,
        rimWidth: 3,
        rimColor: "#c7a15a",
        bodyGradient: ["#2a1b10", "#0a0805"],
        numberColor: "#d4b46f",
        numberFontSize: 14,
        numberPadding: 22,
        innerGlowWidth: 2
    },
    lenses: [
        { 
            name: "Navy", targetFace: 4, symbol: "A", color: "#3282ff", 
            constellationName: "Iso",
            nebulaColors: ["#001f3f", "#0074d9", "#7fdbff"],
            skeleton: {
                points: [[0.51, 0.48], [0.35, 0.16], [0.71, 0.47], [0.27, 0.47], [0.37, 0.79], [0.69, 0.77]],
                lines: [[0,1], [0,2], [0,3], [0,4], [0,5]]
            }
        },
        { 
            name: "Orange", targetFace: 1, symbol: "B", color: "#ff851b", 
            constellationName: "Uolmar",
            nebulaColors: ["#ff4136", "#ff851b", "#ffdc00"],
            skeleton: {
                points: [[0.51, 0.05], [0.51, 0.21], [0.70, 0.44], [0.32, 0.44], [0.51, 0.70], [0.51, 0.95]],
                lines: [[0,1], [1,2], [1,3], [2,4], [3,4], [4,5]]
            }
        },
        { 
            name: "White", targetFace: 8, symbol: "C", color: "#ffffff", 
            constellationName: "Aneat",
            nebulaColors: ["#dddddd", "#aaaaaa", "#ffffff"],
            skeleton: {
                points: [[0.75, 0.55], [0.72, 0.70], [0.52, 0.95], [0.25, 0.61], [0.36, 0.4], [0.55, 0.25], [0.50, 0.10], [0.53, 0.44], [0.49, 0.56], [0.52, 0.66]],
                lines: [[0,1], [1,2], [2,3], [3,4],[4,5],[5,6],[5,7],[7,8], [8,9]]
            }
        },
        { 
            name: "Red", targetFace: 5, symbol: "I", color: "#ff4136", 
            constellationName: "Onisix",
            nebulaColors: ["#85144b", "#ff4136", "#3d9970"],
            skeleton: {
                points: [[0.72, 0.05], [0.47, 0.10], [0.25, 0.33], [0.20, 0.58], [0.42, 0.90], [0.65, 0.92], [0.83, 0.64], [0.72, 0.44], [0.56, 0.42], [0.47, 0.50]],
                lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]]
            }
        },
        { 
            name: "Cyan", targetFace: 2, symbol: "G", color: "#7fdbff", 
            constellationName: "Elth",
            nebulaColors: ["#39cccc", "#2ecc40", "#01ff70"],
            skeleton: {
                points: [[0.62, 0.92], [0.42, 0.95], [0.35, 0.75], [0.45, 0.59], [0.59, 0.52], [0.75, 0.25], [0.51, 0.07], [0.30, 0.16], [0.24, 0.36], [0.40, 0.47]],
                lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,4]]
            }
        }
    ]
};