import React, { useState, useEffect } from 'react';
import './App.css';
import DataInput from './components/DataInput';
import FormulaDisplay from './components/FormulaDisplay';
import EvolutionChart from './components/EvolutionChart';
import EvolutionControls from './components/EvolutionControls';
import LLMDialog from './components/LLMDialog';
import PaymentWindow from './components/PaymentWindow';
import FormulaEvolutionSystem from './core/formulaEvolution';

function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [formulaSystem, setFormulaSystem] = useState(null);
  const [evolutionHistory, setEvolutionHistory] = useState([]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [bestFormula, setBestFormula] = useState(null);
  
  // 初始化公式进化系统
  useEffect(() => {
    const system = new FormulaEvolutionSystem(20);
    const templates = ['x', 'x^2', 'x^3', 'sin(x)', 'cos(x)', 'log(x)', 'exp(x)', 
                      'x+1', 'x^2+x', '2*x', 'sqrt(x)'];
    system.initializePopulation(templates);
    setFormulaSystem(system);
  }, []);
  
  // 开始进化过程
  const startEvolution = (generations = 10) => {
    if (!formulaSystem || dataPoints.length < 2 || isEvolving) return;
    
    setIsEvolving(true);
    
    try {
      const history = formulaSystem.evolve(dataPoints, generations);
      setEvolutionHistory(prev => [...prev, ...history]);
      
      if (history.length > 0) {
        setBestFormula(history[history.length - 1].bestFormula);
      }
    } catch (error) {
      console.error('进化过程出错:', error);
    } finally {
      setIsEvolving(false);
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>活的生成式数据反应堆</h1>
        <p>从"1"到现实的公式进化系统</p>
      </header>
      
      <main className="App-main">
        <div className="left-panel">
          <PaymentWindow />
          <LLMDialog 
            onDataPointsGenerated={(points) => setDataPoints(prev => [...prev, ...points])} 
          />
          <DataInput 
            dataPoints={dataPoints} 
            setDataPoints={setDataPoints} 
          />
          <EvolutionControls 
            startEvolution={startEvolution}
            isEvolving={isEvolving}
          />
        </div>
        
        <div className="right-panel">
          <FormulaDisplay 
            bestFormula={bestFormula}
            dataPoints={dataPoints}
          />
          <EvolutionChart 
            evolutionHistory={evolutionHistory}
          />
        </div>
      </main>
    </div>
  );
}

export default App;