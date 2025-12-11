// Reason: Decoupled from runtime code to persist project-specific context.

# Project Memory

## 🧠 Context & Decisions
- 2025-12-11: 目标是提供一个 npm 包（Node 14 + npm），用于初始化 `.cursor/rules`，基线模板必须沿用现有 `.cursor/rules/base.mdc`，并按用户选择的前/后端框架或语言生成附加 `.mdc`。多语言策略：优先按系统语言，无法识别则默认中文，可通过 `--lang` 覆盖；交互式选择代替参数列出框架。支持自定义 IDE 名称，规则写入 `.<ide>/rules/*.mdc`（如 `.aicode/rules/base.mdc`）。语言列表默认含全球量 Top 10，固定将 JavaScript、TypeScript 置顶，其余按名称排序；前后端框架与语言均允许自定义输入以便扩展。npm 包名称更新为 `ide-rule`。新增：初始化时自动生成 `docs/project_memory.md`，内容来自内置模板 `templates/project_memory_example.md`，与规则文件共享覆盖/备份策略。
- 2025-12-11: 模板占位符机制：`templates/base_example.mdc` 中使用 `__IDE_RULES_DIR__` 作为占位符，避免硬编码 IDE 名称（如 `.cursor`）。在 `scaffold.js` 的 `applyIdePlaceholder` 函数中，使用 `slugify` 将用户输入的 IDE 名称统一转换为小写并规范化（去除特殊字符，用连字符连接），最终替换为 `.<ide-slug>/rules` 格式。例如：选择 "TRAE" 或 "trae" 都会生成 `.trae/rules`，自定义输入 "MyIDE" 会生成 `.myide/rules`。这确保了目录名称的一致性和文件系统兼容性。
- 2025-12-11: **多 IDE 支持重构 (v1.1.0)**：提取公共规则内容到 `templates/base_rule_content.md`（纯内容，无格式），新增 `src/ide-adapters.js`（IDE 适配器配置）和 `src/formatters.js`（格式化器），实现内容与格式分离。支持的 IDE：Cursor (.mdc)、Trae (.md)、Windsurf (.windsurfrules 单文件)、GitHub Copilot (.github/copilot-instructions.md)、通义灵码 (.lingma/rules/)、CodeBuddy (.codebuddy/rules/)、VS Code (.vscode/rules/)。单文件 IDE（如 Windsurf、Copilot）会将所有规则合并输出。
- 2025-12-11: **双语 README 维护**：项目需同时维护 `README.md`（中文）和 `README-en.md`（英文），两文件顶部有语言切换链接。任何功能更新必须同步更新两份文档。
- 2025-12-11: **测试模块**：引入 Jest 测试框架，覆盖率 > 90%。测试策略：1) **单元测试**：`formatters.js`（IDE 格式输出）、`ide-adapters.js`（适配器配置）、`fs-utils.js`（文件操作/备份）；2) **集成测试**：`scaffold.js`（端到端文件生成）。不测试：`prompts.js`（交互模块）、`index.js`（CLI 入口）、`locale.js`（语言检测）。运行命令：`npm test`、`npm run test:watch`、`npm run test:coverage`。

