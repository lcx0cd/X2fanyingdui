# 公式演化系统

一个基于React的智能公式演化系统，通过AI对话和数据可视化帮助用户探索数据关系和公式演化。

## 主要功能

- 🤖 AI对话：支持OpenAI和Google Gemini API，通过自然语言交互提取数据点
- 📊 数据可视化：使用Chart.js实时展示数据点和演化过程
- 📈 公式演化：自动分析数据关系，生成最优拟合公式
- 🎛️ 演化控制：提供直观的控制面板，调整演化参数
- 💡 多目标优化：平衡公式的准确性和简洁性

## 快速开始

1. 克隆项目并安装依赖： 
```bash
git clone [your-repository-url]
cd formula-evolution-system
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 在浏览器中打开 http://localhost:3000

## 使用说明

1. 配置API密钥：
   - 选择使用OpenAI或Google Gemini API
   - 输入对应的API密钥

2. 数据输入：
   - 通过AI对话描述数据关系
   - 支持多种数据描述格式：
     - 自然语言："当x是2时y是4"
     - 坐标形式："(2,4)"
     - 等式形式："x=2,y=4"

3. 公式演化：
   - 系统自动分析数据关系
   - 生成最优拟合公式
   - 可视化展示演化过程

## 技术栈

- React 18
- Chart.js 4.3.0
- OpenAI/Google Gemini API

## 项目演示

### 主界面
![主界面](docs/images/main.png)
*主界面包含AI对话输入区、数据可视化区和控制面板*

### 公式演化过程
![演化过程](docs/images/evolution.png)
*实时展示公式演化和优化过程*

## 贡献指南

我们欢迎任何形式的贡献，包括但不限于：

- 提交问题和建议
- 改进文档
- 提交代码修复
- 添加新功能

贡献步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 问题反馈

如果您在使用过程中遇到任何问题，请：

1. 查看[常见问题](docs/FAQ.md)
2. 在GitHub Issues中搜索类似问题
3. 如果问题仍未解决，请[创建新的Issue](../../issues/new)，并提供：
   - 问题描述
   - 复现步骤
   - 系统环境信息
   - 相关的日志或截图

## 许可证

MIT License