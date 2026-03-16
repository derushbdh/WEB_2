// устанавливаем соответствие между полями формы и столбцами таблицы
const correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
}

/* Структура возвращаемого ассоциативного массива:
{
    input_id: input_value,
    ...
}
*/
const dataFilter = (dataForm) => {
    
    let dictFilter = {};

    // перебираем все элементы формы с фильтрами
    for (const item of dataForm.elements) {
        
        // получаем значение элемента
        let valInput = item.value;

        // если поле типа text - приводим его значение к нижнему регистру
        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type === "number") {
            // обрабатываем значения числовых полей
            if (valInput !== "") {
                valInput = Number(valInput);
            } else if (item.id.includes("From")) {
                valInput = -Infinity;
            } else if (item.id.includes("To")) {
                valInput = Infinity;
            }
        }

         // формируем очередной элемент ассоциативного массива
        if (item.id) {
            dictFilter[item.id] = valInput;
        }
    }       
    return dictFilter;
}

// фильтрация таблицы
const filterTable = (data, idTable, dataForm) =>{
    
    // получаем данные из полей формы
    const datafilter = dataFilter(dataForm);
    
    // выбираем данные соответствующие фильтру и формируем таблицу из них
    let tableFilter = data.filter(item => {

        /* в этой переменной будут "накапливаться" результаты сравнения данных
           с параметрами фильтра */
        let result = true;
        
        // строка соответствует фильтру, если сравнение всех значения из input 
        // со значением ячейки очередной строки - истина
        for (let key in item) {
            let val = item[key];
            
            // текстовые поля проверяем на вхождение
            if (typeof val === 'string') {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]]);
            } else if (typeof val === 'number') {
                // проверяем числовые поля на принадлежность интервалу
                const idFrom = correspond[key][0];
                const idTo = correspond[key][1];
                result &&= (val >= datafilter[idFrom] && val <= datafilter[idTo]);
            }
        }

         return result;
    });     

    // удаляем все строки таблицы с id=idTable перед выводом новых
    clearTable(idTable);

    // таблица с отфильтрованными строками
    if (tableFilter.length > 0) {
        createTable(tableFilter, idTable);  
    } else {
        //  выводим только шапку таблицы
        const table = document.getElementById(idTable);
        const header = Object.keys(data[0]);
        const headerRow = createHeaderRow(header);
        table.append(headerRow);
    }
}

// очистка фильтров и возврат к исходной таблице
const clearFilter = (idTable, data, dataForm) => {
    dataForm.reset();
    clearTable(idTable);
    createTable(data, idTable);
}