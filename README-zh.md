# ide-rule

<p align="center">
  <b>🚀 AI 原生的 IDE 规则生成 CLI 工具</b>
</p>

<p align="center">
  一键生成 <code>.cursorrules</code>、<code>.windsurfrules</code> 以及 GitHub Copilot、Cursor、Windsurf 等 AI IDE 的配置文件。<br/>
  <strong>标准化你的 AI 辅助编程工作流，覆盖所有主流 AI IDE。</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ide-rule"><img src="https://img.shields.io/npm/v/ide-rule.svg?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ide-rule"><img src="https://img.shields.io/npm/dm/ide-rule.svg?style=flat-square&color=green" alt="npm downloads"></a>
  <a href="https://github.com/xiexin12138/ide-rule/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/xiexin12138/ide-rule/test.yml?style=flat-square&label=tests" alt="Tests"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg?style=flat-square" alt="Node.js"></a>
  <a href="https://opensource.org/licenses/ISC"><img src="https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square" alt="License: ISC"></a>
</p>

<p align="center">
  <a href="./README.md">English</a> | 中文
</p>

---

## 🎯 为什么选择 ide-rule？

随着 AI 编程助手成为主流，开发者面临一个新挑战：**每个 IDE 都有自己的规则格式**。Cursor 使用带 YAML frontmatter 的 `.mdc`，Windsurf 偏好单个 `.windsurfrules` 文件，GitHub Copilot 期望 Markdown 格式放在 `.github/` 目录...

手动管理这些配置既繁琐又容易出错，浪费宝贵的开发时间。

**ide-rule** 通过以下方式解决这个问题：

- ✅ **一条命令，全部搞定** — 为 7+ 种 AI IDE 生成正确格式的规则文件
- ✅ **统一的规则内容** — 相同的基础规则，自动适配每个 IDE 的格式
- ✅ **项目记忆** — 可选的 `project_memory.md` 帮助在会话间保持上下文
- ✅ **零配置** — 智能默认值，需要时可完全自定义

---

## 🖥️ 支持的 AI IDE

| IDE | 规则格式 | 输出路径 | 特殊功能 |
|-----|---------|---------|---------|
| **Cursor** | `.mdc` (Frontmatter) | `.cursor/rules/` | 支持 `globs`、`alwaysApply`、多文件规则 |
| **Trae** (字节跳动) | `.md` | `.trae/rules/` | 标准 Markdown 格式 |
| **Windsurf** (Codeium) | `.windsurfrules` | 项目根目录 | 单文件合并规则 |
| **GitHub Copilot** | `.md` | `.github/` | 单个 `copilot-instructions.md` 文件 |
| **通义灵码** (阿里) | `.md` | `.lingma/rules/` | 支持 HTML 注释元数据 |
| **CodeBuddy** (腾讯) | `.md` | `.codebuddy/rules/` | 标准 Markdown 格式 |
| **VS Code** (通用) | `.md` | `.vscode/rules/` | 标准 Markdown 格式 |

---

## ✨ 功能特性

- 🎯 **多 IDE 支持** — 自动检测并生成 IDE 对应的正确格式
- 📝 **统一内容模板** — 基础规则内容保持一致，仅格式随 IDE 变化
- 🌍 **国际化** — 内置 `en-US` 和 `zh-CN` 支持，自动检测系统语言
- 🔒 **安全文件操作** — 默认不覆盖，使用 `--force` 时自动创建 `.bak` 备份
- 🧩 **可扩展架构** — 轻松添加自定义 IDE、框架和语言模板
- ⚡ **交互式 CLI** — 美观的提示引导你完成设置过程
- 📦 **零运行时依赖** — 最小化体积，快速安装

---

## 🚀 快速开始

### 安装

```bash
# 全局安装（推荐）
npm install -g ide-rule

# 或直接使用 npx 运行（无需安装）
npx ide-rule
```

### 基本使用

```bash
# 启动交互式向导
ide-rule

# 显式指定语言
ide-rule --lang zh-CN

# 强制覆盖已存在的文件（会创建 .bak 备份）
ide-rule --force
```

### 接下来会发生什么？

CLI 将引导你完成以下步骤：

1. **选择你的 AI IDE** — 从 Cursor、Windsurf、Copilot 等中选择
2. **选择技术栈** — 前端框架、后端框架、编程语言
3. **生成文件** — 规则文件将以正确的格式创建在正确的位置

---

## 📂 输出示例

### Cursor（多文件 + Frontmatter）

```
.cursor/rules/
├── base.mdc           # 带 YAML Frontmatter 的基础规则
├── frontend-react.mdc # 框架特定规则
└── backend-nest.mdc   # 后端特定规则
```

**`base.mdc` 结构示例：**
```yaml
---
description: AI 助手的基础编码规则
globs: ["**/*"]
alwaysApply: true
---
# 你的编码规范...
```

### Windsurf（单个合并文件）

```
.windsurfrules         # 所有规则合并为单个文件
```

### GitHub Copilot（单文件）

```
.github/
└── copilot-instructions.md
```

---

## 🛠️ 配置选项

### IDE 选择

| 选项 | IDE | 格式 |
|-----|-----|------|
| `cursor` | Cursor IDE | 带 Frontmatter 的 `.mdc` |
| `trae` | Trae (字节跳动) | `.md` |
| `windsurf` | Windsurf (Codeium) | `.windsurfrules` |
| `copilot` | GitHub Copilot | `.md` |
| `lingma` | 通义灵码 (阿里) | `.md` |
| `codebuddy` | CodeBuddy (腾讯) | `.md` |
| `vscode` | VS Code 通用 | `.md` |
| `custom` | 自定义 IDE | 可配置 |

### 框架与语言模板

**前端框架：**
- `react` | `next` | `vue` | `nuxt` | `angular` | `svelte` | `custom` | `none`

**后端框架：**
- `node-express` | `nest` | `koa` | `fastify` | `custom` | `none`

**编程语言：**
- `javascript` | `typescript` | `go` | `python` | `java` | `c` | `c++` | `c#` | `php` | `ruby` | `custom`

---

## 🏗️ 架构设计

```
ide-rule/
├── bin/cli.js              # CLI 入口
├── src/
│   ├── ide-adapters.js     # IDE 特定配置
│   ├── formatters.js       # 内容 → IDE 格式转换器
│   ├── templates.js        # 模板加载与构建
│   ├── scaffold.js         # 核心脚手架逻辑
│   └── prompts.js          # 交互提示
├── templates/
│   ├── base_rule_content.md      # 纯内容模板
│   └── project_memory_example.md # 项目记忆模板
└── locales/
    ├── en-US.json          # 英文翻译
    └── zh-CN.json          # 中文翻译
```

**设计原则：**

1. **内容与格式分离** — `base_rule_content.md` 存储纯内容，不含格式
2. **适配器模式** — 每个 IDE 有独立配置（路径、扩展名、格式化规则）
3. **可插拔格式化器** — 将原始内容转换为 IDE 特定语法

---

## 🔒 备份策略

- **默认行为**：跳过已存在的文件并显示警告
- **使用 `--force`**：在覆盖前创建带时间戳的 `.bak` 文件
- **示例**：`base.mdc` → `base.mdc.bak.1702345678`

---

## 🧪 测试

项目使用 Jest 保持 **>90% 测试覆盖率**。

```bash
# 运行所有测试
npm test

# 开发模式下的监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

---

## 🤝 参与贡献

欢迎贡献！以下是你可以帮助的方式：

1. **添加新的 IDE 适配器** — 支持更多 AI 编程助手
2. **改进模板** — 更好的默认规则和提示
3. **添加语言翻译** — 扩展国际化支持
4. **报告 Bug** — 为发现的任何问题提交 issue

详细指南请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 📄 许可证

[ISC](./LICENSE) © 2024

---

## 🔗 相关项目

- [Cursor](https://cursor.sh) — AI 优先的代码编辑器
- [Windsurf](https://codeium.com/windsurf) — Codeium 的 AI 代码编辑器
- [GitHub Copilot](https://github.com/features/copilot) — AI 结对编程工具

---

<p align="center">
  <sub>用 ❤️ 为 AI 辅助开发社区构建</sub>
</p>

