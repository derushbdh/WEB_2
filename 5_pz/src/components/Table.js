import { useState } from "react";
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import Sort from './Sort.js';

const Table = (props) => {
    const [activePage, setActivePage] = useState(1);
    const [sortParams, setSortParams] = useState(null);

    const dataTable = props.filteredData;

    const updateDataTable = (value) => {
        props.filtering(value);
        setActivePage(1);
    };

    const handleSort = (params) => {
        setSortParams(params);
        setActivePage(1);
    };

    let sortedData = dataTable;

    if (sortParams && sortParams.firstField) {
        const numericFields = ["Год", "Высота"];

        sortedData = [...dataTable].sort((a, b) => {
            const val1A = a[sortParams.firstField];
            const val1B = b[sortParams.firstField];

            let comparison1 = 0;
            if (numericFields.includes(sortParams.firstField)) {
                comparison1 = Number(val1A) - Number(val1B);
            } else {
                comparison1 = String(val1A).localeCompare(String(val1B));
            }

            if (comparison1 !== 0) {
                return sortParams.firstDesc ? -comparison1 : comparison1;
            }

            if (sortParams.secondField) {
                const val2A = a[sortParams.secondField];
                const val2B = b[sortParams.secondField];

                let comparison2 = 0;
                if (numericFields.includes(sortParams.secondField)) {
                    comparison2 = Number(val2A) - Number(val2B);
                } else {
                    comparison2 = String(val2A).localeCompare(String(val2B));
                }

                if (comparison2 !== 0) {
                    return sortParams.secondDesc ? -comparison2 : comparison2;
                }

                if (sortParams.thirdField) {
                    const val3A = a[sortParams.thirdField];
                    const val3B = b[sortParams.thirdField];

                    let comparison3 = 0;
                    if (numericFields.includes(sortParams.thirdField)) {
                        comparison3 = Number(val3A) - Number(val3B);
                    } else {
                        comparison3 = String(val3A).localeCompare(String(val3B));
                    }

                    if (comparison3 !== 0) {
                        return sortParams.thirdDesc ? -comparison3 : comparison3;
                    }
                }
            }
            return 0;
        });
    }

    const currentAmountRows = props.showPagination ? Number(props.amountRows) : Math.max(sortedData.length, 1);
    const n = Math.ceil(sortedData.length / currentAmountRows);
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const changeActive = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const pages = arr.map((item, index) =>  
          <span key={ index } className={item === activePage ? "active-page" : ""} onClick={ () => changeActive(item) } 
          style={{ margin: "0 5px", cursor: "pointer", fontWeight: item === activePage ? "bold" : "normal" }}> { item } </span>
    );
    
    return( 
      <>
        <div style={{ display: 'flex', gap: '50px' }}>
            <div>
                <h4>Фильтры</h4>
                <Filter filtering={ updateDataTable } data={ dataTable } fullData={ props.data }/>
            </div>
            <div>
                 <Sort data={props.data} onSort={handleSort} />
            </div>
        </div>

        <table>
            <TableHead head={ Object.keys(props.data[0]) } />
            <TableBody body={ sortedData } amountRows={ currentAmountRows } numPage={activePage}/>
        </table>

        {props.showPagination && (
	        <div style={{ marginTop: "10px" }}>
              {pages}
            </div>
        )}
	  </>   
    )   
}

export default Table;
