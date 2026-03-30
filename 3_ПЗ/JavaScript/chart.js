function createArrGraph(data, xAxisVal, yAxisVals) {
    let grouped = d3.rollups(
        data,
        v => {
            let res = {};
            yAxisVals.forEach(y => {
                res[y] = d3.max(v, d => d[y]);
            });
            return res;
        },
        d => d[xAxisVal]
    );

    let processedGroup = grouped.map(d => {
        let obj = { xValue: d[0] };
        yAxisVals.forEach(y => obj[y] = d[1][y]);
        return obj;
    });
    
    processedGroup.sort((a,b) => String(a.xValue).localeCompare(String(b.xValue)));
    return processedGroup;
}

function createChart(data, yAxisVals, chartType) {
    const svgArea = d3.select("#chartArea");
    const width = 800;
    const height = 400;
    const margin = {top: 20, right: 120, bottom: 40, left: 60};
    const cWidth = width - margin.left - margin.right;
    const cHeight = height - margin.top - margin.bottom;

    svgArea.selectAll("*").remove();

    let svgGroup = svgArea.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.xValue))
        .range([0, cWidth])
        .padding(0.1);
        
    let maxY = d3.max(data, d => d3.max(yAxisVals, yk => d[yk]));
    let minY = d3.min(data, d => d3.min(yAxisVals, yk => d[yk]));
    if (minY > 0) minY = 0; 
        
    let scaleY = d3.scaleLinear()
        .domain([minY, maxY * 1.05])
        .range([cHeight, 0]);

    const colors = d3.scaleOrdinal(d3.schemeCategory10).domain(yAxisVals);

    svgGroup.append("g")
        .attr("transform", `translate(0, ${scaleY(0) || cHeight})`)
        .call(d3.axisBottom(scaleX));
        
    svgGroup.append("g")
        .call(d3.axisLeft(scaleY));

    if(chartType === "bar") {
         let subgroupX = d3.scaleBand()
            .domain(yAxisVals)
            .range([0, scaleX.bandwidth()])
            .padding(0.05);

         svgGroup.selectAll(".bar-group")
            .data(data)
            .enter().append("g")
            .attr("transform", d => `translate(${scaleX(d.xValue)},0)`)
            .selectAll("rect")
            .data(d => yAxisVals.map(y => ({key: y, value: d[y]})))
            .enter().append("rect")
            .attr("x", d => subgroupX(d.key))
            .attr("y", d => d.value > 0 ? scaleY(d.value) : scaleY(0))
            .attr("width", subgroupX.bandwidth())
            .attr("height", d => Math.abs(scaleY(d.value) - scaleY(0)))
            .attr("fill", d => colors(d.key));
    } 
    else if (chartType === "line") {
         yAxisVals.forEach(yKey => {
            let lineGenerator = d3.line()
                .x(d => scaleX(d.xValue) + scaleX.bandwidth()/2)
                .y(d => scaleY(d[yKey]));

            svgGroup.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colors(yKey))
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);
         });
    }
    else if (chartType === "scatter") {
        yAxisVals.forEach(yKey => {
            svgGroup.selectAll(".dot-" + yKey.replace(/\W/g, ""))
                .data(data)
                .enter().append("circle")
                .attr("cx", d => scaleX(d.xValue) + scaleX.bandwidth()/2)
                .attr("cy", d => scaleY(d[yKey]))
                .attr("r", 4)
                .attr("fill", colors(yKey));
        });
    }
    
    let legend = svgGroup.selectAll(".legend")
        .data(yAxisVals)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${cWidth + 10}, ${i * 20})`);
        
    legend.append("rect")
        .attr("x", 0)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => colors(d));
        
    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(d => d);
}