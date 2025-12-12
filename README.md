# ide-rule

<p align="center">
  <b>🚀 The AI-Native CLI Generator for IDE Rules</b>
</p>

<p align="center">
  Instantly scaffold <code>.cursorrules</code>, <code>.windsurfrules</code>, and configurations for GitHub Copilot, Cursor, Windsurf, and more.<br/>
  <strong>Standardize your AI-assisted coding workflow across all major AI IDEs.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ide-rule"><img src="https://img.shields.io/npm/v/ide-rule.svg?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ide-rule"><img src="https://img.shields.io/npm/dm/ide-rule.svg?style=flat-square&color=green" alt="npm downloads"></a>
  <a href="https://github.com/xiexin12138/ide-rule/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/xiexin12138/ide-rule/test.yml?style=flat-square&label=tests" alt="Tests"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg?style=flat-square" alt="Node.js"></a>
  <a href="https://opensource.org/licenses/ISC"><img src="https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square" alt="License: ISC"></a>
</p>

<p align="center">
  English | <a href="./README-zh.md">中文</a>
</p>

---

## 🎯 Why ide-rule?

As AI-powered coding assistants become mainstream, developers face a new challenge: **each IDE has its own rule format**. Cursor uses `.mdc` with YAML frontmatter, Windsurf prefers single `.windsurfrules` files, GitHub Copilot expects Markdown in `.github/`... 

Managing these configurations manually is tedious, error-prone, and wastes valuable development time.

**ide-rule** solves this by providing:

- ✅ **One Command, All IDEs** — Generate properly formatted rule files for 7+ AI IDEs
- ✅ **Consistent Rule Content** — Same base rules, automatically adapted to each IDE's format
- ✅ **Project Memory** — Optional `project_memory.md` to persist context across sessions
- ✅ **Zero Configuration** — Smart defaults with full customization when you need it

---

## 🖥️ Supported AI IDEs

| IDE | Rule Format | Output Path | Special Features |
|-----|-------------|-------------|------------------|
| **Cursor** | `.mdc` (Frontmatter) | `.cursor/rules/` | Supports `globs`, `alwaysApply`, multi-file rules |
| **Trae** (ByteDance) | `.md` | `.trae/rules/` | Standard Markdown format |
| **Windsurf** (Codeium) | `.windsurfrules` | Project root | Single-file merged rules |
| **GitHub Copilot** | `.md` | `.github/` | Single `copilot-instructions.md` file |
| **Lingma** (Alibaba) | `.md` | `.lingma/rules/` | HTML comment metadata support |
| **CodeBuddy** (Tencent) | `.md` | `.codebuddy/rules/` | Standard Markdown format |
| **VS Code** (Generic) | `.md` | `.vscode/rules/` | Standard Markdown format |
| **Claude Code** (Anthropic) | `CLAUDE.md` | Project root | Single-file project guidance |
| **Gemini CLI** (Google) | `GEMINI.md` | Project root | Single-file project guidance |

---

## ✨ Features

- 🎯 **Multi-IDE Support** — Automatically detects and generates the correct format for your IDE
- 📝 **Unified Content Template** — Base rule content stays consistent; only the format changes
- 🌍 **Internationalization** — Built-in support for `en-US` and `zh-CN`, auto-detects system locale
- 🔒 **Safe File Operations** — Never overwrites without `--force`; creates `.bak` backups automatically
- 🧩 **Extensible Architecture** — Easily add custom IDEs, frameworks, and language templates
- ⚡ **Interactive CLI** — Beautiful prompts guide you through the setup process
- 📦 **Zero Dependencies Runtime** — Minimal footprint, fast installation

---

## 🚀 Quick Start

### Installation

```bash
# Global installation (recommended)
npm install -g ide-rule

# Or run directly with npx (no install needed)
npx ide-rule
```

### Basic Usage

```bash
# Start the interactive wizard
ide-rule

# Specify language explicitly
ide-rule --lang en-US

# Force overwrite existing files (creates .bak backup)
ide-rule --force
```

### What Happens Next?

The CLI will guide you through:

1. **Select your AI IDE** — Choose from Cursor, Windsurf, Copilot, and more
2. **Pick your tech stack** — Frontend framework, backend framework, programming language
3. **Generate files** — Rule files are created in the correct location with proper formatting

---

## 📂 Output Examples

### Cursor (Multi-file with Frontmatter)

```
.cursor/rules/
├── base.mdc           # Base rules with YAML Frontmatter
├── frontend-react.mdc # Framework-specific rules
└── backend-nest.mdc   # Backend-specific rules
```

**Sample `base.mdc` structure:**
```yaml
---
description: Base coding rules for AI assistant
globs: ["**/*"]
alwaysApply: true
---
# Your coding standards here...
```

### Windsurf (Single Merged File)

```
.windsurfrules         # All rules merged into a single file
```

### GitHub Copilot (Single File)

```
.github/
└── copilot-instructions.md
```

### Claude Code (Single File)

```
CLAUDE.md               # Project root
```

### Gemini CLI (Single File)

```
GEMINI.md               # Project root
```

---

## 🛠️ Configuration Options

### IDE Selection

| Option | IDE | Format |
|--------|-----|--------|
| `cursor` | Cursor IDE | `.mdc` with Frontmatter |
| `trae` | Trae (ByteDance) | `.md` |
| `windsurf` | Windsurf (Codeium) | `.windsurfrules` |
| `copilot` | GitHub Copilot | `.md` |
| `lingma` | Lingma (Alibaba) | `.md` |
| `codebuddy` | CodeBuddy (Tencent) | `.md` |
| `vscode` | VS Code Generic | `.md` |
| `claudecode` | Claude Code (Anthropic) | `CLAUDE.md` |
| `gemini` | Gemini CLI (Google) | `GEMINI.md` |
| `custom` | Custom IDE | Configurable |

### Framework & Language Templates

**Frontend Frameworks:**
- `react` | `next` | `vue` | `nuxt` | `angular` | `svelte` | `custom` | `none`

**Backend Frameworks:**
- `node-express` | `nest` | `koa` | `fastify` | `custom` | `none`

**Programming Languages:**
- `javascript` | `typescript` | `go` | `python` | `java` | `c` | `c++` | `c#` | `php` | `ruby` | `custom`

---

## 🏗️ Architecture

```
ide-rule/
├── bin/cli.js              # CLI entry point
├── src/
│   ├── ide-adapters.js     # IDE-specific configurations
│   ├── formatters.js       # Content → IDE format transformers
│   ├── templates.js        # Template loading & building
│   ├── scaffold.js         # Core scaffolding logic
│   └── prompts.js          # Interactive prompts
├── templates/
│   ├── base_rule_content.md      # Pure content template
│   └── project_memory_example.md # Memory template
└── locales/
    ├── en-US.json          # English translations
    └── zh-CN.json          # Chinese translations
```

**Design Principles:**

1. **Content-Format Separation** — `base_rule_content.md` stores pure content without formatting
2. **Adapter Pattern** — Each IDE has its own configuration (path, extension, formatting rules)
3. **Pluggable Formatters** — Transform raw content into IDE-specific syntax

---

## 🔒 Backup Strategy

- **Default behavior**: Skips existing files and shows a warning
- **With `--force`**: Creates timestamped `.bak` files before overwriting
- **Example**: `base.mdc` → `base.mdc.bak.1702345678`

---

## 🧪 Testing

The project maintains **>90% test coverage** using Jest.

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Add new IDE adapters** — Support for more AI coding assistants
2. **Improve templates** — Better default rules and prompts
3. **Add language translations** — Expand i18n support
4. **Report bugs** — Open issues for any problems you find

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

[ISC](./LICENSE) © 2024

---

## 🔗 Related Projects

- [Cursor](https://cursor.sh) — AI-first code editor
- [Windsurf](https://codeium.com/windsurf) — AI code editor by Codeium
- [GitHub Copilot](https://github.com/features/copilot) — AI pair programmer
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic's agentic coding tool
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — Google's AI-powered CLI tool

---

<p align="center">
  <sub>Built with ❤️ for the AI-assisted development community</sub>
</p>
