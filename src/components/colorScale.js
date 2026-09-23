import * as d3 from "npm:d3";

// Flagship brand colors shared by every chart on the site.
export const FLAGSHIP_BLUE = "#2561ba";
export const FLAGSHIP_RED = "#bd4639";

// Builds an ordinal color scale over `domain`, interpolating in HCL space
// between the two flagship colors so every chart derives its palette the
// same way instead of hand-picking hex values per component.
export function createFlagshipColorScale(domain, {reverse = false} = {}) {
  const [start, end] = reverse ? [FLAGSHIP_RED, FLAGSHIP_BLUE] : [FLAGSHIP_BLUE, FLAGSHIP_RED];
  const range = d3.quantize(d3.interpolateHcl(start, end), Math.max(domain.length, 2));
  return d3.scaleOrdinal(domain, range);
}

// Sequential scale (near-white -> flagship blue) for magnitude encodings like heatmaps,
// so every chart's "intensity" reads consistently with the ordinal chart palette above.
export function createFlagshipSequentialScale(maxValue) {
  return d3.scaleSequential([0, maxValue], d3.interpolateHcl("#eef2fb", FLAGSHIP_BLUE));
}
