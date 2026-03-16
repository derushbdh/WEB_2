/*формируем массив для сортировки по двум уровням вида 
  [
    {column: номер столбца, по которому осуществляется сортировка, 
     direction: порядок сортировки (true по убыванию, false по возрастанию)
    }, 
    ...
   ]
*/
const createSortArr = (data) => {
    let sortArr = [];
    
    const sortSelects = data.getElementsByTagName('select');
    
    for (const item of sortSelects) {   

        const keySort = item.value;

        if (keySort == 0) {
            break;
        }

        const desc = document.getElementById(item.id + 'Desc').checked;

        sortArr.push(
          {
            column: keySort - 1, 
            direction: desc
        }
        ); 
    }
    return sortArr; 
};

const sortTable = (idTable, sortForm, filterForm) => {
    
    const sortArr = createSortArr(sortForm);
    
    if (sortArr.length === 0) {
        filterTable(buildings, idTable, filterForm);
        return false;
    }

    let table = document.getElementById(idTable);

    // преобразуем строки таблицы в массив 
    let rowData = Array.from(table.rows);
    
    // удаляем элемент с заголовками таблицы
     const headerRow = rowData.shift();
    
    //сортируем данные по всем уровням сортировки
    rowData.sort((first, second) => {
        for (let { column, direction } of sortArr) {
           const firstCell = first.cells[column].innerHTML;
           const secondCell = second.cells[column].innerHTML;
           
           let comparison = 0;
           
           // Проверяем, являются ли значения числами
           if (!isNaN(firstCell) && !isNaN(secondCell) && firstCell.trim() !== '' && secondCell.trim() !== '') {
               comparison = Number(firstCell) - Number(secondCell);
           } else {
               // используем localeCompare для корректного сравнения
               comparison = firstCell.localeCompare(secondCell);
           }
		      
           // учитываем направление сортировки
           if (comparison !== 0) {
             return (direction ? -comparison : comparison);
          }
        }
        return 0; 
    });
    
    //выводим отсортированную таблицу на страницу
    clearTable(idTable);
    table.append(headerRow);
	
	let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
	table.append(tbody);
}

// функция для сброса сортировки
const resetSort = (idTable, sortForm, filterForm) => {
    // формируем поля формы как при загрузке (сбрасываются значения и чекбоксы, очищаются динамические селекты)
    setSortSelects(buildings[0], sortForm);
    
    // восстанавливаем на странице исходную (или только отфильтрованную) таблицу
    filterTable(buildings, idTable, filterForm);
}