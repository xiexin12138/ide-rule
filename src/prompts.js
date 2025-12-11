// Reason: Decoupled interactive prompts for CLI flow.

const prompts = require("prompts");
const {
  IDE_CHOICES,
  FRONTEND_CHOICES,
  BACKEND_CHOICES,
  LANGUAGE_CHOICES_ORDERED
} = require("./options");

function buildChoiceItems(items, messages) {
  return items.map((value) => ({
    title: (messages.choices && messages.choices[value]) || value,
    value
  }));
}

function withCancel(messages) {
  return {
    onCancel: () => {
      console.log(messages.cancelled || "Cancelled");
      process.exit(1);
    }
  };
}

async function askCustomNames(messages, category) {
  const res = await prompts(
    {
      type: "text",
      name: "value",
      message:
        (messages.promptCustomNames && messages.promptCustomNames[category]) ||
        "Enter custom names (comma separated):",
      validate: (value) => (value && value.trim().length > 0 ? true : "Required")
    },
    withCancel(messages)
  );
  if (!res.value) return [];
  return res.value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalizeSelection(selection, custom) {
  if (selection.includes("none")) {
    return [];
  }
  return Array.from(new Set([...selection.filter((v) => v !== "custom"), ...custom]));
}

async function promptIde(messages) {
  const ideAnswer = await prompts(
    {
      type: "select",
      name: "ide",
      message: messages.promptIde || "Select target IDE",
      choices: buildChoiceItems(IDE_CHOICES, messages),
      initial: 0
    },
    withCancel(messages)
  );
  if (ideAnswer.ide === "custom") {
    const custom = await prompts(
      {
        type: "text",
        name: "name",
        message:
          (messages.promptIdeCustom && messages.promptIdeCustom.message) ||
          "Enter custom IDE name:",
        validate: (value) => (value && value.trim().length > 0 ? true : "Required")
      },
      withCancel(messages)
    );
    return custom.name;
  }
  return ideAnswer.ide;
}

async function promptWithCustomMulti(messages, category, choices) {
  while (true) {
    const answer = await prompts(
      {
        type: "multiselect",
        name: "selected",
        message:
          (messages.promptCategory && messages.promptCategory[category]) ||
          "Select options",
        choices: buildChoiceItems(choices, messages),
        hint: messages.hintMulti || "Space to select, Enter to confirm",
        instructions: false
      },
      withCancel(messages)
    );
    const selected = answer.selected || [];
    if (!selected.length) {
      console.log(
        (messages.promptRequireSelection &&
          messages.promptRequireSelection[category]) ||
          "Please select at least one or choose none."
      );
      continue;
    }
    let customNames = [];
    if (selected.includes("custom")) {
      customNames = await askCustomNames(messages, category);
    }
    return normalizeSelection(selected, customNames);
  }
}

async function promptLocale(messages, detected, overrideLang) {
  if (overrideLang) return overrideLang;
  if (!detected) return null;
  const res = await prompts(
    {
      type: "toggle",
      name: "accept",
      message:
        (messages.promptUseDetectedLang || "Use detected language?") +
        ` (${detected})`,
      active: (messages.yes || "yes"),
      inactive: (messages.no || "no"),
      initial: true
    },
    withCancel(messages)
  );
  return res.accept ? detected : null;
}

async function promptForce(messages, presetForce) {
  if (typeof presetForce === "boolean") return presetForce;
  const res = await prompts(
    {
      type: "toggle",
      name: "force",
      message:
        messages.promptForce ||
        "Overwrite existing files (backup will be created)?",
      active: (messages.yes || "yes"),
      inactive: (messages.no || "no"),
      initial: false
    },
    withCancel(messages)
  );
  return !!res.force;
}

async function collectInputs(messages, detectedLocale, overrideLang, presetForce) {
  const ide = await promptIde(messages);
  const frontend = await promptWithCustomMulti(messages, "frontend", FRONTEND_CHOICES);
  const backend = await promptWithCustomMulti(messages, "backend", BACKEND_CHOICES);
  const language = await promptWithCustomMulti(
    messages,
    "language",
    LANGUAGE_CHOICES_ORDERED
  );
  const locale = await promptLocale(messages, detectedLocale, overrideLang);
  const force = await promptForce(messages, presetForce);
  return { ide, frontend, backend, language, locale, force };
}

module.exports = {
  collectInputs
};

