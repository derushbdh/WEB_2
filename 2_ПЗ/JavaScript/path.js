function createPathFlower() {
    const svg = d3.select("svg")
    const width = +svg.attr("width")
    const height = +svg.attr("height")

    let data = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const R = 250; 

    const startT = 0.4 * Math.PI;
    const endT = startT + Math.PI;

    for (let t = startT; t <= endT; t += 0.01) {
        let r = R * Math.sin(5 * t);
        let x = centerX + r * Math.cos(t);
        let y = centerY + r * Math.sin(t);
        data.push({x: x, y: y});
    }
    
    return data;
}

const drawPath = () => {
    const dataPoints = createPathFlower();

    const line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveBasis);

    const svg = d3.select("svg");

    const path = svg.append('path')
        .attr('d', line(dataPoints))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    const width = +svg.attr("width")
    const height = +svg.attr("height")
    
    svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 8)
        .attr('fill', '#b22222')
        .attr('class', 'path-center-dot');
        
    return path;	
}

function transformAlong(path, finalScale, finalRotate) {
    const length = path.getTotalLength();
    return function() {
        return function(t) { 
            const {x, y} = path.getPointAtLength(t * length);
            const currentScale = 1 + (finalScale - 1) * t;
            const currentRotate = finalRotate * t;
            return `translate(${x},${y}) scale(${currentScale}) rotate(${currentRotate})`;
        }
    }
}