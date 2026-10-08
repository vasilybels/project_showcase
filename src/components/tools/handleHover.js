const handleHover = (node, svg) => {
    const name = node.data.name;
    console.log(name);
    svg.selectAll(".bubble-chart-new-circle")
        .interrupt()
        .transition().duration(100)
        //.attr("stroke", d => d.data.name === name ? "#f00" : "#bbb")
        .attr("stroke-width", (d) => {
            return d.data.name === name ? 2.5 : 1;
        });
};

const resetHover = (svg) => {
    svg.selectAll(".bubble-chart-new-circle")
        .interrupt()
        .transition().duration(100)
        .attr("stroke-width", 1);
};

export { handleHover, resetHover };