// Reason: Integration tests for scaffold.js - validates end-to-end file generation.

const fs = require("fs");
const path = require("path");
const { scaffold, resolveTargetDir, buildPlans } = require("../src/scaffold");

const TEST_DIR = path.join(__dirname, "__playground__");

// Mock messages for testing
const mockMessages = {
  categories: {
    frontend: "前端",
    backend: "后端",
    language: "语言"
  },
  tips: {
    frontend: "React best practices.",
    backend: "API design guidelines.",
    language: "Coding style recommendations."
  },
  checklist: {
    frontend: ["Use TypeScript", "Add unit tests"],
    backend: ["Document API", "Add error handling"],
    language: ["Follow style guide"]
  }
};

describe("scaffold", () => {
  beforeEach(async () => {
    await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
    await fs.promises.mkdir(TEST_DIR, { recursive: true });
  });

  afterAll(async () => {
    await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe("resolveTargetDir", () => {
    test("should resolve Cursor rules directory", () => {
      const result = resolveTargetDir("/project", "cursor");
      expect(result).toBe("/project/.cursor/rules");
    });

    test("should resolve Trae rules directory", () => {
      const result = resolveTargetDir("/project", "trae");
      expect(result).toBe("/project/.trae/rules");
    });

    test("should resolve Windsurf to root directory", () => {
      const result = resolveTargetDir("/project", "windsurf");
      // path.join 会规范化路径，移除末尾的 "."
      expect(result).toBe("/project");
    });

    test("should resolve Copilot to .github directory", () => {
      const result = resolveTargetDir("/project", "copilot");
      expect(result).toBe("/project/.github");
    });
  });

  describe("buildPlans", () => {
    test("should generate base rule plan for multi-file IDE", () => {
      const selections = {
        ide: "cursor",
        frontend: [],
        backend: [],
        language: []
      };

      const plans = buildPlans(mockMessages, selections);

      expect(plans.length).toBe(1);
      expect(plans[0].filename).toBe("base.mdc");
      expect(plans[0].content).toContain("---"); // Frontmatter
    });

    test("should generate category rule plans", () => {
      const selections = {
        ide: "cursor",
        frontend: ["React"],
        backend: ["Node.js"],
        language: []
      };

      const plans = buildPlans(mockMessages, selections);

      expect(plans.length).toBe(3); // base + React + Node.js
      expect(plans.map((p) => p.filename)).toContain("frontend-react.mdc");
      expect(plans.map((p) => p.filename)).toContain("backend-node-js.mdc");
    });

    test("should merge all rules for single-file IDE (Windsurf)", () => {
      const selections = {
        ide: "windsurf",
        frontend: ["React", "Vue"],
        backend: [],
        language: []
      };

      const plans = buildPlans(mockMessages, selections);

      // Windsurf 应该只生成一个合并文件
      expect(plans.length).toBe(1);
      expect(plans[0].filename).toBe("windsurfrules");
      expect(plans[0].content).toContain("---"); // Section separator
    });

    test("should merge all rules for single-file IDE (Copilot)", () => {
      const selections = {
        ide: "copilot",
        frontend: ["React"],
        backend: [],
        language: []
      };

      const plans = buildPlans(mockMessages, selections);

      expect(plans.length).toBe(1);
      expect(plans[0].filename).toBe("copilot-instructions.md");
      expect(plans[0].content).toContain("# Copilot Instructions");
    });

    test("should generate plans for Trae with .md extension", () => {
      const selections = {
        ide: "trae",
        frontend: ["React"],
        backend: [],
        language: []
      };

      const plans = buildPlans(mockMessages, selections);

      expect(plans.some((p) => p.filename === "base.md")).toBe(true);
      expect(plans.some((p) => p.filename === "frontend-react.md")).toBe(true);
    });
  });

  describe("scaffold (integration)", () => {
    test("should create .cursor/rules directory with base.mdc", async () => {
      const selections = {
        ide: "cursor",
        frontend: [],
        backend: [],
        language: []
      };

      const result = await scaffold(TEST_DIR, mockMessages, selections);

      expect(result.targetDir).toBe(path.join(TEST_DIR, ".cursor/rules"));
      expect(result.summary.written.length).toBe(1);
      expect(fs.existsSync(path.join(TEST_DIR, ".cursor/rules/base.mdc"))).toBe(true);
    });

    test("should create project memory file", async () => {
      const selections = {
        ide: "cursor",
        frontend: [],
        backend: [],
        language: []
      };

      await scaffold(TEST_DIR, mockMessages, selections);

      const memoryPath = path.join(TEST_DIR, "docs/project_memory.md");
      expect(fs.existsSync(memoryPath)).toBe(true);
    });

    test("should skip existing files without force option", async () => {
      const selections = {
        ide: "cursor",
        frontend: [],
        backend: [],
        language: []
      };

      // 第一次运行
      await scaffold(TEST_DIR, mockMessages, selections);

      // 修改文件内容
      const rulePath = path.join(TEST_DIR, ".cursor/rules/base.mdc");
      fs.writeFileSync(rulePath, "Modified content");

      // 第二次运行（不带 force）
      const result = await scaffold(TEST_DIR, mockMessages, selections);

      expect(result.summary.skipped.length).toBe(1);
      expect(fs.readFileSync(rulePath, "utf8")).toBe("Modified content");
    });

    test("should overwrite and backup with force option", async () => {
      const selections = {
        ide: "cursor",
        frontend: [],
        backend: [],
        language: []
      };

      // 第一次运行
      await scaffold(TEST_DIR, mockMessages, selections);

      const rulePath = path.join(TEST_DIR, ".cursor/rules/base.mdc");
      fs.writeFileSync(rulePath, "Original content");

      // 第二次运行（带 force）
      const result = await scaffold(TEST_DIR, mockMessages, selections, { force: true });

      expect(result.summary.written.length).toBe(1);
      expect(result.summary.backups.length).toBe(1);
      expect(fs.readFileSync(rulePath, "utf8")).not.toBe("Original content");

      // 检查备份文件存在
      const backupPath = result.summary.backups[0];
      expect(fs.existsSync(backupPath)).toBe(true);
      expect(fs.readFileSync(backupPath, "utf8")).toBe("Original content");
    });

    test("should generate multiple category files for Cursor", async () => {
      const selections = {
        ide: "cursor",
        frontend: ["React", "Vue"],
        backend: ["Node.js"],
        language: ["TypeScript"]
      };

      const result = await scaffold(TEST_DIR, mockMessages, selections);

      const rulesDir = path.join(TEST_DIR, ".cursor/rules");
      expect(result.summary.written.length).toBe(5); // base + 2 frontend + 1 backend + 1 language
      expect(fs.existsSync(path.join(rulesDir, "base.mdc"))).toBe(true);
      expect(fs.existsSync(path.join(rulesDir, "frontend-react.mdc"))).toBe(true);
      expect(fs.existsSync(path.join(rulesDir, "frontend-vue.mdc"))).toBe(true);
      expect(fs.existsSync(path.join(rulesDir, "backend-node-js.mdc"))).toBe(true);
      expect(fs.existsSync(path.join(rulesDir, "language-typescript.mdc"))).toBe(true);
    });

    test("should generate single merged file for Windsurf", async () => {
      const selections = {
        ide: "windsurf",
        frontend: ["React"],
        backend: [],
        language: []
      };

      const result = await scaffold(TEST_DIR, mockMessages, selections);

      // Windsurf 规则在根目录，文件名为 windsurfrules (getOutputFileName 移除了前导点)
      expect(result.targetDir).toBe(TEST_DIR);
      expect(fs.existsSync(path.join(TEST_DIR, "windsurfrules"))).toBe(true);

      const content = fs.readFileSync(path.join(TEST_DIR, "windsurfrules"), "utf8");
      expect(content).toContain("# Windsurf Rules");
      expect(content).toContain("React"); // 应包含 React 规则
    });

    test("should generate copilot-instructions.md for Copilot", async () => {
      const selections = {
        ide: "copilot",
        frontend: [],
        backend: [],
        language: []
      };

      await scaffold(TEST_DIR, mockMessages, selections);

      const filePath = path.join(TEST_DIR, ".github/copilot-instructions.md");
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, "utf8");
      expect(content).toContain("# Copilot Instructions");
    });

    test("should return correct locale in result", async () => {
      const selections = {
        ide: "cursor",
        frontend: [],
        backend: [],
        language: [],
        locale: "en-US"
      };

      const result = await scaffold(TEST_DIR, mockMessages, selections);

      expect(result.locale).toBe("en-US");
    });
  });
});

