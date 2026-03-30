document.addEventListener('DOMContentLoaded', ()=>{
    if(typeof createTable !== 'undefined'){
        createTable(demographicData, 'dataTable');
    }
    const btn = document.getElementById('drawGraphBtn');
    if(btn){
        btn.addEventListener('click', ()=>{
            const fd = new FormData(document.getElementById('graph-form'));
            const x = fd.get('ox_axis');
            const y = fd.getAll('oy_values');
            const type = fd.get('chart_type');
            if(!x || y.length===0){
                alert('Выберите хотя бы одно значение X и Y');
                return;
            }
            createChart(createArrGraph(demographicData, x, y), y, type);
        });
    }
});