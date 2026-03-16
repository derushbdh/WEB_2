const correspond = {
    "Страна": "country_filter",
    "Континент": "continent_filter",
    "Год": ["year_from", "year_to"],
    "Население, млн": ["population_from", "population_to"],
    "Плотность, чел/км²": ["density_from", "density_to"],
    "Прирост, %": ["growth_from", "growth_to"]
};

const dataFilter = (dataForm) => {
    let dictFilter = {};
    for (const item of dataForm.elements) {
        let valInput = item.value;
        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type === "number") {
            if (valInput !== "") valInput = Number(valInput);
            else if (item.id.includes("from")) valInput = -Infinity;
            else if (item.id.includes("to")) valInput = Infinity;
        }
        if (item.id) dictFilter[item.id] = valInput;
    }       
    return dictFilter;
}

const filterTable = (data, idTable, dataForm) =>{
    const datafilter = dataFilter(dataForm);
    let tableFilter = data.filter(item => {
        let result = true;
        for (let key in item) {
            let val = item[key];
            if (typeof val === 'string') {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]] || "");
            } else if (typeof val === 'number') {
                const idFrom = correspond[key][0];
                const idTo = correspond[key][1];
                result &&= (val >= datafilter[idFrom] && val <= datafilter[idTo]);
            }
        }
        return result;
    });     
    clearTable(idTable);
    if (tableFilter.length > 0) createTable(tableFilter, idTable);  
    else {
        const table = document.getElementById(idTable);
        const header = Object.keys(data[0]);
        const headerRow = createHeaderRow(header);
        table.append(headerRow);
    }
}

const clearFilter = (idTable, data, dataForm) => {
    dataForm.reset();
    clearTable(idTable);
    createTable(data, idTable);
}