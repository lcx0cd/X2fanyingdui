import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './EvolutionChart.css';

function EvolutionChart({ evolutionHistory }) {
  if (evolutionHistory.length === 0) {
    return (
      <div className="evolution-chart">
        <h2>进化历史</h2>
        <p>尚无进化历史数据</p>
      </div>
    );
  }
  
  const chartData = {
    labels: evolutionHistory.map(entry => `第${entry.generation}代`),
    datasets: [
      {
        label: '最佳适应度',
        data: evolutionHistory.map(entry => entry.bestFitness),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: '种群多样性',
        data: evolutionHistory.map(entry => entry.populationDiversity),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4,
      }
    ]
  };
  
  return (
    <div className="evolution-chart">
      <h2>进化历史</h2>
      
      <div className="chart-container">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 1
              }
            }
          }}
        />
      </div>
      
      <div className="evolution-table">
        <h3>最近的进化结果</h3>
        <table>
          <thead>
            <tr>
              <th>代数</th>
              <th>最佳公式</th>
              <th>适应度</th>
            </tr>
          </thead>
          <tbody>
            {evolutionHistory.slice(-5).map((entry, index) => (
              <tr key={index}>
                <td>{entry.generation}</td>
                <td>{entry.bestFormula}</td>
                <td>{entry.bestFitness.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EvolutionChart;