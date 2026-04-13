import { useState } from "react";
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';

const Table = (props) => {
    const [activePage, setActivePage] = useState(1);

    const currentAmountRows = props.showPagination ? props.amountRows : props.data.length;

    const [dataTable, setDataTable] = useState(props.data);
    const updateDataTable = (value) => {
        setDataTable(value);

        const n = Math.max(1, Math.ceil(value.length / currentAmountRows));
        setActivePage(n);
    }
    
    //количество страниц разбиения таблицы
    const n = Math.ceil(dataTable.length / currentAmountRows); 
    
    // массив с номерами страниц
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const changeActive = (pageNumber) => {
        setActivePage(pageNumber);
    };
    
    //формируем совокупность span с номерами страниц
    const pages = arr.map((item, index) =>  
          <span key={ index } className={item === activePage ? "active-page" : ""} onClick={ () => changeActive(item) } > { item } </span>
    );
     
    return(
      <>
        <h4>Фильтры</h4>
        <Filter filtering={ updateDataTable } data={ dataTable } fullData={ props.data }/>

        <table>
            <TableHead head={ Object.keys(props.data[0]) } />
            <TableBody body={ dataTable } amountRows={ currentAmountRows } numPage={activePage}/>
        </table>

        {props.showPagination && (
	        <div>
              {pages}
            </div>
        )}
	  </>   
    )   
}

export default Table;