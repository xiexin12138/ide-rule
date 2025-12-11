// Reason: Decoupled template generation for base and dynamic rules with multi-IDE support.

const fs = require("fs");
const path = require("path");
const { formatForIde, formatBaseRule, formatCategoryRule } = require("./formatters");

/**
 * 加载纯内容基础模板（无 frontmatter）
 */
function loadBaseContentTemplate() {
  const templatePath = path.join(__dirname, "..", "templates", "base_rule_content.md");
  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    return "# Base Rule\n\n模板缺失，请检查 templates/base_rule_content.md。";
  }
}

/**
 * 加载旧版 MDC 模板（向后兼容）
 * @deprecated 请使用 loadBaseContentTemplate + formatBaseRule
 */
function loadBaseTemplate() {
  const templatePath = path.join(__dirname, "..", "templates", "base_example.mdc");
  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    return "# base.mdc\n\n模板缺失，请检查 templates/base_example.mdc。";
  }
}

/**
 * 构建模板标题
 */
function buildTemplateTitle(messages, category, name) {
  const categoryLabel =
    (messages.categories && messages.categories[category]) || category;
  return `# ${categoryLabel}: ${name}`;
}

/**
 * 构建模板内容体
 */
function buildTemplateBody(messages, category, name) {
  const tips =
    (messages.tips && messages.tips[category]) ||
    "Adjust rules to match your stack and coding standards.";
  const checklist =
    (messages.checklist && messages.checklist[category]) ||
    ["Align lint/format", "Document decisions in project memory", "Add tests where relevant"];
  const items = checklist.map((item) => `- ${item}`).join("\n");
  return `${buildTemplateTitle(messages, category, name)}

${tips}

${items}
`;
}

/**
 * 构建规则模板内容（纯内容，无格式）
 */
function buildRuleContent(messages, category, name) {
  return buildTemplateBody(messages, category, name);
}

/**
 * 构建 Cursor MDC 格式的规则模板
 * @deprecated 请使用 buildRuleForIde
 */
function buildRuleTemplate(messages, category, name) {
  return `---
description: ${category} guideline for ${name}
globs: *
---

${buildTemplateBody(messages, category, name)}`;
}

/**
 * 构建指定 IDE 格式的规则模板
 */
function buildRuleForIde(messages, category, name, ide) {
  const content = buildRuleContent(messages, category, name);
  return formatCategoryRule(content, ide, category, name);
}

/**
 * 构建指定 IDE 格式的基础规则
 */
function buildBaseRuleForIde(ide) {
  const content = loadBaseContentTemplate();
  return formatBaseRule(content, ide);
}

module.exports = {
  loadBaseTemplate,
  loadBaseContentTemplate,
  buildRuleTemplate,
  buildRuleContent,
  buildRuleForIde,
  buildBaseRuleForIde
};
