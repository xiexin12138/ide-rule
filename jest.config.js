// Reason: Jest configuration for ide-rule test suite.

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/prompts.js", // 交互模块不需要自动化测试
    "!src/locale.js",  // 语言检测模块较简单
    "!src/index.js"    // CLI 入口，主要是流程编排
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  verbose: true
};

