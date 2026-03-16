document.addEventListener("DOMContentLoaded", function() {
    createTable(buildings, 'list');

    const btnFind = document.getElementById("btn-find");
    const btnClear = document.getElementById("btn-clear");
    const filterForm = document.getElementById("filter");

    const sortForm = document.getElementById("sort");

    //  "Найти"
    btnFind.addEventListener("click", () => {
        resetSort("list", sortForm, filterForm);
        filterTable(buildings, "list", filterForm);
    });

    // "Очистить фильтры"
    btnClear.addEventListener("click", () => {
        resetSort("list", sortForm, filterForm);
        clearFilter("list", buildings, filterForm);
    });

    // Инициализируем селекты сортировки (передаем первый объект для ключей)
    setSortSelects(buildings[0], sortForm);

    const fieldsFirst = document.getElementById("fieldsFirst");
    fieldsFirst.addEventListener("change", (event) => {
        changeNextSelect(event.target, "fieldsSecond"); // event.target – это сам первый список, в котором произошел клик
    });

    const btnSort = document.getElementById("btn-sort");
    const btnSortReset = document.getElementById("btn-sort-reset");

    // Обработчик для кнопки "Сортировать"
    btnSort.addEventListener("click", () => {
        sortTable("list", sortForm, filterForm);
    });

    // Обработчик для кнопки "Сбросить сортировку"
    btnSortReset.addEventListener("click", () => {
        resetSort("list", sortForm, filterForm);
    });
});

const createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

const setSortSelect = (arr, sortSelect) => {
    
    sortSelect.append(createOption('Нет', 0));

     arr.forEach((item, index) => {
        sortSelect.append(createOption(item, index + 1));
    });
}

const setSortSelects = (data, dataForm) => { 
    dataForm.reset();
    
    // выделяем ключи словаря в массив
    const head = Object.keys(data);

    // находим все SELECT в форме
    const allSelect = dataForm.getElementsByTagName('select');
    
    for(let i = 0; i < allSelect.length; i++) {
        const item = allSelect[i];
        
        item.innerHTML = '';
        
        setSortSelect(head, item);
        
        if (i > 0) {
            item.disabled = true;
        }
    }
}

// настраиваем поле для следующего уровня сортировки
const changeNextSelect = (curSelect, nextSelectId) => {
    
    let nextSelect = document.getElementById(nextSelectId);
    
    nextSelect.disabled = false;
    
    nextSelect.innerHTML = curSelect.innerHTML;
    
    if (curSelect.value != 0) {
       nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
    }
}