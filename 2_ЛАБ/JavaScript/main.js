document.addEventListener("DOMContentLoaded", function() {
    const width = 600;
    const height = 600;      
    const svg = d3.select("svg")
       .attr("width", width)
	   .attr("height", height) ;


    const drawBtn = document.querySelector('input[value="Нарисовать"]');
    const clearBtn = document.querySelector('input[value="Очистить"]');
    const animateBtn = document.querySelector('input[value="Анимировать"]');
    const animationCheck = document.getElementById('animationCheck');
    const pathCheck = document.getElementById('pathCheck');
    const pathContainer = document.getElementById('pathContainer');
    const coordsBlock = document.getElementById('coordsBlock');
    const pathsBlock = document.getElementById('pathsBlock');
    const scaleBlock = document.getElementById('scaleBlock');
    const rotateBlock = document.getElementById('rotateBlock');
    const animFields = document.querySelectorAll('.anim-field');
    const animationType = document.getElementById('animationType');
    const form = document.getElementById('setting');
    
    drawBtn.addEventListener('click', () => {
        draw(form);
    });

    clearBtn.addEventListener('click', () => {
        svg.selectAll('*').remove();
    });

    animateBtn.addEventListener('click', () => {
        runAnimation(form);
    });

    animationCheck.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        
        animFields.forEach(field => {
            field.style.display = isChecked ? 'inline' : 'none';
        });
        
        animationType.style.display = isChecked ? 'inline' : 'none';
        animateBtn.style.display = isChecked ? 'inline' : 'none';
        pathContainer.style.display = isChecked ? 'inline' : 'none';
        
        drawBtn.style.display = isChecked ? 'none' : 'inline';
        
        if (!isChecked) {
            pathCheck.checked = false;
            coordsBlock.style.display = 'block';
            pathsBlock.style.display = 'none';
            scaleBlock.style.display = 'block';
            rotateBlock.style.display = 'block';
        }

    });

    pathCheck.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            coordsBlock.style.display = 'none';
            pathsBlock.style.display = 'block';
            scaleBlock.style.display = 'none';
            rotateBlock.style.display = 'none';
        } else {
            coordsBlock.style.display = 'block';
            pathsBlock.style.display = 'none';
            scaleBlock.style.display = 'block';
            rotateBlock.style.display = 'block';
        }
    });
})

const draw = (dataForm) => {
	const svg = d3.select("svg")
    let pict = drawSmile(svg)
    pict.attr("transform", `translate(${dataForm.cx.value}, 
        ${dataForm.cy.value}) scale(${dataForm.sx.value}, 
        ${dataForm.sy.value}) rotate(${dataForm.angle.value})`);
}

const runAnimation = (dataForm) => {
	const svg = d3.select("svg")
    let pict = drawSmile(svg);
    
    let easeFunc = d3.easeLinear;
    if (dataForm.animationType.value === 'elastic') {
        easeFunc = d3.easeElastic;
    } else if (dataForm.animationType.value === 'bounce') {
        easeFunc = d3.easeBounce;
    }

    if (!dataForm.pathCheck.checked) {
        pict.attr("transform", `translate(${dataForm.cx.value}, 
            ${dataForm.cy.value}) scale(${dataForm.sx.value}, 
            ${dataForm.sy.value}) rotate(${dataForm.angle.value})`);

        pict.transition()
            .duration(2000)
            .ease(easeFunc)
            .attr("transform", `translate(${dataForm.cx_finish.value}, 
                ${dataForm.cy_finish.value}) scale(${dataForm.sx_finish.value}, 
                ${dataForm.sy_finish.value}) rotate(${dataForm.angle_finish.value})`);
    } else {
        const pathTypeValue = document.getElementById("pathType").value;
        let path = drawPath(pathTypeValue);	
        
        pict.transition()
            .ease(easeFunc)
            .duration(6000)
            .attrTween('transform', translateAlong(path.node()));
    }
}