const Utils = {
    /**
     * Calculates the shortest angular distance between two degrees (0-360).
     * @param {number} a - Current angle.
     * @param {number} b - Target angle.
     * @returns {number} Shortest distance in degrees.
     */
    getShortestDist(a, b) {
        let diff = Math.abs(a - b) % 360;
        return diff > 180 ? 360 - diff : diff;
    },

    /**
     * Linear interpolation between two values.
     * @param {number} a - Start value.
     * @param {number} b - End value.
     * @param {number} t - Interpolation factor (0 to 1).
     * @returns {number} Interpolated value.
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
};