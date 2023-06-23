import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import './Table.css';


const Table = () => {
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(2);
  const [tableData, setTableData] = useState([['', ''], ['', '']]);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  

  useEffect(() => {
    $("td").unbind("mousedown").bind("mousedown", function() {
      $("table td").css("background-color", "");
      const targetCell = $(this);
      targetCell.css("background-color", "green");
      const rowIndex = targetCell.parent().index();
      const colIndex = targetCell.index();
      setStartCell({ rowIndex, colIndex });
    });

    $("td").unbind("mouseup").bind("mouseup", function() {
      const targetCell = $(this);
      targetCell.css("background-color", "green");
      const rowIndex = targetCell.parent().index();
      const colIndex = targetCell.index();
      setEndCell({ rowIndex, colIndex });
    });

    $("#btMerge").click(function() {
      mergeCells(startCell, endCell);
      setStartCell(null);
      setEndCell(null);
    });
  }, [startCell, endCell]);

  const handleAddRow = () => {
    setRows(rows + 1);
    setTableData((prevData) => [...prevData, Array(columns).fill('')]);
  };

  const handleAddColumn = () => {
    setColumns(columns + 1);
    setTableData((prevData) => prevData.map((row) => [...row, '']));
  };

  const handleCellChange = (rowIndex, colIndex, event) => {
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex) {
        return row.map((cell, j) =>
          j === colIndex ? event.target.value : cell
        );
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleDeleteRow = (rowIndex) => {
    setRows(rows - 1);
    const updatedData = tableData.filter((row, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  const handleResize = (event, rowIndex, colIndex) => {
    const table = $(".thread-table");
    const targetCell = table.find("tr").eq(rowIndex).find("td").eq(colIndex);
    const startWidth = targetCell.outerWidth();
    const startHeight=targetCell.outerHeight();
    const startX = event.clientX;
    const startY=event.clientY;

    const handleMouseMove = (event) => {
      const diffX = event.clientX - startX;
      const diffY = event.clientY - startY;
      const newWidth = Math.max(startWidth + diffX, 20);
      const newHeight = Math.max(startHeight + diffY,20);
      targetCell.outerWidth(newWidth);
      targetCell.outerHeight(newHeight);
    };

    const handleMouseUp = () => {
      $(window).unbind("mousemove", handleMouseMove);
      $(window).unbind("mouseup", handleMouseUp);
    };

    $(window).bind("mousemove", handleMouseMove);
    $(window).bind("mouseup", handleMouseUp);
  };

  const mergeCells = (startCell, endCell) => {
    if (startCell && endCell) {
      const { rowIndex: startX, colIndex: startY } = startCell;
      const { rowIndex: endX, colIndex: endY } = endCell;

      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);

      const startTR = $("table tr").eq(minX);
      const startTD = $("td", startTR).eq(minY);
      const rowspan = maxX - minX + 1;
      const colspan = maxY - minY + 1;

      startTD.attr("rowspan", rowspan).attr("colspan", colspan);

      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          if (i === minX && j === minY) continue;
          const selectTR = $("table tr").eq(i);
          $("td", selectTR).eq(j).hide();
        }
      }
    }
  };

  const renderTable = () => {
    return tableData.map((row, rowIndex) => {
      const rowData = row.map((cellData, colIndex) => (
        <td
          key={colIndex}
          className="resizable"
          onMouseDown={(event) => handleResize(event, rowIndex, colIndex)}
        >
          <div className="cell-content">
            <input
              type="text"
              value={cellData || ""}
              onChange={(event) => handleCellChange(rowIndex, colIndex, event)}
            />
          </div>
          
          <div
            className="resize-handle-column"
            onMouseDown={(event) => handleResize(event, rowIndex, colIndex)}
          ></div>
          <div
            className="resize-handle-row"
            onMouseDown={(event) => handleResize(event, rowIndex, colIndex)}
          ></div>
        </td>
      ));
      return (
        <tr key={rowIndex}>
          {rowData}
          <td>
            <button onClick={() => handleDeleteRow(rowIndex)}>X</button>
          </td>
        </tr>
      );
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
      <button id="btMerge">Merge Cells</button>
    </div>
  );
};

export default Table;
