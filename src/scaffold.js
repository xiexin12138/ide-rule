// Reason: Decoupled scaffold logic for generating rule files with multi-IDE support.

const path = require("path");
const fs = require("fs");
const { ensureDir, writeFileSafe } = require("./fs-utils");
const { buildRuleForIde, buildBaseRuleForIde, buildRuleContent } = require("./templates");
const { getAdapter, slugify } = require("./ide-adapters");
const { getOutputFileName, mergeRulesForSingleFile, formatCategoryRule } = require("./formatters");
const { DEFAULT_LOCALE } = require("./options");

/**
 * 解析目标目录路径
 */
function resolveTargetDir(cwd, ide) {
  const adapter = getAdapter(ide);
  return path.join(cwd, adapter.rulesDir);
}

/**
 * 加载项目记忆模板
 */
function loadProjectMemoryTemplate() {
  const templatePath = path.join(__dirname, "..", "templates", "project_memory_example.md");
  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    return "# 🧠 Project Memory\n\n请在此记录项目的长期记忆与关键决策。";
  }
}

/**
 * 构建文件生成计划
 */
function buildPlans(messages, selections) {
  const { frontend = [], backend = [], language = [], ide } = selections;
  const adapter = getAdapter(ide);
  const plans = [];

  // 基础规则
  const baseContent = buildBaseRuleForIde(ide);
  const baseFileName = getOutputFileName(ide, "base");

  // 分类规则
  const categoryRules = [];

  frontend.forEach((name) => {
    const content = buildRuleForIde(messages, "frontend", name, ide);
    categoryRules.push({
      filename: getOutputFileName(ide, `frontend-${slugify(name)}`),
      content,
      category: "frontend",
      name
    });
  });

  backend.forEach((name) => {
    const content = buildRuleForIde(messages, "backend", name, ide);
    categoryRules.push({
      filename: getOutputFileName(ide, `backend-${slugify(name)}`),
      content,
      category: "backend",
      name
    });
  });

  language.forEach((name) => {
    const content = buildRuleForIde(messages, "language", name, ide);
    categoryRules.push({
      filename: getOutputFileName(ide, `language-${slugify(name)}`),
      content,
      category: "language",
      name
    });
  });

  // 如果是单文件 IDE（如 Windsurf、Copilot），合并所有规则
  if (adapter.singleFile) {
    const allRules = [
      { content: baseContent, category: "base", name: "base" },
      ...categoryRules
    ];
    const mergedContent = mergeRulesForSingleFile(allRules, ide);
    const fileName = adapter.fileName || baseFileName;
    plans.push({
      filename: fileName,
      content: mergedContent
    });
  } else {
    // 多文件 IDE，每个规则单独文件
    plans.push({
      filename: baseFileName,
      content: baseContent
    });
    categoryRules.forEach((rule) => {
      plans.push({
        filename: rule.filename,
        content: rule.content
      });
    });
  }

  return plans;
}

/**
 * 写入生成计划到文件系统
 */
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

/**
 * 写入项目记忆文件
 */
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

/**
 * 主脚手架函数
 */
async function scaffold(cwd, messages, selections, opts = {}) {
  const locale = selections.locale || DEFAULT_LOCALE;
  const targetDir = resolveTargetDir(cwd, selections.ide);
  const plans = buildPlans(messages, selections);
  const summary = await writePlans(targetDir, plans, opts.force);
  const memory = await writeProjectMemory(cwd, opts.force);

  return { targetDir, locale, summary, memory };
}

module.exports = {
  scaffold,
  resolveTargetDir,
  buildPlans
};

