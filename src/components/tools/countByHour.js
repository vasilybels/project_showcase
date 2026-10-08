import * as d3 from "npm:d3";
import countPresence from "./countPresence.js";

export default function countByHour(recEntries, category) {

    const counts = d3.rollup(recEntries, v => countPresence(v, category), d => +d.hour);
    const totals = d3.rollup(recEntries, v => v.length, d => +d.hour);
    return d3.range(24).map(hour => {
        const count = counts.get(hour) ?? 0;
        const total = totals.get(hour) ?? 0;
        return {hour, count, total, rate: total ? count / total : 0};
    });
}
