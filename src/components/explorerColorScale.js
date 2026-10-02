import {SONYC_COARSE_CATEGORIES} from "../sonycData.js";
import {createFlagshipColorScale} from "./colorScale.js";

// The ONE color scale both charts use. Domain order is fixed to
// SONYC_COARSE_CATEGORIES — never to a sorted-by-value order like
// chart2's old `sortedCategories` — so a category's color never shifts
// depending on the data or on which chart is rendering it.
export const explorerColorScale = createFlagshipColorScale(SONYC_COARSE_CATEGORIES);

export const categoryColor = (categoryKey) => explorerColorScale(categoryKey);
