import React, { useState } from 'react';
import './Table.css';

const Merge = () => {
  const [startTD, setStartTD] = useState(null);
  const [startIndex, setStartIndex] = useState(null);
  const [endTD, setEndTD] = useState(null);
  const [endIndex, setEndIndex] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleCellMouseDown = (x, y) => {
    setStartTD([x, y]);
    setStartIndex({ x, y });
    clearHighlightedCells();
  };

  const handleCellMouseUp = (x, y) => {
    setEndTD([x, y]);
    setEndIndex({ x, y });
    selectCells(startIndex, { x, y }, 'green');
  };

  const clearHighlightedCells = () => {
    const newData = tableData.map((row) =>
      row.map((cell) => ({ ...cell, isHighlighted: false }))
    );
    setTableData(newData);
  };

  const selectCells = (start, end, color) => {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    const newData = tableData.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        isHighlighted: rowIndex >= minX && rowIndex <= maxX && colIndex >= minY && colIndex <= maxY,
      }))
    );
    setTableData(newData);
  };

  const mergeCells = () => {
    const rowSpan = endIndex.x - startIndex.x + 1;
    const colSpan = endIndex.y - startIndex.y + 1;

    const newData = tableData.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === startIndex.x && colIndex === startIndex.y) {
          return { ...cell, rowSpan, colSpan };
        }
        if (
          rowIndex >= startIndex.x &&
          rowIndex <= endIndex.x &&
          colIndex >= startIndex.y &&
          colIndex <= endIndex.y
        ) {
          return { ...cell, isHidden: true };
        }
        return cell;
      })
    );
    setTableData(newData);
  };

  const renderTable = () => {
    return tableData.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, colIndex) => {
          const { text, isHighlighted, rowSpan, colSpan, isHidden } = cell;
          if (isHidden) {
            return null;
          }
          return (
            <td
              key={colIndex}
              rowSpan={rowSpan}
              colSpan={colSpan}
              className={isHighlighted ? 'highlighted' : ''}
              onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
              onMouseUp={() => handleCellMouseUp(rowIndex, colIndex)}
            >
              {text}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <table className="thread-table">
        <tbody>{renderTable()}</tbody>
      </table>
      <button className="merge-button" onClick={mergeCells}>
        Merge Cells
      </button>
    </div>
  );
};

export default Merge;
