import * as d3 from "npm:d3";
import {
  buildRadialPresenceData,
  filterUniversalTruthRows,
  SONYC_COARSE_LABELS
} from "../sonycData.js";
import {createFlagshipColorScale} from "./colorScale.js";

const transitionMs = 100;
// Stacked rings no longer overlap, so a high baseline opacity keeps each
// ring's color distinct instead of the washed-out look transparency needs
// for overlapping areas.
const defaultOpacity = 0.75;
const areaStrokeWidth = 0.5;
const ringStrokeWidth = 0.5;
const lightFillLuminanceThreshold = 0.6;
const chartMaxWidth = 640; // matches the theme's max text width so charts align with body copy

let selectedCategory = null;

// MD USAGE:
// ```js
// import {renderRadialPresenceChart} from "./components/chart2.js";
// import {buildRadialPresenceData, filterUniversalTruthRows} from "../sonycData.js";
// const rows = await FileAttachment("data/data.csv").csv();
// const radial = buildRadialPresenceData(filterUniversalTruthRows(rows));
// display(renderRadialPresenceChart({data: radial, width}));
// ```
export const renderRadialPresenceChart = ({
  data,
  width = 928,
  heading = "Commuter City",
  subheading = "How often the sounds from each coarse-grained category were recorded, by time of day.",
  footnote = "Source: Sounds of New York City Urban Sound Tagging (SONYC-UST) dataset, version 2.4.",
  // Back-end control for stack order: "ascending" stacks the smallest total
  // innermost/bottom and the largest outermost/top; "descending" reverses it.
  stackOrder = "ascending"
} = {}) => {
  let radialData;
  if (Array.isArray(data)) {
    radialData = buildRadialPresenceData(filterUniversalTruthRows(data));
  } else if (data && Array.isArray(data.processedData)) {
    radialData = data;
  } else {
    throw new Error("This chart requires either CSV rows or preprocessed radial data.");
  }

  const {processedData, sortedCategories, labelsByCategory = SONYC_COARSE_LABELS} = radialData;
  const displayCategoryName = (name) => String(name ?? "");

  const chartWidth = Math.min(chartMaxWidth, Math.max(360, width));
  const chartHeight = chartWidth;
  const margin = 5;
  const fixedInnerRadius = chartWidth / 5.5;
  const fixedOuterRadius = chartWidth / 2 - margin;

  // Smallest-total-first ordering, reused both for the stack and the color
  // progression so the rings read as a smooth gradient from center to edge.
  const ascendingCategories = [...sortedCategories].reverse();
  const stackCategories = stackOrder === "descending" ? sortedCategories : ascendingCategories;
  const colorScheme = createFlagshipColorScale(stackCategories);

  // A ring's stroke borrows the color of the ring stacked just below/inside
  // it, so the boundary reads as a continuation of that ring; the innermost
  // ring has nothing below it, so it strokes with its own color.
  const ringStrokeColorFor = (categoryKey) => {
    const idx = stackCategories.indexOf(categoryKey);
    const belowKey = idx > 0 ? stackCategories[idx - 1] : categoryKey;
    return colorScheme(belowKey);
  };

  const container = d3.create("figure")
    .attr("class", "radial-presence-chart")
    .style("--radial-chart-max-width", `${chartWidth}px`);

  const header = container.append("header").attr("class", "chart-header");
  header.append("h3").text(heading);
  header.append("p").text(subheading);

  const legend = container.append("div").attr("class", "radial-presence-chart__legend");

  const x = d3.scaleLinear().domain([0, 24]).range([0, 2 * Math.PI]);

  const luminanceOf = (color) => (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;

  const strokeForCategory = (cat) => {
    const base = d3.color(colorScheme(cat));
    return base ? base.darker(0.45).toString() : "rgba(0,0,0,0.35)";
  };

  const textColorForCategory = (cat) => {
    const base = d3.color(colorScheme(cat));
    if (!base) return "#111";
    return luminanceOf(base) > lightFillLuminanceThreshold ? "#111" : "#111";
  };

  const svg = container
    .append("svg")
    .attr("class", "radial-presence-chart__svg")
    .attr("viewBox", [-chartWidth / 2, -chartHeight / 2, chartWidth, chartHeight])
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("role", "img")
    .attr("aria-label", "Radial chart of sound category presence by hour");

  const tooltip = container.append("div").attr("class", "radial-presence-chart__tooltip");

  const areaGroup = svg.append("g");
  const gridGroup = svg.append("g");

  const centerTextGroup = svg
    .append("g")
    .attr("class", "radial-presence-chart__center")
    .attr("pointer-events", "none")
    .attr("opacity", 0);

  const formatCount = d3.format(",d");

  const hourFromPointer = (event) => {
    const [pointerX, pointerY] = d3.pointer(event, svg.node());
    const angle = (Math.atan2(pointerY, pointerX) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    return Math.round(x.invert(angle)) % 24;
  };
  const tooltipText = (hour, count) => {
    const row = (label, value) => `<div class="tooltip-row"><span class="tooltip-label">${label}</span><strong class="tooltip-value">${value}</strong></div>`;
    return row("Hour", hour) + row("Count", formatCount(count));
  };

  function showTooltip(event, categoryKey) {
    const hour = hourFromPointer(event);
    const row = processedData[hour];
    const count = row?.[categoryKey] ?? 0;
    const categoryName = displayCategoryName(labelsByCategory[categoryKey] ?? categoryKey);
    const [pointerX, pointerY] = d3.pointer(event, container.node());

    tooltip
      .style("transform", `translate(${pointerX + 14}px, ${pointerY + 14}px)`)
      .style("opacity", 1)
      .html(tooltipText(hour, count));
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  svg
    .on("mousemove", (event) => {
      if (selectedCategory) showTooltip(event, selectedCategory);
    })
    .on("mouseleave", () => {
      hideTooltip();
    });

  const wrapCenterText = (textString, totalCount, categoryKey) => {
    centerTextGroup.selectAll("*").remove();
    const accentColor = categoryKey ? colorScheme(categoryKey) : "var(--theme-foreground)";

    const words = String(textString ?? "").split(/\s+/).filter(Boolean);
    const lines = [];
    let currentLine = [];

    words.forEach((word) => {
      if (currentLine.join(" ").length + word.length > 14 && currentLine.length > 0) {
        lines.push(currentLine.join(" "));
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });

    if (currentLine.length > 0) lines.push(currentLine.join(" "));

    const lineHeight = 16;
    const totalLinesCount = lines.length + 1;
    // Offsets the starting Y baseline so the multi-line block remains perfectly centered
    const startY = -((totalLinesCount - 1) * lineHeight) / 2 + 4;

    lines.forEach((lineText, index) => {
      centerTextGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", startY + index * lineHeight)
        .attr("fill", "var(--theme-foreground, #111)")
        .style("font-size", "15px")
        .style("font-weight", "700")
        //.style("text-transform", "capitalize")
        .text(lineText);
    });
    centerTextGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", startY + lines.length * lineHeight)
      .attr("fill", "var(--theme-foreground, #111)")
      .style("font-size", "12px")
      .style("font-weight", "400")
      .text(`${formatCount(totalCount)}`);
  }



  function handleHover(categoryKey, labelText, valueTotal) {
    wrapCenterText(labelText, valueTotal, categoryKey);

    centerTextGroup.interrupt().transition().duration(transitionMs).attr("opacity", 0.8);

    areaGroup
      .selectAll(".area-path")
      .interrupt()
      .transition()
      .duration(transitionMs)
      .attr("opacity", (s) => (s.key === categoryKey ? 1 : defaultOpacity * 0.35))
      .attr("stroke-width", ringStrokeWidth);

    legend
      .selectAll(".radial-presence-chart__legend-item")
      .interrupt()
      .transition()
      .duration(transitionMs)
      .style("background", (cat) => (cat === categoryKey ? "rgba(127,127,127,0.14)" : "transparent"))
      .style("border-color", (cat) => (cat === categoryKey ? strokeForCategory(cat) : "transparent"))
      .style("opacity", (cat) => (cat === categoryKey ? 1 : 0.5));
  }

  function clearHover() {
    centerTextGroup.interrupt().transition().duration(transitionMs).attr("opacity", 0);

    areaGroup
      .selectAll(".area-path")
      .interrupt()
      .transition()
      .duration(transitionMs)
      .attr("opacity", defaultOpacity)
      .attr("stroke-width", ringStrokeWidth);

    legend
      .selectAll(".radial-presence-chart__legend-item")
      .interrupt()
      .transition()
      .duration(transitionMs)
      .style("background", "transparent")
      .style("border-color", "transparent")
      .style("opacity", 1);
  }

  function handleMouseLeave() {
    if (selectedCategory) return;

    centerTextGroup.interrupt().transition().duration(transitionMs).attr("opacity", 0);

    areaGroup
      .selectAll(".area-path")
      .interrupt()
      .transition()
      .duration(transitionMs)
      .attr("opacity", defaultOpacity)
      .attr("stroke-width", ringStrokeWidth);

    legend
      .selectAll(".radial-presence-chart__legend-item")
      .interrupt()
      .transition()
      .duration(transitionMs)
      .style("background", "transparent")
      .style("border-color", "transparent")
      .style("opacity", 1);
  }

  function toggleCategory(categoryKey) {
    selectedCategory = selectedCategory === categoryKey ? null : categoryKey;

    if (!selectedCategory) {
      clearHover();
      hideTooltip();
      return;
    }

    const selectedName = displayCategoryName(labelsByCategory[selectedCategory] ?? selectedCategory);
    const selectedTotal = d3.sum(processedData, (row) => row[selectedCategory] ?? 0);
    handleHover(selectedCategory, selectedName, selectedTotal);
  }

  const legendItems = legend
    .selectAll(".radial-presence-chart__legend-item")
    .data(sortedCategories)
    .join("div")
    .attr("class", "radial-presence-chart__legend-item")
    .on("click", (event, cat) => {
      event.stopPropagation();
      toggleCategory(cat);
    })
    .on("mouseenter", (_event, cat) => {
      if (selectedCategory) return;
      const totalSum = d3.sum(processedData, (row) => row[cat] ?? 0);
      handleHover(cat, displayCategoryName(labelsByCategory[cat] ?? cat), totalSum);
    })
    .on("mouseleave", () => {
      if (selectedCategory) return;
      handleMouseLeave();
    });

  legendItems.append("span").text((cat) => displayCategoryName(labelsByCategory[cat] ?? cat));

  const stackGenerator = d3
    .stack()
    .keys(stackCategories)
    .value((row, key) => row[key] ?? 0)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
  const series = stackGenerator(processedData);
  const maxStackTotal = d3.max(series, (s) => d3.max(s, (d) => d[1])) ?? 1;

  const y = d3.scaleLinear().domain([0, maxStackTotal]).range([fixedInnerRadius, fixedOuterRadius]);

  const area = d3
    .areaRadial()
    .curve(d3.curveLinearClosed)
    .angle((d) => x(d.data.hour))
    .innerRadius((d) => y(d[0]))
    .outerRadius((d) => y(d[1]));

  areaGroup
    .selectAll("path")
    .data(series, (s) => s.key)
    .join("path")
    .attr("class", "area-path")
    .attr("fill", (s) => colorScheme(s.key))
    .attr("stroke", (s) => ringStrokeColorFor(s.key))
    .attr("stroke-width", ringStrokeWidth)
    .attr("opacity", defaultOpacity)
    .attr("d", area)
    .on("click", (event, s) => {
      event.stopPropagation();
      toggleCategory(s.key);
    })
    .on("mouseenter", (event, s) => {
      const activeCategory = selectedCategory ?? s.key;
      const cleanName = displayCategoryName(labelsByCategory[activeCategory] ?? activeCategory);
      const totalSum = d3.sum(processedData, (row) => row[activeCategory] ?? 0);
      handleHover(activeCategory, cleanName, totalSum);
      showTooltip(event, activeCategory);
    })
    .on("mousemove", (event, s) => {
      showTooltip(event, selectedCategory ?? s.key);
    })
    .on("mouseleave", () => {
      if (!selectedCategory) {
        handleMouseLeave();
        hideTooltip();
      }
    });

  const hourTicks = d3.range(0, 24);
  const radialAxis = gridGroup.append("g").selectAll("g").data(hourTicks).join("g");

  radialAxis
    .append("path")
    .attr("stroke", "currentColor")
    .attr("stroke-width", areaStrokeWidth)
    .attr("stroke-opacity", 0.1)
    .attr(
      "d",
      (d) => `M ${d3.pointRadial(x(d), fixedInnerRadius)} L ${d3.pointRadial(x(d), fixedOuterRadius)}`
    );

  radialAxis
    .append("text")
    .attr("class", "radial-presence-chart__x-label")
    .attr("transform", (d) => {
      const angle = x(d) - Math.PI / 2;
      const radius = fixedInnerRadius - 16;
      return `translate(${Math.cos(angle) * radius}, ${Math.sin(angle) * radius})`;
    })
    .attr("text-anchor", (d) => {
      const angle = x(d);
      if (angle === 0 || angle === Math.PI) return "middle";
      return angle < Math.PI ? "end" : "start";
    })
    .attr("dy", "0.35em")
    .style("font-size", "11px")
    .style("font-weight", "400")
    .style("fill", (d) => d % 6 === 0 ? "var(--theme-foreground)" : "var(--theme-foreground-muted, #666)")
    .text((d) => {
      if (d === 0) return "12 AM";
      if (d === 12) return "12 PM";
      if (d === 6) return "6 AM";
      if (d === 18) return "6 PM";
      return d % 3 === 0 ? `${d}` : ""; // Shows intermediate numbers every 3 hours, hides the rest
    });


  const rings = gridGroup.append("g")
    .attr("text-anchor", "middle")
    .selectAll("g")
    .data(y.ticks(4))
    .join("g");

  rings
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-width", areaStrokeWidth)
    .attr("stroke-opacity", 0.12)
    .attr("r", y);

  rings
    .append("text")
    .filter((d) => d !== 0)
    .attr("class", "radial-presence-chart__y-label")
    .attr("x", (d) => -y(d))
    .attr("dy", "0.35em")
    .attr("stroke", "var(--theme-background)")
    .attr("stroke-width", 4)
    .attr("paint-order", "stroke")
    .text((d) => d);

  if (footnote) {
    container
      .append("figcaption")
      .attr("class", "chart-footnote")
      .text(footnote);
  }

  return container.node();
};
