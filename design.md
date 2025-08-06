### **项目规划：纯前端飞行棋引擎**

#### **1. 简介**

本项目旨在创建一个功能完善、纯前端的飞行棋（Flight Chess）游戏引擎。它将完全在浏览器中运行，无需任何后端服务，支持离线游玩。核心功能包括动态地图生成、丰富的游戏流程、可自定义的文本选项库，以及地图和选项的导入导出功能，并提供良好的跨平台响应式体验。

#### **2. 技术选型 (Technology Stack)**

为了构建一个现代化、可维护且高效的应用，我推荐以下技术栈：

*   **核心框架 (Framework):** **React.js** (使用 **Vite** 作为构建工具)。
    *   **理由:** React 的组件化思想非常适合构建游戏界面（如棋盘、玩家、弹窗等）。Vite 能提供极速的开发服务器和高效的打包体验。
*   **样式方案 (Styling):** **Tailwind CSS**。
    *   **理由:** 这是一个功能类优先的 CSS 框架，可以极大地加速响应式布局的开发，并且能轻松实现您要求的红黑主色调风格。
*   **状态管理 (State Management):** **Zustand**。
    *   **理由:** 相比 Redux，Zustand 更轻量、API 更简洁，足以管理本项目的游戏状态、地图配置和选项库，能有效降低复杂性。
*   **路由管理 (Routing):** **React Router**。
    *   **理由:** 这是 React 生态中最主流的路由库，用于实现侧边栏导航，切换“游戏页面”、“地图管理”、“选项库管理”等不同页面。
*   **数据持久化 (Data Persistence):** **浏览器 `localStorage`** 和 **文件下载/上传**。
    *   **理由:** 使用 `localStorage` 可以在用户浏览器中自动保存地图和选项库，实现数据持久化。通过生成和解析 JSON 文件，可以轻松实现导入/导出功能，完全符合离线使用的要求。
*   **图标 (Icons):** **React Icons** 库，提供丰富的图标资源。

#### **3. 项目结构**

我将采用模块化的方式组织代码，确保结构清晰、易于维护。

```
/src
├── assets/              # 存放图标、图片等静态资源
├── components/          # 可复用的UI组件 (如：按钮, 弹窗, 侧边栏)
├── pages/               # 页面级组件
│   ├── GamePage.jsx     # 游戏主页面，包含棋盘和控制逻辑
│   ├── MapEditorPage.jsx  # 地图编辑器页面
│   └── OptionsEditorPage.jsx # 选项库管理页面
├── store/               # Zustand 全局状态管理
│   ├── gameStore.js     # 负责当前游戏的状态 (玩家, 位置, 回合)
│   ├── mapStore.js      # 负责所有地图的配置
│   └── optionsStore.js  # 负责文本选项库
├── styles/              # 全局样式文件
├── App.jsx              # 应用主组件，配置路由和整体布局
└── main.jsx             # React 应用入口
```

#### **4. 核心数据模型**

我们将定义清晰的 JSON 结构来管理数据：

*   **地图配置 (Map Configuration):**
    ```json
    {
      "id": "unique-map-id-string",
      "name": "经典60格地图",
      "totalSquares": 60,
      "grid": [
        { "type": "start", "text": "起点" },
        { "type": "normal", "text": "" },
        { "type": "reward", "text": "奖励：随机前进！" },
        { "type": "penalty", "text": "惩罚：随机后退！" },
        // ... 更多格子
        { "type": "finish", "text": "终点" }
      ]
    }
    ```
*   **选项库 (Options Library):**
    ```json
    {
      "id": "unique-library-id-string",
      "name": "趣味冷笑话",
      "options": [
        "第一个笑话...",
        "第二个笑话..."
      ]
    }
    ```
*   **游戏状态 (Game State):**
    ```javascript
    {
      "players": [
        { "id": 1, "name": "玩家A", "color": "#ff4d4d", "position": 0 },
        { "id": 2, "name": "玩家B", "color": "#4d4dff", "position": 0 }
      ],
      "currentPlayerIndex": 0,
      "diceResult": null,
      "status": "playing" // 'setup', 'playing', 'finished'
    }
    ```

#### **5. 开发路线图 (Roadmap)**

我将分阶段进行开发：

1.  **第一阶段：项目初始化与基础搭建**
    *   使用 Vite 创建 React 项目。
    *   集成 Tailwind CSS 并配置红黑主题色。
    *   使用 React Router 搭建带侧边栏的主体页面布局和路由。

2.  **第二阶段：核心游戏逻辑开发**
    *   创建 Zustand stores 来管理游戏状态。
    *   实现玩家轮转、掷骰子、棋子移动等核心游戏机制。

3.  **第三阶段：游戏界面实现**
    *   开发可根据配置动态生成的 `GameBoard` 组件。
    *   在棋盘上渲染不同颜色的玩家图标。
    *   实现触发事件后的弹窗提示。

4.  **第四阶段：地图与选项库编辑器**
    *   构建“地图管理”页面，支持创建、编辑、保存地图。
    *   构建“选项库管理”页面，支持文本的增删改查。
    *   实现地图和选项库的导入/导出功能。

5.  **第五阶段：样式优化与测试**
    *   全面应用红黑配色方案，优化视觉效果。
    *   确保在手机、平板和PC上都有良好的响应式表现。
    *   进行完整的功能测试和 Bug 修复。
