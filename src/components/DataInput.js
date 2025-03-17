import React, { useState } from 'react';
import './DataInput.css';

function DataInput({ dataPoints, setDataPoints }) {
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  
  const addDataPoint = () => {
    const x = parseFloat(xValue);
    const y = parseFloat(yValue);
    
    if (!isNaN(x) && !isNaN(y)) {
      setDataPoints([...dataPoints, { x, y }]);
      setXValue('');
      setYValue('');
    }
  };
  
  const removeDataPoint = (index) => {
    setDataPoints(dataPoints.filter((_, i) => i !== index));
  };
  
  const clearAllData = () => {
    setDataPoints([]);
  };
  
  return (
    <div className="data-input">
      <h2>数据输入</h2>
      
      <div className="input-controls">
        <div className="input-group">
          <label>X值:</label>
          <input 
            type="number" 
            value={xValue} 
            onChange={(e) => setXValue(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label>Y值:</label>
          <input 
            type="number" 
            value={yValue} 
            onChange={(e) => setYValue(e.target.value)}
          />
        </div>
        
        <button onClick={addDataPoint}>添加数据点</button>
        <button onClick={clearAllData}>清空所有</button>
      </div>
      
      <div className="data-table">
        <h3>当前数据点</h3>
        {dataPoints.length === 0 ? (
          <p>暂无数据，请添加数据点</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {dataPoints.map((point, index) => (
                <tr key={index}>
                  <td>{point.x}</td>
                  <td>{point.y}</td>
                  <td>
                    <button onClick={() => removeDataPoint(index)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DataInput;