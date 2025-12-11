# ide-rule

[![Tests](https://github.com/xiexin12138/ide-rule/actions/workflows/test.yml/badge.svg)](https://github.com/xiexin12138/ide-rule/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/ide-rule.svg)](https://www.npmjs.com/package/ide-rule)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

English | [中文](./README.md)

A CLI tool to quickly scaffold AI IDE rules and project memory, supporting multiple mainstream AI IDEs with multi-language prompts and extensible framework/language templates.

## Supported AI IDEs

| IDE | Rule Format | Output Path | Features |
|-----|------------|-------------|----------|
| **Cursor** | `.mdc` (Frontmatter) | `.cursor/rules/` | Supports globs, alwaysApply |
| **Trae** (ByteDance) | `.md` | `.trae/rules/` | Standard Markdown |
| **Windsurf** (Codeium) | `.windsurfrules` | Project root | Single file merge |
| **GitHub Copilot** | `.md` | `.github/` | Single file `copilot-instructions.md` |
| **Lingma** (Alibaba) | `.md` | `.lingma/rules/` | HTML comment metadata |
| **CodeBuddy** (Tencent) | `.md` | `.codebuddy/rules/` | Standard Markdown |
| **VS Code** (Generic) | `.md` | `.vscode/rules/` | Standard Markdown |

## Features

- 🎯 **Multi-IDE Support**: Automatically detects IDE and generates corresponding rule file formats
- 📝 **Unified Content Template**: Base rule content remains consistent, only format changes per IDE
- 🌍 **Multi-language**: zh-CN / en-US, auto-detects system language
- 🔒 **Safe Write**: No overwrite by default, backup before overwrite with `--force`
- 🧩 **Extensible**: Supports custom IDE, frontend/backend frameworks, and languages

## Requirements

- Node.js >= 16
- npm

## Installation & Usage

```bash
# Global install
npm install -g ide-rule

# Or run directly
npx ide-rule

# Optional arguments
npx ide-rule --lang en-US   # Specify language
npx ide-rule --force        # Overwrite existing files with .bak backup
```

## Interactive Options

### IDE Selection
- `cursor` - Cursor IDE (.mdc format with Frontmatter)
- `trae` - Trae by ByteDance (.md format)
- `windsurf` - Windsurf by Codeium (.windsurfrules single file)
- `copilot` - GitHub Copilot (.github/copilot-instructions.md)
- `lingma` - Lingma by Alibaba (.md format)
- `codebuddy` - CodeBuddy by Tencent (.md format)
- `vscode` - VS Code Generic (.md format)
- `custom` - Custom IDE

### Frameworks & Languages
- **Frontend**: `react | next | vue | nuxt | angular | svelte | custom | none`
- **Backend**: `node-express | nest | koa | fastify | custom | none`
- **Languages**: `javascript | typescript | c | c# | c++ | go | java | php | python | ruby | custom`

## Output Examples

### Cursor (Multi-file + Frontmatter)
```
.cursor/rules/
├── base.mdc           # With YAML Frontmatter
├── frontend-react.mdc
└── backend-nest.mdc
```

### Windsurf (Single file)
```
.windsurfrules         # All rules merged into single file
```

### GitHub Copilot (Single file)
```
.github/
└── copilot-instructions.md
```

## Architecture Design

```
templates/
└── base_rule_content.md    # Pure content template (no format)

src/
├── ide-adapters.js         # IDE adapter configurations
├── formatters.js           # Formatters (content → IDE format)
├── templates.js            # Template loading & building
├── scaffold.js             # Scaffolding logic
└── ...
```

**Core Design Principles**:
1. **Separation of Content & Format**: `base_rule_content.md` stores pure content
2. **IDE Adapter Pattern**: Each IDE has its own config (path, extension, formatting method)
3. **Formatters**: Transform pure content to IDE-specific format

## Backup Strategy

- When target file exists and `--force` is used, creates `.bak` (with timestamp suffix) before overwriting
- Without `--force`, skips writing and shows prompt

## Development Guide

- Entry: `bin/cli.js`
- Core Modules:
  - `src/ide-adapters.js` - IDE adapter configurations
  - `src/formatters.js` - Formatters
  - `src/scaffold.js` - Scaffolding logic
  - `src/templates.js` - Template management
  - `src/prompts.js` - Interactive prompts
  - `src/options.js` - Option constants
- Locales: `locales/zh-CN.json`, `locales/en-US.json`
- Templates: `templates/base_rule_content.md`, `templates/project_memory_example.md`

## Testing

The project uses Jest as the testing framework with > 90% coverage.

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test modules:
- `tests/formatters.test.js` - Formatters unit tests
- `tests/ide-adapters.test.js` - IDE adapters unit tests
- `tests/fs-utils.test.js` - File operations unit tests
- `tests/scaffold.test.js` - Scaffolding integration tests

## License

ISC

