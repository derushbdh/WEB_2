import React, { useState } from "react";

const Sort = ({ data, onSort }) => {
    const fields = Object.keys(data[0] || {});
    
    const [firstField, setFirstField] = useState("");
    const [firstDesc, setFirstDesc] = useState(false);
    
    const [secondField, setSecondField] = useState("");
    const [secondDesc, setSecondDesc] = useState(false);

    const [thirdField, setThirdField] = useState("");
    const [thirdDesc, setThirdDesc] = useState(false);

    const handleSort = () => {
        onSort({
            firstField,
            firstDesc,
            secondField,
            secondDesc,
            thirdField,
            thirdDesc
        });
    };

    const handleReset = () => {
        setFirstField("");
        setFirstDesc(false);
        setSecondField("");
        setSecondDesc(false);
        setThirdField("");
        setThirdDesc(false);
        onSort(null);
    };

    const secondFieldOptions = fields.filter(f => f !== firstField);
    const thirdFieldOptions = fields.filter(f => f !== firstField && f !== secondField);

    return (
        <div style={{ marginBottom: "20px" }}>
            <h4>Сортировка</h4>
            <div style={{ marginBottom: "5px", cursor: "default" }}>
                Сортировать по:
            </div>
            
            <div style={{ marginBottom: "10px" }}>
                <select value={firstField} onChange={(e) => {
                    setFirstField(e.target.value);
                    if (e.target.value === "") {
                        setSecondField("");
                        setThirdField("");
                    } else if (secondField === e.target.value) {
                        setSecondField("");
                        setThirdField("");
                    } else if (thirdField === e.target.value) {
                        setThirdField("");
                    }
                }}>
                    <option value="">Нет</option>
                    {fields.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
                <label style={{ marginLeft: "10px" }}>
                    по убыванию?
                    <input type="checkbox" checked={firstDesc} onChange={(e) => setFirstDesc(e.target.checked)} />
                </label>
            </div>
            
            <div style={{ marginBottom: "10px" }}>
                <select value={secondField} onChange={(e) => {
                    setSecondField(e.target.value);
                    if (e.target.value === "") {
                        setThirdField("");
                    } else if (thirdField === e.target.value) {
                        setThirdField("");
                    }
                }} disabled={!firstField}>
                    <option value="">Нет</option>
                    {secondFieldOptions.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
                <label style={{ marginLeft: "10px" }}>
                    по убыванию?
                    <input type="checkbox" checked={secondDesc} onChange={(e) => setSecondDesc(e.target.checked)} disabled={!firstField} />
                </label>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <select value={thirdField} onChange={(e) => setThirdField(e.target.value)} disabled={!secondField}>
                    <option value="">Нет</option>
                    {thirdFieldOptions.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
                <label style={{ marginLeft: "10px" }}>
                    по убыванию?
                    <input type="checkbox" checked={thirdDesc} onChange={(e) => setThirdDesc(e.target.checked)} disabled={!secondField} />
                </label>
            </div>

            <button onClick={handleSort} style={{ marginRight: "10px" }}>Сортировать</button>
            <button onClick={handleReset}>Сбросить сортировку</button>
        </div>
    );
};

export default Sort;