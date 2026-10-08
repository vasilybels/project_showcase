import * as d3 from "npm:d3";

// `data` is the 24-item [{hour, count, total, rate}] array from countByHour.
export default function renderStrip({data, max = d3.max(data, d => d.rate)} = {}) {
    const width = 928;
    const height = 100;
    const axisHeight = 20;

    const x = d3.scaleBand(d3.range(24), [0, width]);
    const color = d3.scaleSequential([0, max], d3.interpolate("#FFFFFF", "#2561ba"));

    const svg = d3.create("svg")
        .attr("class", "strip-chart")
        .attr("viewBox", [0, 0, width, height + axisHeight])
        .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

    const tooltip = d3.select(document.body).selectAll(".strip-chart-tooltip")
        .data([null])
        .join("div")
        .attr("class", "tooltip")
        .style("position", "fixed")
        .style("pointer-events", "none")
        .style("opacity", 0);

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.hour))
        .attr("width", x.bandwidth())
        .attr("height", height)
        .attr("fill", d => color(d.rate))
        .on("mouseenter", (event, d) => {
            d3.select(event.currentTarget)
                .interrupt("fill")
                .transition().duration(100)
                .attr("fill", d3.color(color(d.rate)).darker(0.25));
            tooltip
                .style("opacity", 1)
                .html(`<span class="tooltip-name">${hourLabel(d.hour)} to ${hourLabel(d.hour + 1)}</span>
                    <br>
                    <span class="tooltip-count">${d3.format(".1%")(d.rate)} of recordings</span>`
                );
            tooltip.style("left", `${event.clientX + 15}px`).style("top", `${event.clientY + 15}px`);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", `${event.clientX + 15}px`).style("top", `${event.clientY + 15}px`);
        })
        .on("mouseleave", (event, d) => {
            d3.select(event.currentTarget)
                .interrupt("fill")
                .transition().duration(100)
                .attr("fill", color(d.rate));
            tooltip.style("opacity", 0);
        });


    const hourLabel = h => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickValues(d3.range(0, 24)).tickFormat(hourLabel).tickSize(4))
        .call(g => g.select(".domain").remove());

    return svg.node();
}
