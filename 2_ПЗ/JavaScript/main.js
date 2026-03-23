document.addEventListener("DOMContentLoaded", function() {
    const width = 600;
    const height = 600;      
    const svg = d3.select("svg")
       .attr("width", width)
       .attr("height", height);

    const startBtn = document.getElementById('startBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    startBtn.addEventListener('click', () => {
        runAnimation();
    });

    clearBtn.addEventListener('click', () => {
        svg.selectAll('*').remove();
    });
})

const runAnimation = () => {
    const svg = d3.select("svg");

    const duration = +document.getElementById('duration').value;
    const scaleFactor = +document.getElementById('scaleFactor').value;
    const rotateAngle = +document.getElementById('rotateAngle').value;

    let path = drawPath();	

    let pict = drawSmile(svg);
    
    pict.attr("transform", `translate(${svg.attr("width") / 2}, ${svg.attr("height") / 2})`);

    pict.transition()
        .ease(d3.easeLinear)
        .duration(duration)
        .attrTween('transform', transformAlong(path.node(), scaleFactor, rotateAngle));
}