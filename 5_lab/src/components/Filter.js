const Filter = (props) => {
    const handleSubmit= (event) => {        
        event.preventDefault();		

        // создаем словарь со значениями полей формы
        const filterField = {
            "Название": event.target["structure"].value.toLowerCase(),
            "Тип": event.target["type"].value.toLowerCase(),
            "Страна": event.target["country"].value.toLowerCase(),
            "Город": event.target["city"].value.toLowerCase(),
            "Год": [event.target["year_from"].value, event.target["year_to"].value],
            "Высота": [event.target["height_from"].value, event.target["height_to"].value]
          };
			
        //фильтруем данные по значениям всех полей формы
        let arr = props.fullData;
        for(const key in filterField) {
            if (Array.isArray(filterField[key])) {
                // массив
                const min = filterField[key][0] ? Number(filterField[key][0]) : -Infinity;
                const max = filterField[key][1] ? Number(filterField[key][1]) : Infinity;
                
                arr = arr.filter(item => {
                    const val = Number(item[key]);
                    return val >= min && val <= max; // проверяем принадлежность интервалу
                });
            } else {
                // обычная строка
			          arr = arr.filter(item => 
			            String(item[key]).toLowerCase().includes(filterField[key])
                ); 
            }
        }  
                
        //передаем родительскому компоненту новое состояние - отфильтрованный массив
        props.filtering(arr);
	}

    const handleReset = (event) => {
        props.filtering(props.fullData);
    }
    
    return (
      <form onSubmit={ handleSubmit } onReset={ handleReset }>
        <p>
          <label>Название:</label>
          <input name="structure" type="text" />
        </p>  
        <p>
          <label>Type:</label>		
          <input name="type" type="text" />
        </p>
        <p>
          <label>Страна:</label>
          <input name="country" type="text" />
        </p>
        <p>
          <label>Город:</label>
          <input name="city" type="text" />
        </p>
        <p>
          <label>Год от:</label>
          <input name="year_from" type="number" />
        </p>
        <p>
          <label>Год до:</label>
          <input name="year_to" type="number" />
        </p>
        <p>
          <label>Высота от:</label>
          <input name="height_from" type="number" />
        </p>
        <p>
          <label>Высота до:</label>
          <input name="height_to" type="number" />
        </p>
        <p>         
        <button type="submit">Фильтровать</button>
		    <button type="reset">Очистить фильтр</button>
		</p>  
      </form> 
    )
}

export default Filter;