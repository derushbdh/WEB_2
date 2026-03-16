document.addEventListener("DOMContentLoaded", function() {
    createTable(demography, 'list');

    const btnFind = document.getElementById("btn-find");
    const btnClear = document.getElementById("btn-clear");
    const filterForm = document.getElementById("filter");

    const sortForm = document.getElementById("sort");

    btnFind.addEventListener("click", () => {
        resetSort("list", sortForm, filterForm);
        filterTable(demography, "list", filterForm);
    });

    btnClear.addEventListener("click", () => {
        resetSort("list", sortForm, filterForm);
        clearFilter("list", demography, filterForm);
    });

    setSortSelects(demography[0], sortForm);

    const fieldsFirst = document.getElementById("first_level");
    fieldsFirst.addEventListener("change", (event) => {
        changeNextSelect(event.target, "second_level");
    });
    const fieldsSecond = document.getElementById("second_level");
    fieldsSecond.addEventListener("change", (event) => {
        changeNextSelect(event.target, "third_level");
    });

    const btnSort = document.querySelector("#sort button[type='button']") || document.getElementById("btn-sort");
    if(btnSort) {
        btnSort.addEventListener("click", () => {
            sortTable("list", sortForm, filterForm);
        });
    }

    const btnSortReset = document.getElementById("btn-sort-reset");
    if(btnSortReset){
        btnSortReset.addEventListener("click", () => {
            resetSort("list", sortForm, filterForm);
        });
    }
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
        sortSelect.append(createOption(item, item));
    });
}

const setSortSelects = (data, dataForm) => { 
    dataForm.reset();
    const head = Object.keys(data);
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

const changeNextSelect = (curSelect, nextSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);
    if (!nextSelect) return;
    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;
    if (curSelect.value != 0 && curSelect.value !== 'Нет') {
       for (let i=0; i<nextSelect.options.length; i++) {
           if (nextSelect.options[i].value === curSelect.value) {
               nextSelect.remove(i);
               break;
           }
       }
    } else {
        nextSelect.disabled = true;
    }
}