# ide-rule

[![Tests](https://github.com/xiexin12138/ide-rule/actions/workflows/test.yml/badge.svg)](https://github.com/xiexin12138/ide-rule/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/ide-rule.svg)](https://www.npmjs.com/package/ide-rule)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[English](./README-en.md) | 中文

一个用于快速初始化 AI IDE 规则与项目记忆的 CLI 工具，支持多种主流 AI IDE，内置多语言提示与可扩展的框架/语言模板。

## 支持的 AI IDE

| IDE | 规则格式 | 输出路径 | 特性 |
|-----|---------|---------|------|
| **Cursor** | `.mdc` (Frontmatter) | `.cursor/rules/` | 支持 globs、alwaysApply |
| **Trae** (字节跳动) | `.md` | `.trae/rules/` | 标准 Markdown |
| **Windsurf** (Codeium) | `.windsurfrules` | 项目根目录 | 单文件合并 |
| **GitHub Copilot** | `.md` | `.github/` | 单文件 `copilot-instructions.md` |
| **通义灵码** (Lingma) | `.md` | `.lingma/rules/` | 支持 HTML 注释元数据 |
| **CodeBuddy** (腾讯) | `.md` | `.codebuddy/rules/` | 标准 Markdown |
| **VS Code** (通用) | `.md` | `.vscode/rules/` | 标准 Markdown |

## 特性

- 🎯 **多 IDE 支持**：自动识别 IDE 并生成对应格式的规则文件
- 📝 **统一内容模板**：基础规则内容一致，仅格式随 IDE 变化
- 🌍 **多语言**：zh-CN / en-US，自动检测系统语言
- 🔒 **安全写入**：默认不覆盖，`--force` 时先备份再覆盖
- 🧩 **可扩展**：支持自定义 IDE、前端/后端框架、语言

## 环境要求

- Node.js >= 14
- npm

## 安装与使用

```bash
# 全局安装
npm install -g ide-rule

# 或直接运行
npx ide-rule

# 可选参数
npx ide-rule --lang en-US   # 指定语言
npx ide-rule --force        # 覆盖已存在文件并生成 .bak
```

## 交互选项

### IDE 选择
- `cursor` - Cursor IDE（.mdc 格式，支持 Frontmatter）
- `trae` - Trae 字节跳动（.md 格式）
- `windsurf` - Windsurf Codeium（.windsurfrules 单文件）
- `copilot` - GitHub Copilot（.github/copilot-instructions.md）
- `lingma` - 通义灵码（.md 格式）
- `codebuddy` - CodeBuddy 腾讯（.md 格式）
- `vscode` - VS Code 通用（.md 格式）
- `custom` - 自定义 IDE

### 框架与语言
- **前端**：`react | next | vue | nuxt | angular | svelte | custom | none`
- **后端**：`node-express | nest | koa | fastify | custom | none`
- **语言**：`javascript | typescript | c | c# | c++ | go | java | php | python | ruby | custom`

## 输出示例

### Cursor (多文件 + Frontmatter)
```
.cursor/rules/
├── base.mdc           # 带 YAML Frontmatter
├── frontend-react.mdc
└── backend-nest.mdc
```

### Windsurf (单文件)
```
.windsurfrules         # 所有规则合并为单文件
```

### GitHub Copilot (单文件)
```
.github/
└── copilot-instructions.md
```

## 架构设计

```
templates/
└── base_rule_content.md    # 纯内容模板（无格式）

src/
├── ide-adapters.js         # IDE 适配器配置
├── formatters.js           # 格式化器（内容 → IDE 格式）
├── templates.js            # 模板加载与构建
├── scaffold.js             # 脚手架逻辑
└── ...
```

**核心设计原则**：
1. **内容与格式分离**：`base_rule_content.md` 存储纯内容
2. **IDE 适配器模式**：每个 IDE 有独立配置（路径、扩展名、格式化方式）
3. **格式化器**：将纯内容转换为 IDE 特定格式

## 备份策略

- 当目标文件已存在且使用 `--force` 时，生成 `.bak`（时间戳后缀）后再覆盖
- 未使用 `--force` 时跳过写入并提示

## 开发说明

- 入口：`bin/cli.js`
- 核心模块：
  - `src/ide-adapters.js` - IDE 适配器配置
  - `src/formatters.js` - 格式化器
  - `src/scaffold.js` - 脚手架逻辑
  - `src/templates.js` - 模板管理
  - `src/prompts.js` - 交互提示
  - `src/options.js` - 选项常量
- 语言包：`locales/zh-CN.json`、`locales/en-US.json`
- 模板：`templates/base_rule_content.md`、`templates/project_memory_example.md`

## 测试

项目使用 Jest 作为测试框架，覆盖率 > 90%。

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

测试模块：
- `tests/formatters.test.js` - 格式化器单元测试
- `tests/ide-adapters.test.js` - IDE 适配器单元测试
- `tests/fs-utils.test.js` - 文件操作单元测试
- `tests/scaffold.test.js` - 脚手架集成测试

## 许可

ISC
