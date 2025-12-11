// Reason: Decoupled filesystem helpers for scaffold operations.

const fs = require("fs");
const path = require("path");

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function backupIfExists(filePath) {
  const exists = fs.existsSync(filePath);
  if (!exists) return null;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = path.join(dir, `${base}.${stamp}.bak`);
  await fs.promises.copyFile(filePath, backup);
  return backup;
}

async function writeFileSafe(filePath, content, { force } = {}) {
  const exists = fs.existsSync(filePath);
  if (exists && !force) {
    return { skipped: true, backup: null };
  }
  let backup = null;
  if (exists && force) {
    backup = await backupIfExists(filePath);
  }
  await fs.promises.writeFile(filePath, content, "utf8");
  return { skipped: false, backup };
}

module.exports = {
  ensureDir,
  writeFileSafe
};

