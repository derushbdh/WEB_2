import { useState } from "react";
import * as d3 from "d3";
import ChartDraw from "./ChartDraw.js";

const Chart = (props) => {
    const [ox, setOx] = useState("Год");
    const [oy, setOy] = useState([true, false]);
    const [chartType, setChartType] = useState("bar");
    const [oyError, setOyError] = useState(false);

    const handleOyChange = (event) => {
        const checkboxes = event.target.form["oy"];
        const selectedOy = [
            checkboxes[0].checked,
            checkboxes[1].checked
        ];

        if (selectedOy[0] || selectedOy[1]) {
            setOyError(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const selectedOy = [
            event.target["oy"][0].checked,
            event.target["oy"][1].checked
        ];

        if (!selectedOy[0] && !selectedOy[1]) {
            setOyError(true);
            setOy(selectedOy);
            return;
        }

        setOyError(false);
        setOx(event.target["ox"].value);
        setOy(selectedOy);
        setChartType(event.target["chartType"].value);
    }

    const createArrGraph = (data, key) => {
        const groupObj = d3.group(data, d => d[key]);
        let arrGraph = [];

        for (let entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d["Высота"]));
            arrGraph.push({ labelX: entry[0], values: minMax });
        }

        if (key === "Год") {
            arrGraph.sort((a, b) => a.labelX - b.labelX);
        }

        return arrGraph;
    }

    return (
        <>
            <h4>Визуализация</h4>
            <form onSubmit={handleSubmit}>
                <p>Значение по оси OX:</p>
                <div>
                    <input type="radio" name="ox" value="Страна" defaultChecked={ox === "Страна"} />
                    Страна
                    <br />
                    <input type="radio" name="ox" value="Год" defaultChecked={ox === "Год"} />
                    Год
                </div>

                <p>Значение по оси OY:</p>
                <div>
                    <input type="checkbox" name="oy" defaultChecked={oy[0]} onChange={handleOyChange} />
                    <span className={oyError ? "oy-error" : ""}>Максимальная высота</span>
                    <br />
                    <input type="checkbox" name="oy" defaultChecked={oy[1]} onChange={handleOyChange} />
                    <span className={oyError ? "oy-error" : ""}>Минимальная высота</span>
                </div>

                <p>
                    Тип диаграммы
                    <select name="chartType" defaultValue={chartType}>
                        <option value="scatter">Точечная диаграмма</option>
                        <option value="bar">Гистограмма</option>
                    </select>
                </p>

                <p>
                    <button type="submit">Построить</button>
                </p>
            </form>

            {props.data.length > 0 &&
                <ChartDraw data={createArrGraph(props.data, ox)} oy={oy} chartType={chartType} />}
        </>
    )
}

export default Chart;