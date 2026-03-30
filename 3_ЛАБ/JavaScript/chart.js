// Входные данные:
//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка

function createArrGraph(data, key) {  
  
    const groupObj = d3.group(data, d => d[key]);

    let arrGraph =[];
    for(let entry of groupObj) {
        const minMax = d3.extent(entry[1].map(d => d['Высота']));
        arrGraph.push({labelX : entry[0], values : minMax});
     }
     
     // Если группируем по году, сортируем по возрастанию года
     if (key === "Год") {
         arrGraph.sort((a, b) => a.labelX - b.labelX);
     }

     return arrGraph;
}

function drawGraph(data, dataForm) {
    // значения по оси ОХ    
    const keyX = dataForm.xAxis; // значения по оси OХ из dataForm
        
    // создаем массив для построения графика
    let arrGraph = createArrGraph(data, keyX);

    /* если выбран Год, то отсортировать массив по labelX */
    if (keyX === "Год") {
        arrGraph.sort((a, b) => a.labelX - b.labelX);
    }

    const svg = d3.select("svg");
    svg.selectAll('*').remove();

    // создаем словарь с атрибутами области вывода графика
    const attr_area = {
        width: parseFloat(svg.style('width')) || 800,
        height: parseFloat(svg.style('height')) || 400,
        marginX: 50,
        marginY: 50
    }
       
    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area, dataForm.showMax, dataForm.showMin);
    
    // В зависимости от выбранного типа отрисовываем точки или гистограмму
    if (dataForm.type === "scatter") {
        if (dataForm.showMax) {
            createChart(svg, arrGraph, scX, scY, attr_area, "red", 1); 
        }
        if (dataForm.showMin) {
            createChart(svg, arrGraph, scX, scY, attr_area, "blue", 0);
        }
    } else if (dataForm.type === "bar") {
        createBarChart(svg, arrGraph, scX, scY, attr_area, dataForm);
    }
}

function createAxis(svg, data, attr_area, showMax, showMin){
    // находим глобальные минимумы и максимумы среди всех выводимых данных
    let allValues = [];
    if (showMax && showMin) {
        allValues = data.flatMap(d => d.values); // берем и мин и макс
    } else if (showMax) {
        allValues = data.map(d => d.values[1]); // только макс
    } else if (showMin) {
        allValues = data.map(d => d.values[0]); // только мин
    }

    const [min, max] = d3.extent(allValues);

    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения
    const scaleX = d3.scaleBand()
                    .domain(data.map(d => String(d.labelX)))
                    .range([0, attr_area.width - 2 * attr_area.marginX])
                    .padding(0.4);
                    
    const scaleY = d3.scaleLinear()
                    .domain([min * 0.85, max * 1.1 ])
                    .range([attr_area.height - 2 * attr_area.marginY, 0]);               
     
     // создание осей
     const axisX = d3.axisBottom(scaleX); // горизонтальная 
     const axisY = d3.axisLeft(scaleY); // вертикальная

     // отрисовка осей в SVG-элементе
     svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
    
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);
        
    return [scaleX, scaleY]
}

function createChart(svg, data, scaleX, scaleY, attr_area, color, valueIndex) {
    const r = 4;

    svg.append("g").selectAll(".dot-" + color)
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(String(d.labelX)) + scaleX.bandwidth() / 2 + 1 - valueIndex * 3)
        .attr("cy", d => scaleY(d.values[valueIndex]))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", color)
}

function createBarChart(svg, data, scaleX, scaleY, attr_area, dataForm) {
    const groupWidth = scaleX.bandwidth();
    let barWidth = groupWidth;

    if (dataForm.showMax && dataForm.showMin) {
        barWidth = groupWidth / 2;
    }

    if (dataForm.showMax) {
        svg.append("g").selectAll(".bar_max")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => scaleX(String(d.labelX)))
            .attr("y", d => scaleY(d.values[1]))
            .attr("width", barWidth - 1)
            .attr("height", d => scaleY(scaleY.domain()[0]) - scaleY(d.values[1]) ) 
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "red");
    }

    if (dataForm.showMin) {
        svg.append("g").selectAll(".bar_min")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => scaleX(String(d.labelX)) + (dataForm.showMax ? barWidth : 0))
            .attr("y", d => scaleY(d.values[0]))
            .attr("width", barWidth - 1) 
            .attr("height", d => scaleY(scaleY.domain()[0]) - scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }
}