import React, { useState } from 'react';
import './LLMDialog.css';
import APISettings from './APISettings';

function LLMDialog({ onDataPointsGenerated }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiType, setApiType] = useState('openai');

  const callLLMAPI = async (message) => {
    if (!apiKey) {
      throw new Error(`请先配置${apiType === 'openai' ? 'OpenAI' : 'Google Gemini'} API密钥`);
    }

    if (apiType === 'gemini') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: message }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API调用失败');
      }

      const data = await response.json();
      return {
        text: data.candidates[0].content.parts[0].text,
        dataPoints: extractDataPoints(message)
      };
    }

    // TODO: 实现OpenAI API调用
    // 这里暂时使用模拟响应
    return mockLLMResponse(message);
  };

  const extractDataPoints = (input) => {
    const patterns = [
      /x\s*是\s*(\d+(\.\d+)?)\s*时\s*y\s*是\s*(\d+(\.\d+)?)/g,
      /\((\d+(\.\d+)?),\s*(\d+(\.\d+)?)\)/g,
      /x\s*=\s*(\d+(\.\d+)?)\s*,\s*y\s*=\s*(\d+(\.\d+)?)/g
    ];

    const dataPoints = [];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(input)) !== null) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[3] || match[2]);
        if (!isNaN(x) && !isNaN(y)) {
          dataPoints.push({ x, y });
        }
      }
    }

    const numbers = input.match(/\d+(\.\d+)?/g);
    if (numbers && numbers.length >= 2) {
      for (let i = 0; i < numbers.length - 1; i += 2) {
        dataPoints.push({
          x: parseFloat(numbers[i]),
          y: parseFloat(numbers[i + 1])
        });
      }
    }

    return dataPoints;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMessage = {
      role: 'user',
      content: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await callLLMAPI(inputText);
      const aiMessage = {
        role: 'assistant',
        content: response.text
      };

      setMessages(prev => [...prev, aiMessage]);

      // 尝试从对话中提取数据点
      if (response.dataPoints && response.dataPoints.length > 0) {
        onDataPointsGenerated(response.dataPoints);
      }
    } catch (error) {
      console.error('LLM对话出错:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 模拟LLM响应，用于开发测试
  const mockLLMResponse = async (input) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 尝试匹配更复杂的数据描述
    const patterns = [
      // 匹配"x是2时y是4"格式
      /x\s*是\s*(\d+(\.\d+)?)\s*时\s*y\s*是\s*(\d+(\.\d+)?)/g,
      // 匹配"(2,4)"格式
      /\((\d+(\.\d+)?),\s*(\d+(\.\d+)?)\)/g,
      // 匹配"x=2,y=4"格式
      /x\s*=\s*(\d+(\.\d+)?)\s*,\s*y\s*=\s*(\d+(\.\d+)?)/g
    ];

    const dataPoints = [];
    let foundData = false;

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(input)) !== null) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[3] || match[2]);
        if (!isNaN(x) && !isNaN(y)) {
          dataPoints.push({ x, y });
          foundData = true;
        }
      }
    }
    // 示例：从对话中提取数字对作为数据点
    const numbers = input.match(/\d+(\.\d+)?/g);
    if (numbers && numbers.length >= 2) {
      const dataPoints = [];
      for (let i = 0; i < numbers.length - 1; i += 2) {
        dataPoints.push({
          x: parseFloat(numbers[i]),
          y: parseFloat(numbers[i + 1])
        });
      }
      return {
        text: `我从您的描述中提取到了${dataPoints.length}个数据点。`,
        dataPoints
      };
    }
    return {
      text: '请提供包含数字的描述，我将帮您提取数据点。例如："当x是2时y是4，当x是3时y是9"',
      dataPoints: []
    };
  };

  return (
    <div className="llm-dialog">
      <h2>AI对话</h2>
      <div className="usage-guide">
        <h3>使用说明</h3>
        <p>您可以通过以下方式描述数据点：</p>
        <ul>
          <li>自然语言描述："当x是2时y是4，当x是3时y是9"</li>
          <li>坐标形式："(2,4) (3,9)"</li>
          <li>等式形式："x=2,y=4 x=3,y=9"</li>
        </ul>
        <p>系统会自动从您的描述中提取数据点并显示在图表中。</p>
      </div>
      <APISettings
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        apiType={apiType}
        onApiTypeChange={setApiType}
      />
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="描述您的数据关系，例如：当x是2时y是4..."
          disabled={isProcessing}
        />
        <button onClick={sendMessage} disabled={isProcessing || !apiKey}>
          {isProcessing ? '处理中...' : '发送'}
        </button>
      </div>
    </div>
  );
}

export default LLMDialog;