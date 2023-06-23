import React, { useState, useRef } from 'react';
import './TableResize.css';

const TableResizer = () => {
  const [tableData, setTableData] = useState([
    ['', ''],
    ['', ''],
  ]);
  const [resizing, setResizing] = useState(false);
  const [resizeColumnIndex, setResizeColumnIndex] = useState(null);
  const [resizeRowIndex, setResizeRowIndex] = useState(null);

  const tableRef = useRef(null);

  const handleCellChange = (rowIndex, colIndex, event) => {
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) => (j === colIndex ? event.target.value : cell));
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleColumnResizeStart = (colIndex) => {
    setResizing(true);
    setResizeColumnIndex(colIndex);
  };

  const handleRowResizeStart = (rowIndex) => {
    setResizing(true);
    setResizeRowIndex(rowIndex);
  };

  const handleResizeMouseMove = (e) => {
    if (resizing) {
      const { clientX, clientY } = e;
      const table = tableRef.current;
      const { offsetTop, offsetLeft } = table;
      const { rows, cols } = tableData;

      if (resizeColumnIndex !== null) {
        const newWidth = Math.max(clientX - offsetLeft, 50); // Minimum width of 50px
        const updatedCols = cols.map((col, index) =>
          index === resizeColumnIndex ? newWidth : col
        );
        setTableData({ rows, cols: updatedCols });
      }

      if (resizeRowIndex !== null) {
        const newHeight = Math.max(clientY - offsetTop, 50); // Minimum height of 50px
        const updatedRows = rows.map((row, index) =>
          index === resizeRowIndex ? newHeight : row
        );
        setTableData({ rows: updatedRows, cols });
      }
    }
  };

  const handleResizeMouseUp = () => {
    setResizing(false);
    setResizeColumnIndex(null);
    setResizeRowIndex(null);
  };

  return (
    <div className="table-container">
      <table className="resize-table" ref={tableRef}>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <div className="cell-content">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e)}
                    />
                  </div>
                  {colIndex === row.length - 1 && (
                    <div
                      className="resize-handle-column"
                      onMouseDown={() => handleColumnResizeStart(colIndex)}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            {tableData[0].map((_, colIndex) => (
              <td key={colIndex} className="resize-handle-row" onMouseDown={() => handleRowResizeStart(colIndex)} />
            ))}
          </tr>
        </tbody>
      </table>
      {resizing && (
        <div
          className="resize-overlay"
          onMouseMove={handleResizeMouseMove}
          onMouseUp={handleResizeMouseUp}
        />
      )}
    </div>
  );
};

export default TableResizer;
