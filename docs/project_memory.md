// Reason: Decoupled from runtime code to persist project-specific context.

# Project Memory

## 🧠 Context & Decisions
- 2025-12-11: 目标是提供一个 npm 包（Node 14 + npm），用于初始化 `.cursor/rules`，基线模板必须沿用现有 `.cursor/rules/base.mdc`，并按用户选择的前/后端框架或语言生成附加 `.mdc`。多语言策略：优先按系统语言，无法识别则默认中文，可通过 `--lang` 覆盖；交互式选择代替参数列出框架。支持自定义 IDE 名称，规则写入 `.<ide>/rules/*.mdc`（如 `.aicode/rules/base.mdc`）。语言列表默认含全球量 Top 10，固定将 JavaScript、TypeScript 置顶，其余按名称排序；前后端框架与语言均允许自定义输入以便扩展。npm 包名称更新为 `ide-rule`。新增：初始化时自动生成 `docs/project_memory.md`，内容来自内置模板 `templates/project_memory_example.md`，与规则文件共享覆盖/备份策略。

