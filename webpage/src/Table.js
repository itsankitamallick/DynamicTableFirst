import React, { useState } from 'react';
import './Table.css';

const Table = () => {
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(2);
  const [tableData, setTableData] = useState([['', ''], ['', '']]);
  

  const handleAddRow = () => {
    setRows(rows + 1);
    setTableData(prevData => [...prevData, Array(columns).fill('')]);
  };

  const handleAddColumn = () => {
    setColumns(columns + 1);
    setTableData(prevData => prevData.map(row => [...row, '']));
  };

  const handleCellChange = (rowIndex, colIndex, event) => {
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) => (j === colIndex ? event.target.value : cell));
      }
      return row;
    });
    setTableData(updatedData);
  };
  
  const renderTable = () => {
    return tableData.map((row, rowIndex) => {
      const rowData = row.map((cellData, colIndex) => (
        <td key={colIndex}>
          <input
            type="text"
            value={cellData}
            onChange={event => handleCellChange(rowIndex, colIndex, event)}
          />
        </td>
      ));
      return <tr key={rowIndex}>{rowData}</tr>;
    });
  };

  return (
    <div className="table-container">
      <button className="add-column-button" onClick={handleAddColumn}>
        +
      </button>
      <table className="thread-table">
        <tbody>{renderTable()}</tbody>
      </table>
      <button className="add-row-button" onClick={handleAddRow}>
        +
      </button>
      
     
    </div>
  );
};

export default Table;
