# ide-rule

一个用于快速初始化 IDE 规则与项目记忆的 CLI（支持 Cursor、TRAE、VS Code 及自定义 IDE），内置多语言提示与可扩展的框架/语言模板。

## 特性
- 交互式选择 IDE/前端/后端/语言，可输入自定义名称。
- 自动写入基线 `base.mdc`（原样沿用 `.cursor/rules/base.mdc`）。
- 自动生成前端/后端/语言规则模板文件。
- 自动创建 `docs/project_memory.md`（来源于内置模板），支持跳过或备份覆盖。
- 多语言：zh-CN / en-US，默认检测系统语言，可用 `--lang` 覆盖。
- 安全写入：默认不覆盖已存在文件，`--force` 时先备份再覆盖。

## 环境要求
- Node.js >= 14
- npm

## 安装与使用
```bash
npm install
npx ide-rule          # 交互式生成
# 可选参数
npx ide-rule --lang en-US   # 指定语言
npx ide-rule --force        # 覆盖已存在文件并生成 .bak
```

## 交互选项
- IDE：`cursor | trae | vscode | custom`（自定义写入 `.<ide>/rules/`）
- 前端：`react | next | vue | nuxt | angular | svelte | custom | none`
- 后端：`node-express | nest | koa | fastify | custom | none`
- 语言（多选）：`javascript | typescript | c | c# | c++ | go | java | php | python | ruby | custom`
  - 展示顺序固定：`javascript`, `typescript` 置顶，其余按名称排序
- 语言环境：自动检测；可用 `--lang zh-CN|en-US` 覆盖
- 覆盖策略：默认跳过已存在文件，`--force` 备份后覆盖

## 输出目录与文件
- 内置 IDE：`.cursor/rules/`、`.trae/rules/`、`.vscode/rules/`
- 自定义 IDE：`.<ide>/rules/`
- 生成文件示例：
  - `base.mdc`
  - `frontend-<name>.mdc` / `backend-<name>.mdc` / `language-<name>.mdc`
  - `docs/project_memory.md`（来自 `templates/project_memory_example.md`）

## 备份策略
- 当目标文件已存在且使用 `--force` 时，生成 `.bak`（时间戳后缀）后再覆盖。
- 未使用 `--force` 时跳过写入并提示。

## 开发说明
- 入口：`bin/cli.js`
- 核心：`src/index.js`（CLI 编排）、`src/prompts.js`（交互）、`src/scaffold.js`（写入规则与项目记忆）、`src/templates.js`（模板）、`src/options.js`（选项常量）、`src/locale.js`（语言加载）、`src/fs-utils.js`（文件写入/备份）
- 语言包：`locales/zh-CN.json`、`locales/en-US.json`
- 项目记忆模板：`templates/project_memory_example.md`

## 许可
ISC

