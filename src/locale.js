// Reason: Decoupled locale loading and fallback logic.

const path = require("path");
const fs = require("fs");
const { DEFAULT_LOCALE, SUPPORTED_LOCALES } = require("./options");

function loadMessages(locale) {
  const target = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const localePath = path.join(__dirname, "..", "locales", `${target}.json`);
  if (!fs.existsSync(localePath)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(localePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

module.exports = {
  loadMessages
};

