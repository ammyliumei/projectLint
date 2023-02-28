# 小象编辑桌面 PC 端

## 项目架构

⚡️ Vite 3 - 构建工具
🖖 Vue 3 - 渐进式 JavaScript 框架
🚦 Vue Router - 官方路由管理器
📦 Pinia - Vue Store
💻 Ant Design Vue 适配桌面端的组件库
🎨 Sess - CSS 预处理器
🔗 Fetch- 一个基于 promise 的原生网络请求 api
🧰 Husky + Lint-Staged - Git Hook 工具
🛡️ EditorConfig + ESLint + Prettier + Stylelint - 代码规范
🔨 Commitizen + Commitlint - 提交规范

## 目录结构

```
├── dist/
└── src/
    ├── api/                       // 接口请求目录
    ├── assets/                    // 静态资源目录
    ├── common/                    // 通用类库目录
    ├── components/                // 公共组件目录
    ├── router/                    // 路由配置目录
        ├── modules/  // 路由模块
        ├── index.js  // 路由配置文件
    ├── store/                     // 状态管理目录
    ├── style/                     // 通用样式目录
    ├── utils/                     // 工具目录
    └── views/                    // 页面组件目录
        ├──  PCEditor
    ├── App.vue
    └── main.js
├── index.html
├── jsconfig.json                  // JavaScript 配置文件
├── vite.config.js                 // Vite 配置文件
└── package.json
```
