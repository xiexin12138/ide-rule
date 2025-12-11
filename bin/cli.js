#!/usr/bin/env node
// Reason: CLI entry to trigger scaffold flow.

const { run } = require("../src/index");

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

