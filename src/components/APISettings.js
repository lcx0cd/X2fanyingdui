import React, { useState } from 'react';
import './APISettings.css';

function APISettings({ apiKey, onApiKeyChange, apiType, onApiTypeChange }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="api-settings">
      <h3>API配置</h3>
      <div className="api-type-select">
        <label>选择API类型：</label>
        <select value={apiType} onChange={(e) => onApiTypeChange(e.target.value)}>
          <option value="openai">OpenAI</option>
          <option value="gemini">Google Gemini</option>
        </select>
      </div>
      <div className="api-key-input">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={`请输入${apiType === 'openai' ? 'OpenAI' : 'Google Gemini'} API密钥`}
        />
        <button 
          className="toggle-visibility"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? '隐藏' : '显示'}
        </button>
      </div>
    </div>
  );
}

export default APISettings;