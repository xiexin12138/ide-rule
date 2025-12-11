// Reason: Decoupled constants for selectable options and defaults.

/**
 * 支持的 IDE 列表
 * - cursor: Cursor IDE (.mdc 格式)
 * - trae: Trae IDE by ByteDance (.md 格式)
 * - windsurf: Windsurf by Codeium (.windsurfrules 单文件)
 * - copilot: GitHub Copilot (.github/copilot-instructions.md)
 * - lingma: 通义灵码 by Alibaba (.lingma/rules/*.md)
 * - codebuddy: CodeBuddy by Tencent (.codebuddy/rules/*.md)
 * - vscode: VS Code 通用 (.vscode/rules/*.md)
 * - custom: 自定义 IDE
 */
const IDE_CHOICES = [
  "cursor",
  "trae",
  "windsurf",
  "copilot",
  "lingma",
  "codebuddy",
  "vscode",
  "custom"
];

const FRONTEND_CHOICES = [
  "react",
  "next",
  "vue",
  "nuxt",
  "angular",
  "svelte",
  "custom",
  "none"
];

const BACKEND_CHOICES = [
  "node-express",
  "nest",
  "koa",
  "fastify",
  "custom",
  "none"
];

const LANGUAGE_CHOICES_ORDERED = [
  "javascript",
  "typescript",
  "c",
  "c#",
  "c++",
  "go",
  "java",
  "php",
  "python",
  "ruby",
  "custom"
];

const DEFAULT_LOCALE = "zh-CN";
const SUPPORTED_LOCALES = ["zh-CN", "en-US"];

module.exports = {
  IDE_CHOICES,
  FRONTEND_CHOICES,
  BACKEND_CHOICES,
  LANGUAGE_CHOICES_ORDERED,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES
};
