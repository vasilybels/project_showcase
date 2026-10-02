import {
  buildBubbleHierarchy,
  buildRadialPresenceData,
  filterUniversalTruthRows
} from "../sonycData.js";

// One entry point that turns raw rows into BOTH chart shapes, so a single
// top-level filter (date range, borough, etc.) updates both views from the
// same source data instead of each chart re-deriving its own input.
export function buildExplorerData(rawRows, {dateRange, borough} = {}) {
  let rows = filterUniversalTruthRows(rawRows);

  if (dateRange) {
    rows = rows.filter((r) => r.date >= dateRange[0] && r.date <= dateRange[1]);
  }
  if (borough) {
    rows = rows.filter((r) => r.borough === borough);
  }

  return {
    hierarchy: buildBubbleHierarchy(rows),
    radial: buildRadialPresenceData(rows),
    rowCount: rows.length
  };
}
