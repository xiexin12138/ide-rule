// Reason: Decoupled template generation for base and dynamic rules.

const fs = require("fs");
const path = require("path");

function loadBaseTemplate() {
  const templatePath = path.join(__dirname, "..", "templates", "base_example.mdc");
  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    return "# base.mdc\n\n模板缺失，请检查 templates/base_example.mdc。";
  }
}

function buildTemplateTitle(messages, category, name) {
  const categoryLabel =
    (messages.categories && messages.categories[category]) || category;
  return `# ${categoryLabel}: ${name}`;
}

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

function buildRuleTemplate(messages, category, name) {
  return `---
description: ${category} guideline for ${name}
globs: *
---

${buildTemplateBody(messages, category, name)}`;
}

module.exports = {
  loadBaseTemplate,
  buildRuleTemplate
};

