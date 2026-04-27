import { useState } from 'react';
import './CSS/App.css';
import buildings from './data.js';
import Table from './components/Table.js';
import Chart from './components/Chart.js';


function App() {
  const [filteredData, setFilteredData] = useState(buildings);

  return (
    <div className="App">
       <h3>Самые высокие здания и сооружения</h3>
	     <Chart data={ filteredData } />
       <Table data={ buildings } filteredData={ filteredData } filtering={ setFilteredData } amountRows="10" />
    </div>
  );
}

export default App;