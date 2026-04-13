import { useState, useMemo } from "react";
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import Sort from './Sort.js';

const Table = (props) => {
    const [activePage, setActivePage] = useState(1);
    const [dataTable, setDataTable] = useState(props.data);
    const [sortParams, setSortParams] = useState(null);

    const updateDataTable = (value) => {
        setDataTable(value);
        setActivePage(1);
    };

    const handleSort = (params) => {
        setSortParams(params);
        setActivePage(1);
    };

    const sortedData = useMemo(() => {
        if (!sortParams || !sortParams.firstField) {
            return dataTable;
        }

        const numericFields = ["Год", "Высота"];

        return [...dataTable].sort((a, b) => {
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
            }
            return 0;
        });
    }, [dataTable, sortParams]);

    const currentAmountRows = props.showPagination ? props.amountRows : sortedData.length;
    const n = Math.ceil(sortedData.length / currentAmountRows);
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const changeActive = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const pages = arr.map((item, index) =>  
          <span key={ index } className={item === activePage ? "active-page" : ""} onClick={ () => changeActive(item) } style={{ margin: "0 5px", cursor: "pointer", fontWeight: item === activePage ? "bold" : "normal" }}> { item } </span>
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