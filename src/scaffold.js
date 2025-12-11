// Reason: Decoupled scaffold logic for generating rule files.

const path = require("path");
const fs = require("fs");
const { ensureDir, writeFileSafe } = require("./fs-utils");
const { loadBaseTemplate, buildRuleTemplate } = require("./templates");
const { DEFAULT_LOCALE } = require("./options");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveTargetDir(cwd, ide) {
  if (ide === "cursor") return path.join(cwd, ".cursor", "rules");
  if (ide === "trae") return path.join(cwd, ".trae", "rules");
  if (ide === "vscode") return path.join(cwd, ".vscode", "rules");
  return path.join(cwd, `.${slugify(ide)}`, "rules");
}

function loadProjectMemoryTemplate() {
  const templatePath = path.join(__dirname, "..", "templates", "project_memory_example.md");
  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    return "# 🧠 Project Memory\n\n请在此记录项目的长期记忆与关键决策。";
  }
}

function buildPlans(messages, selections) {
  const { frontend = [], backend = [], language = [], ide } = selections;
  const baseTemplate = applyIdePlaceholder(loadBaseTemplate(), ide);
  const plans = [];
  plans.push({
    filename: "base.mdc",
    content: baseTemplate
  });

  frontend.forEach((name) => {
    plans.push({
      filename: `frontend-${slugify(name)}.mdc`,
      content: buildRuleTemplate(messages, "frontend", name)
    });
  });

  backend.forEach((name) => {
    plans.push({
      filename: `backend-${slugify(name)}.mdc`,
      content: buildRuleTemplate(messages, "backend", name)
    });
  });

  language.forEach((name) => {
    plans.push({
      filename: `language-${slugify(name)}.mdc`,
      content: buildRuleTemplate(messages, "language", name)
    });
  });

  return plans;
}

function applyIdePlaceholder(template, ide) {
  const ideSlug = slugify(ide || "cursor");
  const rulesDir = `.${ideSlug}/rules`;
  return template.replace(/__IDE_RULES_DIR__/g, rulesDir);
}

async function writePlans(targetDir, plans, force) {
  await ensureDir(targetDir);
  const summary = { written: [], skipped: [], backups: [] };
  for (const plan of plans) {
    const filePath = path.join(targetDir, plan.filename);
    const result = await writeFileSafe(filePath, plan.content, { force });
    if (result.skipped) {
      summary.skipped.push(filePath);
    } else {
      summary.written.push(filePath);
      if (result.backup) summary.backups.push(result.backup);
    }
  }
  return summary;
}

async function scaffold(cwd, messages, selections, opts = {}) {
  const locale = selections.locale || DEFAULT_LOCALE;
  const targetDir = resolveTargetDir(cwd, selections.ide);
  const plans = buildPlans(messages, selections);
  const summary = await writePlans(targetDir, plans, opts.force);
  const memory = await writeProjectMemory(cwd, opts.force);
  return { targetDir, locale, summary, memory };
}

async function writeProjectMemory(cwd, force) {
  const content = loadProjectMemoryTemplate();
  const dir = path.join(cwd, "docs");
  await ensureDir(dir);
  const filePath = path.join(dir, "project_memory.md");
  const result = await writeFileSafe(filePath, content, { force });
  return {
    filePath,
    skipped: result.skipped,
    backup: result.backup || null
  };
}

module.exports = {
  scaffold
};

