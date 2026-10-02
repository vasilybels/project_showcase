import * as d3 from "npm:d3";
import {renderBubbleChart} from "./chart1.js";
import {renderRadialPresenceChart} from "./chart2.js";
import {createSelectionStore} from "./explorerState.js";
import {buildExplorerData} from "./explorerData.js";

// MD USAGE:
// ```js
// import {renderExplorer} from "./components/explorer.js";
// const rows = await FileAttachment("data/data.csv").csv();
// display(renderExplorer({rawRows: rows, width}));
// ```
export function renderExplorer({rawRows, width = 1400} = {}) {
  const selection = createSelectionStore();
  const {hierarchy, radial} = buildExplorerData(rawRows);

  const container = d3.create("div").attr("class", "sound-explorer");
  const row = container.append("div").attr("class", "sound-explorer__row");

  const bubbleSlot = row.append("div").attr("class", "sound-explorer__bubble");
  const radialSlot = row.append("div").attr("class", "sound-explorer__radial");

  const bubbleWidth = Math.min(width * 0.55, 640);
  const radialWidth = Math.min(width * 0.4, 640);

  const bubbleNode = renderBubbleChart({data: hierarchy, width: bubbleWidth});
  const radialNode = renderRadialPresenceChart({data: radial, width: radialWidth});

  bubbleSlot.node().appendChild(bubbleNode);
  radialSlot.node().appendChild(radialNode);

  // --- Wiring: both charts read/write ONE selection store instead of
  // tracking highlight state independently (chart2's old module-level
  // `let` couldn't have supported this at all). This assumes chart1 and
  // chart2 each emit an "explorer:categoryClick" custom event on click,
  // and listen for "explorer:select" to drive their own dim/highlight —
  // see the two TODOs below for the small signature change each needs.
  selection.subscribe((selectedCategory) => {
    d3.select(bubbleNode).dispatch("explorer:select", {detail: selectedCategory});
    d3.select(radialNode).dispatch("explorer:select", {detail: selectedCategory});
  });

  d3.select(bubbleNode).on("explorer:categoryClick", (event) => selection.set(event.detail));
  d3.select(radialNode).on("explorer:categoryClick", (event) => selection.set(event.detail));

  return container.node();
}

// TODO in chart1.js: swap the direct hover()/resetHover() calls on
// mouseenter/mouseleave for a dispatch("explorer:categoryClick", ...) on
// click (topAncestorCategory(d) as the detail), plus a listener for
// "explorer:select" that drives the same dim/highlight currently only
// reachable via local hover. Also point its color lookups at
// explorerColorScale instead of its own createFlagshipColorScale(...) call.
//
// TODO in chart2.js: delete the module-level `selectedCategory` and
// toggleCategory(), replace with the same dispatch/listen pair, and — same
// as chart1 — swap its local color scale for the shared explorerColorScale
// so stack order no longer affects hue assignment.
