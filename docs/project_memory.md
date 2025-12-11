// Reason: Decoupled from runtime code to persist project-specific context.

# Project Memory

## 🧠 Context & Decisions
- 2025-12-11: 目标是提供一个 npm 包（Node 14 + npm），用于初始化 `.cursor/rules`，基线模板必须沿用现有 `.cursor/rules/base.mdc`，并按用户选择的前/后端框架或语言生成附加 `.mdc`。多语言策略：优先按系统语言，无法识别则默认中文，可通过 `--lang` 覆盖；交互式选择代替参数列出框架。支持自定义 IDE 名称，规则写入 `.<ide>/rules/*.mdc`（如 `.aicode/rules/base.mdc`）。语言列表默认含全球量 Top 10，固定将 JavaScript、TypeScript 置顶，其余按名称排序；前后端框架与语言均允许自定义输入以便扩展。npm 包名称更新为 `ide-rule`。新增：初始化时自动生成 `docs/project_memory.md`，内容来自内置模板 `templates/project_memory_example.md`，与规则文件共享覆盖/备份策略。
- 2025-12-11: 模板占位符机制：`templates/base_example.mdc` 中使用 `__IDE_RULES_DIR__` 作为占位符，避免硬编码 IDE 名称（如 `.cursor`）。在 `scaffold.js` 的 `applyIdePlaceholder` 函数中，使用 `slugify` 将用户输入的 IDE 名称统一转换为小写并规范化（去除特殊字符，用连字符连接），最终替换为 `.<ide-slug>/rules` 格式。例如：选择 "TRAE" 或 "trae" 都会生成 `.trae/rules`，自定义输入 "MyIDE" 会生成 `.myide/rules`。这确保了目录名称的一致性和文件系统兼容性。

