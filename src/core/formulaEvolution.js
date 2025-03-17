export default class FormulaEvolutionSystem {
  constructor(initialPopulationSize = 20) {
    this.population = [];
    this.generations = 0;
    this.initialPopulationSize = initialPopulationSize;
  }
  
  // 初始化公式种群
  initializePopulation(formulaTemplates) {
    this.population = [];
    for (let i = 0; i < this.initialPopulationSize; i++) {
      const randomTemplate = formulaTemplates[Math.floor(Math.random() * formulaTemplates.length)];
      this.population.push(this.mutateFormula(randomTemplate));
    }
  }
  
  // 评估种群中每个公式的适应度
  evaluatePopulation(dataPoints) {
    return this.population.map(formula => ({
      formula,
      fitness: this.calculateFitness(formula, dataPoints)
    })).sort((a, b) => b.fitness - a.fitness);
  }
  
  // 进化过程 - 包含选择、交叉和变异
  evolve(dataPoints, generations = 10) {
    let evolutionHistory = [];
    
    for (let gen = 0; gen < generations; gen++) {
      // 评估当前种群
      const evaluated = this.evaluatePopulation(dataPoints);
      evolutionHistory.push({
        generation: this.generations + gen,
        bestFormula: evaluated[0].formula,
        bestFitness: evaluated[0].fitness,
        populationDiversity: this.calculateDiversity(evaluated)
      });
      
      // 选择精英直接进入下一代
      const eliteCount = Math.max(1, Math.floor(this.population.length * 0.2));
      const newPopulation = evaluated.slice(0, eliteCount).map(e => e.formula);
      
      // 生成新一代
      while (newPopulation.length < this.population.length) {
        const parent1 = this.selectParent(evaluated);
        const parent2 = this.selectParent(evaluated);
        const child = this.crossover(parent1, parent2);
        const mutatedChild = Math.random() < 0.7 ? this.mutateFormula(child) : child;
        newPopulation.push(mutatedChild);
      }
      
      this.population = newPopulation;
    }
    
    this.generations += generations;
    return evolutionHistory;
  }
  
  // 计算公式的适应度（拟合度）
  calculateFitness(formula, dataPoints) {
    if (dataPoints.length === 0) return 0;
    
    try {
      let sumSquaredError = 0;
      
      for (const point of dataPoints) {
        const predicted = this.evaluateFormula(formula, point.x);
        if (isNaN(predicted) || !isFinite(predicted)) {
          return 0; // 无效结果，适应度为0
        }
        const error = predicted - point.y;
        sumSquaredError += error * error;
      }
      
      // 转换为适应度（越小的误差对应越高的适应度）
      const mse = sumSquaredError / dataPoints.length;
      return 1 / (1 + mse); // 适应度范围在0到1之间
    } catch (error) {
      return 0; // 计算出错，适应度为0
    }
  }
  
  // 评估公式在给定x值的结果
  evaluateFormula(formula, x) {
    try {
      // 创建安全的计算环境
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
      console.error(`公式计算错误: ${formula}`, error);
      return NaN;
    }
  }
  
  // 公式变异
  mutateFormula(formula) {
    // 随机选择变异类型
    const mutationType = Math.random();
    
    if (mutationType < 0.3) {
      // 参数微调
      return this.mutateParameters(formula);
    } else if (mutationType < 0.6) {
      // 结构变异（添加/删除/替换操作符）
      return this.mutateStructure(formula);
    } else {
      // 函数变异（添加/删除/替换数学函数）
      return this.mutateFunctions(formula);
    }
  }
  
  // 参数微调变异
  mutateParameters(formula) {
    // 查找数字并随机调整
    return formula.replace(/(\d+(\.\d+)?)/g, (match) => {
      const num = parseFloat(match);
      // 上下浮动20%
      const adjustment = (Math.random() * 0.4 - 0.2) * num;
      return (num + adjustment).toFixed(4).replace(/\.?0+$/, '');
    });
  }
  
  // 结构变异
  mutateStructure(formula) {
    const operators = ['+', '-', '*', '/'];
    const randomOp = operators[Math.floor(Math.random() * operators.length)];
    
    // 简单替换操作符
    if (formula.includes('+') || formula.includes('-') || 
        formula.includes('*') || formula.includes('/')) {
      return formula.replace(/[+\-*/]/, randomOp);
    }
    
    // 如果没有操作符，添加一个简单操作
    return `${formula} ${randomOp} ${Math.floor(Math.random() * 10)}`;
  }
  
  // 函数变异
  mutateFunctions(formula) {
    const functions = ['sin', 'cos', 'exp', 'log', 'sqrt', 'pow'];
    const randomFunc = functions[Math.floor(Math.random() * functions.length)];
    
    if (formula.match(/sin|cos|exp|log|sqrt|pow/)) {
      // 替换现有函数
      return formula.replace(/(sin|cos|exp|log|sqrt|pow)/, randomFunc);
    } else if (Math.random() < 0.7) {
      // 添加新函数
      return `${randomFunc}(${formula})`;
    }
    
    return formula;
  }
  
  // 选择父代公式
  selectParent(evaluatedPopulation) {
    // 使用轮盘赌选择法
    const totalFitness = evaluatedPopulation.reduce((sum, item) => sum + item.fitness, 0);
    let randomPoint = Math.random() * totalFitness;
    
    for (const item of evaluatedPopulation) {
      randomPoint -= item.fitness;
      if (randomPoint <= 0) {
        return item.formula;
      }
    }
    
    // 防止浮点误差导致没有选中
    return evaluatedPopulation[0].formula;
  }
  
  // 公式交叉
  crossover(parent1, parent2) {
    if (Math.random() < 0.5) {
      // 简单交换
      const terms1 = parent1.split(/([+\-*/])/);
      const terms2 = parent2.split(/([+\-*/])/);
      
      if (terms1.length >= 3 && terms2.length >= 3) {
        const crossPoint1 = Math.floor(Math.random() * (terms1.length - 2)) + 2;
        const crossPoint2 = Math.floor(Math.random() * (terms2.length - 2)) + 2;
        
        const child = terms1.slice(0, crossPoint1).concat(terms2.slice(crossPoint2));
        return child.join('');
      }
    }
    
    // 函数替换
    if (parent1.match(/sin|cos|exp|log|sqrt|pow/) && parent2.match(/sin|cos|exp|log|sqrt|pow/)) {
      const func1 = parent1.match(/(sin|cos|exp|log|sqrt|pow)/)[0];
      const func2 = parent2.match(/(sin|cos|exp|log|sqrt|pow)/)[0];
      
      return parent1.replace(func1, func2);
    }
    
    // 默认返回随机选择的父代
    return Math.random() < 0.5 ? parent1 : parent2;
  }
  
  // 计算种群多样性
  calculateDiversity(evaluatedPopulation) {
    // 简单实现：计算不同公式的数量占总数的比例
    const uniqueFormulas = new Set(evaluatedPopulation.map(item => item.formula));
    return uniqueFormulas.size / evaluatedPopulation.length;
  }
}