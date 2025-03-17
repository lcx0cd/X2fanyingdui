import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './FormulaDisplay.css';

function FormulaDisplay({ bestFormula, dataPoints }) {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (!bestFormula || dataPoints.length === 0) {
      setChartData(null);
      return;
    }
    
    try {
      // 生成图表数据
      const xValues = dataPoints.map(point => point.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const range = maxX - minX;
      
      // 生成更多点以平滑曲线
      const chartPoints = [];
      for (let i = 0; i <= 100; i++) {
        const x = minX + (range * i / 100);
        const y = evaluateFormula(bestFormula, x);
        chartPoints.push({ x, y });
      }
      
      setChartData({
        labels: chartPoints.map(p => p.x.toFixed(1)),
        datasets: [
          {
            label: '公式预测',
            data: chartPoints.map(p => p.y),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
          },
          {
            label: '实际数据',
            data: dataPoints.map(p => ({ x: p.x, y: p.y })),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 5,
            showLine: false,
          }
        ]
      });
    } catch (error) {
      console.error('生成图表数据出错:', error);
    }
  }, [bestFormula, dataPoints]);
  
  // 简单的公式计算函数
  const evaluateFormula = (formula, x) => {
    try {
      // 安全的公式计算
      const mathFunctions = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        exp: Math.exp,
        log: Math.log,
        sqrt: Math.sqrt,
        abs: Math.abs,
        pow: Math.pow,
        PI: Math.PI,
        E: Math.E
      };
      
      // 使用Function构造函数创建函数
      const func = new Function('x', 'Math', `return ${formula}`);
      return func(x, mathFunctions);
    } catch (error) {
      console.error('公式计算错误:', error);
      return NaN;
    }
  };
  
  return (
    <div className="formula-display">
      <h2>公式展示</h2>
      
      <div className="formula-result">
        <h3>最佳公式:</h3>
        {bestFormula ? (
          <div className="formula-text">y = {bestFormula}</div>
        ) : (
          <p>尚未找到公式，请开始进化过程</p>
        )}
      </div>
      
      <div className="formula-chart">
        {chartData ? (
          <Line 
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'X值'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Y值'
                  }
                }
              }
            }}
          />
        ) : (
          <p>暂无图表数据</p>
        )}
      </div>
    </div>
  );
}

export default FormulaDisplay;