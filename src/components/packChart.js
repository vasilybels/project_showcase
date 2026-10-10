import * as d3 from "npm:d3";
import { handleHover, resetHover } from "./tools/handleHover.js";
import { createFlagshipColorScale } from "./tools/colorScale.js";

export default function renderChart({data} = {}) {
    const hierarchyData = Array.isArray(data) ? {name: "Sounds", children: data} : data;
    
    // Set chart dimensions and margins. The width is fixed and standard.
    const width = 928;
    const height = width;
    const margin = 1; // to avoid clipping the root circle stroke
    
    const pack = d3.pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

    // Compute the hierarchy from the JSON data; recursively sum the
    // values for each node; sort the tree by descending value; lastly
    // apply the pack layout.
    const root = pack(d3.hierarchy(hierarchyData)
        .sum(d => d.children?.length ? 0 : d.count ?? d.value ?? 0)
        .sort((a, b) => b.value - a.value));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("class", "bubble-chart-new")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-margin, -margin, width, height])
        .attr("style", "width: 100%; height: auto; font-size: 10px;")
        .attr("text-anchor", "middle");

    // Removes tooltips left over from earlier renders (e.g. hot reload).
    d3.selectAll(".tooltip").remove();

    const tooltip = d3.select(document.body).append("div")
        .attr("class", "tooltip")
        .style("position", "fixed")
        .style("opacity", 0);

    // Place each node according to the layout’s x and y values.
    const node = svg.append("g")
        .selectAll()
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);


    const getFill = (d) => {
        if (d.children) {
            return "#fff";
        }
        if (d.data.key === "1-3_large-sounding-engine_presence") {
            return "hsl(6, 54%, 80%)";
        }
        if (d.data.key === "5-1_car-horn_presence") {
            return "hsl(216, 67%, 80%)";
        }
        return "#e9e9e9";
    }

    // Add a filled or stroked circle.
    node.append("circle")
        .attr("class", "bubble-chart-new-circle")
        .attr("fill", d => getFill(d))
        .attr("stroke","#bbbbbb")
        .attr("r", d => d.r)
        .on("mouseenter", (event, d) => {
            handleHover(d, svg);
            tooltip
                .style("opacity", 1)
                .html(`<span class="tooltip-name">${d.data.name}</span>
                    <br>
                    <span class="tooltip-count">${d.parent? d.data.count + " recordings" : ""}</span>`);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", `${event.clientX + 15}px`).style("top", `${event.clientY + 15}px`);
        })
        .on("mouseleave", () => {
            resetHover(svg);
            tooltip.style("opacity", 0);
        });

    // Add text labels only to leaf nodes.
    node.filter(d => !d.children)
        .append("text")
        .attr("class", "bubble-chart-new-labels")
        .text(d => d.data.name);
    
    node.select("text").call(wrap, d => d.r * 1.9);
    
    return svg.node();
}

// Create a canvas context for measuring text width accurately.
const ctx = document.createElement("canvas").getContext("2d");

// Helper function that does not allow labels for tiny circles.
const getWords = (textNode, d) => {
    return d.r < 20 ? [] : textNode.text().split(/\s+/).reverse();
}
//     // Custom reusable text wrapping function from StackOverflow.
function wrap(text, widthSelector) {
    text.each(function(d) {
        const textNode = d3.select(this);
        //const words = textNode.text().split(/\s+/).reverse();
        const words = getWords(textNode, d);
        const maxWidth = typeof widthSelector === "function" ? widthSelector(d) : widthSelector;
        
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1; // ems
        const y = textNode.attr("y") || 0;
        const x = textNode.attr("x") || 0;
        
        ctx.font = "10px monospace";
        const measure = s => ctx.measureText(s).width;

        // Clear text content to build tspans
        textNode.text(null);
        
        let tspan = textNode.append("tspan")
            .attr("x", x)
            .attr("y", y);

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (line.length > 1 && measure(line.join(" ")) > maxWidth) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = textNode.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + "em")
                    .text(word);
            }
        }
        
        // Center the entire block vertically inside the circle based on total lines
        const totalLines = textNode.selectAll("tspan").size();
        textNode.selectAll("tspan")
            .attr("dy", (i, idx) => {
                // Adjust first line vs subsequent lines to achieve vertical centering
                if (idx === 0) return `${-(totalLines - 1) * (lineHeight / 2) + 0.35}em`;
                return `${lineHeight}em`;
            });
    });
}
