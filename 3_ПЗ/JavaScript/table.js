function createTable(data, tableId) {
    let table = document.getElementById(tableId);
    table.innerHTML = "";
    
    if (!data || data.length === 0) return;
    
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    Object.keys(data[0]).forEach(key => {
        let th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });
    
    let tbody = table.createTBody();
    data.forEach(item => {
        let row = tbody.insertRow();
        Object.values(item).forEach(val => {
            let cell = row.insertCell();
            cell.textContent = val;
        });
    });
}