// Reason: Decoupled constants for selectable options and defaults.

const IDE_CHOICES = ["cursor", "trae", "vscode", "custom"];

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

