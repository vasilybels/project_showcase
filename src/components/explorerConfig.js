// Shared visual/interaction constants for the sound explorer.
// Both chart components should import from here instead of keeping
// their own (previously divergent) copies of these values.

export const transitionMs = 150;
export const defaultOpacity = 0.75;

// chart1 dimmed non-hovered nodes to defaultOpacity * 0.2, chart2 used
// * 0.35. Splitting the difference here so hover feels the same in both.
export const hoverDimRatio = 0.25;

export const chartMaxWidth = 640;
export const chartMinWidth = 340; // chart1 used 320, chart2 used 360 — picked one
export const lightFillLuminanceThreshold = 0.6;

export const luminanceOf = (color) =>
  (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
