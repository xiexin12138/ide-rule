// Reason: Decoupled IDE adapter configurations for multi-IDE support.

/**
 * IDE 适配器配置
 * 定义各 IDE 的规则文件格式、路径、扩展名等
 */
const IDE_ADAPTERS = {
  cursor: {
    name: "Cursor",
    rulesDir: ".cursor/rules",
    fileExt: ".mdc",
    supportsFrontmatter: true,
    supportsGlobs: true,
    supportsAlwaysApply: true,
    // Frontmatter 模板
    frontmatterTemplate: (meta) => `---
description: ${meta.description}
globs: ${meta.globs || "*"}
${meta.alwaysApply ? "alwaysApply: true" : ""}
---`.replace(/\n+---/g, "\n---"),
    // IDE 特有的占位符替换
    placeholders: {
      __IDE_NAME__: "Cursor",
      __RULE_EXT__: ".mdc",
      __APPLY_FEATURE__: "Apply"
    }
  },

  trae: {
    name: "Trae",
    rulesDir: ".trae/rules",
    fileExt: ".md",
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    // Trae 使用简单的 Markdown 标题
    headerTemplate: (meta) => `# ${meta.title || "Project Rules"}

> ${meta.description}

---
`,
    placeholders: {
      __IDE_NAME__: "Trae",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码应用"
    }
  },

  windsurf: {
    name: "Windsurf",
    rulesDir: ".", // 根目录
    fileExt: ".windsurfrules",
    singleFile: true, // Windsurf 只用单文件
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# Windsurf Rules
# ${meta.description}
# ====================================

`,
    placeholders: {
      __IDE_NAME__: "Windsurf",
      __RULE_EXT__: ".windsurfrules",
      __APPLY_FEATURE__: "Apply"
    }
  },

  copilot: {
    name: "GitHub Copilot",
    rulesDir: ".github",
    fileExt: ".md",
    fileName: "copilot-instructions.md", // 固定文件名
    singleFile: true,
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# Copilot Instructions

${meta.description}

---
`,
    placeholders: {
      __IDE_NAME__: "GitHub Copilot",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码建议"
    }
  },

  lingma: {
    name: "通义灵码 (Lingma)",
    rulesDir: ".lingma/rules",
    fileExt: ".md",
    supportsFrontmatter: false,
    supportsGlobs: true,
    supportsAlwaysApply: true,
    // 灵码使用 YAML 风格的头部元数据
    headerTemplate: (meta) => `<!--
type: ${meta.alwaysApply ? "always" : "manual"}
globs: ${meta.globs || "*"}
-->

# ${meta.title || "项目规则"}

> ${meta.description}

---
`,
    placeholders: {
      __IDE_NAME__: "通义灵码",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码应用"
    }
  },

  codebuddy: {
    name: "CodeBuddy (腾讯)",
    rulesDir: ".codebuddy/rules",
    fileExt: ".md",
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# ${meta.title || "项目规则"}

${meta.description}

---
`,
    placeholders: {
      __IDE_NAME__: "CodeBuddy",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码应用"
    }
  },

  vscode: {
    name: "VS Code (通用)",
    rulesDir: ".vscode/rules",
    fileExt: ".md",
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# ${meta.title || "Project Rules"}

${meta.description}

---
`,
    placeholders: {
      __IDE_NAME__: "VS Code",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码建议"
    }
  },

  claudecode: {
    name: "Claude Code",
    rulesDir: ".", // 根目录
    fileExt: ".md",
    fileName: "CLAUDE.md", // 固定文件名
    singleFile: true,
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# CLAUDE.md

${meta.description}

This file provides guidance to Claude Code when working with code in this repository.

---
`,
    placeholders: {
      __IDE_NAME__: "Claude Code",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码应用"
    }
  },

  gemini: {
    name: "Gemini CLI",
    rulesDir: ".", // 根目录
    fileExt: ".md",
    fileName: "GEMINI.md", // 固定文件名
    singleFile: true,
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# GEMINI.md

${meta.description}

This file provides guidance to Gemini CLI when working with code in this repository.

---
`,
    placeholders: {
      __IDE_NAME__: "Gemini CLI",
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码应用"
    }
  }
};

/**
 * 获取 IDE 适配器配置
 * @param {string} ide - IDE 标识符
 * @returns {object} IDE 配置对象
 */
function getAdapter(ide) {
  const key = ide.toLowerCase();
  if (IDE_ADAPTERS[key]) {
    return IDE_ADAPTERS[key];
  }
  // 返回默认配置（用于自定义 IDE）
  return {
    name: ide,
    rulesDir: `.${slugify(ide)}/rules`,
    fileExt: ".md",
    supportsFrontmatter: false,
    supportsGlobs: false,
    supportsAlwaysApply: false,
    headerTemplate: (meta) => `# ${meta.title || "Project Rules"}

${meta.description}

---
`,
    placeholders: {
      __IDE_NAME__: ide,
      __RULE_EXT__: ".md",
      __APPLY_FEATURE__: "代码应用"
    }
  };
}

/**
 * 获取所有支持的 IDE 列表
 * @returns {string[]} IDE 标识符数组
 */
function getSupportedIdes() {
  return Object.keys(IDE_ADAPTERS);
}

/**
 * Slugify 字符串
 */
function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = {
  IDE_ADAPTERS,
  getAdapter,
  getSupportedIdes,
  slugify
};

