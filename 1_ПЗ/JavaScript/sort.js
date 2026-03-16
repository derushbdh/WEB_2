const createSortArr = (dataForm) => {
    let sortArr = [];
    const sortSelects = dataForm.getElementsByTagName('select');
    for (const item of sortSelects) {
        const keySort = item.value;
        if (keySort == 0 || keySort === 'Нет') break;
        const descId = item.id.replace('level', 'desc');
        const descElem = document.getElementById(descId);
        const desc = descElem ? descElem.checked : false;
        
        const colIndex = Object.keys(demography[0]).indexOf(keySort);
        if (colIndex !== -1) {
            sortArr.push({ column: colIndex, direction: desc, columnName: keySort });
        }
    }
    return sortArr;
};

const sortTable = (idTable, sortForm, filterForm) => {
    const sortArr = createSortArr(sortForm);
    if (sortArr.length === 0) {
        filterTable(demography, idTable, filterForm);
        return false;
    }
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    const headerRow = rowData.shift();
    
    rowData.sort((first, second) => {
        for (let { column, direction, columnName } of sortArr) {
           const firstCell = first.cells[column].innerHTML;
           const secondCell = second.cells[column].innerHTML;
           let comparison = 0;
           if (columnName === 'Год' || columnName === 'Население, млн' || columnName === 'Плотность, чел/км²' || columnName === 'Прирост, %') {
               comparison = Number(firstCell) - Number(secondCell);
           } else {
               comparison = firstCell.localeCompare(secondCell);
           }
           if (comparison !== 0) return (direction ? -comparison : comparison);
        }
        return 0; 
    });
    
    clearTable(idTable);
    table.append(headerRow);
    let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
    table.append(tbody);
};

const resetSort = (idTable, sortForm, filterForm) => {
    if(sortForm) {
        setSortSelects(demography[0], sortForm);
    }
    filterTable(demography, idTable, filterForm);
};
