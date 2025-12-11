// Reason: Entry point for CLI orchestration.

const path = require("path");
const osLocale = require("os-locale");
const { loadMessages } = require("./locale");
const { collectInputs } = require("./prompts");
const { scaffold } = require("./scaffold");
const { DEFAULT_LOCALE, SUPPORTED_LOCALES } = require("./options");

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { force: undefined, lang: undefined };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--force" || arg === "-f") parsed.force = true;
    if (arg === "--lang" && args[i + 1]) {
      parsed.lang = args[i + 1];
      i += 1;
    }
  }
  return parsed;
}

async function detectLocale(overrideLang) {
  if (overrideLang && SUPPORTED_LOCALES.includes(overrideLang)) {
    return overrideLang;
  }
  try {
    const detected = await osLocale();
    if (detected && SUPPORTED_LOCALES.includes(detected)) {
      return detected;
    }
  } catch (err) {
    // ignore detection errors
  }
  return DEFAULT_LOCALE;
}

async function run(cwd = process.cwd()) {
  const cliArgs = parseArgs(process.argv);
  const detectedLocale = await detectLocale(cliArgs.lang);
  const messages = loadMessages(detectedLocale);
  const selections = await collectInputs(
    messages,
    detectedLocale,
    cliArgs.lang,
    cliArgs.force
  );
  const { targetDir, summary, memory } = await scaffold(cwd, messages, selections, {
    force: selections.force
  });

  if (summary.written.length) {
    console.log(
      (messages.summaryWritten || "Written:"),
      summary.written.map((p) => path.relative(cwd, p)).join(", ")
    );
  }
  if (summary.skipped.length) {
    console.log(
      (messages.summarySkipped || "Skipped (exists):"),
      summary.skipped.map((p) => path.relative(cwd, p)).join(", ")
    );
  }
  if (summary.backups.length) {
    console.log(
      (messages.summaryBackups || "Backups:"),
      summary.backups.map((p) => path.relative(cwd, p)).join(", ")
    );
  }

  console.log((messages.summaryTarget || "Rules located at:"), targetDir);

  if (memory) {
    if (memory.skipped) {
      console.log(
        (messages.summaryMemorySkipped || "Project memory skipped (exists):"),
        path.relative(cwd, memory.filePath)
      );
    } else {
      console.log(
        (messages.summaryMemoryWritten || "Project memory initialized:"),
        path.relative(cwd, memory.filePath)
      );
      if (memory.backup) {
        console.log(
          (messages.summaryMemoryBackup || "Project memory backup:"),
          path.relative(cwd, memory.backup)
        );
      }
    }
  }
}

module.exports = {
  run
};

