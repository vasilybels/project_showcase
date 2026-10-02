import * as d3 from "npm:d3";
import {createFlagshipSequentialScale} from "./colorScale.js";

const chartMaxWidth = 640;
const marginLeft = 0;
const marginTop = 6;
const marginBottom = 28;
const legendHeight = 34;
const cellGap = 2;

// MD USAGE:
// ```js
// import {renderDayHourHeatmap} from "./components/chart3.js";
// import {buildDayHourPresence, filterUniversalTruthRows} from "../sonycData.js";
// const rows = await FileAttachment("data/data.csv").csv();
// const heatmap = buildDayHourPresence(filterUniversalTruthRows(rows), "5-1_car-horn_presence");
// display(renderDayHourHeatmap({data: heatmap, width, categoryLabel: "car horn"}));
// ```
export const renderDayHourHeatmap = ({
  data,
  width = 640,
  categoryLabel = "sound",
  heading = " ",
  subheading = `How often ${categoryLabel} was recorded, by day of week and hour.`,
  footnote = "Source: Sounds of New York City Urban Sound Tagging (SONYC-UST) dataset, version 2.4."
} = {}) => {
  if (!data || !Array.isArray(data.counts)) {
    throw new Error("This chart requires day-by-hour presence counts.");
  }

  const {counts, maxCount, dayNames} = data;

  const chartWidth = Math.min(chartMaxWidth, Math.max(360, width));
  const gridWidth = chartWidth - marginLeft;
  const cellSize = Math.max(14, Math.min(26, gridWidth / 24 - cellGap));
  const rowStep = cellSize + cellGap;
  const gridHeight = rowStep * 7 - cellGap;
  const chartHeight = marginTop + gridHeight + marginBottom + legendHeight;

  const color = createFlagshipSequentialScale(maxCount);
  const formatCount = d3.format(",d");

  const container = d3.create("figure").attr("class", "day-hour-heatmap");
  const header = container.append("header").attr("class", "chart-header");
  header.append("h3").text(heading);
  header.append("p").text(subheading);

  const svg = container
    .append("svg")
    .attr("class", "day-hour-heatmap__svg")
    .attr("viewBox", [0, 0, chartWidth, chartHeight])
    .attr("role", "img")
    .attr("aria-label", `Heatmap of ${categoryLabel} presence by day of week and hour`);

  const tooltip = container.append("div").attr("class", "day-hour-heatmap__tooltip");

  const cellX = (hour) => marginLeft + hour * rowStep;
  const cellY = (day) => marginTop + day * rowStep;

  const cells = counts.flatMap((hours, day) =>
    hours.map((count, hour) => ({day, hour, count}))
  );

  svg
    .append("g")
    .selectAll("rect")
    .data(cells)
    .join("rect")
    .attr("class", "day-hour-heatmap__cell")
    .attr("x", (d) => cellX(d.hour))
    .attr("y", (d) => cellY(d.day))
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 2)
    .attr("fill", (d) => (d.count > 0 ? color(d.count) : "var(--theme-foreground-faintest, #f0f0f0)"))
    .on("mouseenter", (event, d) => showTooltip(event, d))
    .on("mousemove", (event, d) => showTooltip(event, d))
    .on("mouseleave", hideTooltip);

  svg
    .append("g")
    .selectAll("text")
    .data(dayNames)
    .join("text")
    .attr("class", "day-hour-heatmap__day-label")
    .attr("x", marginLeft - 8)
    .attr("y", (_, i) => cellY(i) + cellSize / 2)
    .attr("text-anchor", "end")
    .attr("dy", "0.35em")
    .text((name) => name.slice(0, 3));

  const hourTicks = d3.range(0, 24);
  svg
    .append("g")
    .selectAll("text")
    .data(hourTicks)
    .join("text")
    .attr("class", "day-hour-heatmap__hour-label")
    .attr("x", (hour) => cellX(hour) + cellSize / 2)
    .attr("y", marginTop + gridHeight + 16)
    .attr("text-anchor", "middle")
    .text((hour) => {
      if (hour === 0) return "12 AM";
      if (hour === 6) return "6 AM";
      if (hour === 12) return "12 PM";
      if (hour === 18) return "6 PM";
      return hour % 3 === 0 ? `${hour}` : "";
    });

  const legendY = marginTop + gridHeight + marginBottom;
  const legendWidth = 140;
  const legendId = `day-hour-heatmap-legend-${Math.random().toString(36).slice(2)}`;

  const legendGradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", legendId)
    .attr("x1", "0%")
    .attr("x2", "100%");
  legendGradient.append("stop").attr("offset", "0%").attr("stop-color", color(0));
  legendGradient.append("stop").attr("offset", "100%").attr("stop-color", color(maxCount));

  svg
    .append("rect")
    .attr("class", "day-hour-heatmap__legend-swatch")
    .attr("x", marginLeft)
    .attr("y", legendY)
    .attr("width", legendWidth)
    .attr("height", 10)
    .attr("rx", 2)
    .attr("fill", `url(#${legendId})`);

  svg
    .append("text")
    .attr("class", "day-hour-heatmap__legend-label")
    .attr("x", marginLeft)
    .attr("y", legendY + 24)
    .text("Fewer");

  svg
    .append("text")
    .attr("class", "day-hour-heatmap__legend-label")
    .attr("x", marginLeft + legendWidth)
    .attr("y", legendY + 24)
    .attr("text-anchor", "end")
    .text(`More (up to ${formatCount(maxCount)})`);

  function tooltipText(d) {
    const row = (label, value) => `<div class="tooltip-row"><span class="tooltip-label">${label}</span><strong class="tooltip-value">${value}</strong></div>`;
    const hourLabel = d.hour === 0 ? "12 AM" : d.hour < 12 ? `${d.hour} AM` : d.hour === 12 ? "12 PM" : `${d.hour - 12} PM`;
    return row("Day", dayNames[d.day]) + row("Hour", hourLabel) + row("Count", formatCount(d.count));
  }

  function showTooltip(event, d) {
    const [x, y] = d3.pointer(event, container.node());
    tooltip
      .style("transform", `translate(${x + 14}px, ${y + 14}px)`)
      .style("opacity", 1)
      .html(tooltipText(d));
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  if (footnote) {
    container
      .append("figcaption")
      .attr("class", "chart-footnote")
      .text(footnote);
  }

  return container.node();
};
