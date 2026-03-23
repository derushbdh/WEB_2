function drawSmile(svg) {
    let smile = svg.append("g")
        .style("stroke", "brown")
        .style("stroke-width", 2)
        .style("fill", "brown");
        
    smile.append("circle") 
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 50)
        .style("fill", "yellow");
        
    smile.append("circle") 
        .attr("cx", -20)
        .attr("cy", -10)
        .attr("r", 5);
        
    smile.append("circle") 
        .attr("cx", 20)
        .attr("cy", -10)
        .attr("r", 5);
        
    let arc = d3.arc()
       .innerRadius(35)
       .outerRadius(35);    
    smile.append("path")
       .attr("d", arc({startAngle: Math.PI /3 * 2, endAngle: Math.PI/3 * 4}))
       .style("stroke", "brown");

    smile.append("line")
       .attr("x1", -30)
       .attr("y1", -25)
       .attr("x2", -10)
       .attr("y2", -20)
       .style("stroke", "brown");

    smile.append("line")
       .attr("x1", 30)
       .attr("y1", -25)
       .attr("x2", 10)
       .attr("y2", -20)
       .style("stroke", "brown");
       
    smile.append("polygon")
       .attr("points", "0,-5 -5,5 5,5")
       .style("fill", "brown")
       .style("stroke", "none");

     return smile;
}