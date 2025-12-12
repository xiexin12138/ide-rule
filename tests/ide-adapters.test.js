// Reason: Unit tests for ide-adapters.js - validates adapter configurations.

const {
  IDE_ADAPTERS,
  getAdapter,
  getSupportedIdes,
  slugify
} = require("../src/ide-adapters");

describe("ide-adapters", () => {
  describe("IDE_ADAPTERS", () => {
    const requiredIdes = ["cursor", "trae", "windsurf", "copilot", "lingma", "codebuddy", "vscode", "claudecode", "gemini"];

    test.each(requiredIdes)("should have adapter for %s", (ide) => {
      expect(IDE_ADAPTERS[ide]).toBeDefined();
    });

    test.each(requiredIdes)("%s should have required properties", (ide) => {
      const adapter = IDE_ADAPTERS[ide];

      expect(adapter).toHaveProperty("name");
      expect(adapter).toHaveProperty("rulesDir");
      expect(adapter).toHaveProperty("fileExt");
      expect(adapter).toHaveProperty("placeholders");
      expect(typeof adapter.supportsFrontmatter).toBe("boolean");
    });

    test("Cursor should support frontmatter", () => {
      const cursor = IDE_ADAPTERS.cursor;

      expect(cursor.supportsFrontmatter).toBe(true);
      expect(cursor.supportsGlobs).toBe(true);
      expect(cursor.supportsAlwaysApply).toBe(true);
      expect(cursor.frontmatterTemplate).toBeInstanceOf(Function);
    });

    test("Windsurf, Copilot, ClaudeCode, and Gemini should be single-file IDEs", () => {
      expect(IDE_ADAPTERS.windsurf.singleFile).toBe(true);
      expect(IDE_ADAPTERS.copilot.singleFile).toBe(true);
      expect(IDE_ADAPTERS.claudecode.singleFile).toBe(true);
      expect(IDE_ADAPTERS.gemini.singleFile).toBe(true);
    });

    test("Claude Code should have correct configuration", () => {
      const claudecode = IDE_ADAPTERS.claudecode;

      expect(claudecode.name).toBe("Claude Code");
      expect(claudecode.fileName).toBe("CLAUDE.md");
      expect(claudecode.rulesDir).toBe(".");
      expect(claudecode.headerTemplate).toBeInstanceOf(Function);
    });

    test("Gemini CLI should have correct configuration", () => {
      const gemini = IDE_ADAPTERS.gemini;

      expect(gemini.name).toBe("Gemini CLI");
      expect(gemini.fileName).toBe("GEMINI.md");
      expect(gemini.rulesDir).toBe(".");
      expect(gemini.headerTemplate).toBeInstanceOf(Function);
    });

    test("Lingma should support globs via HTML comment", () => {
      const lingma = IDE_ADAPTERS.lingma;

      expect(lingma.supportsGlobs).toBe(true);
      expect(lingma.supportsAlwaysApply).toBe(true);
      expect(lingma.headerTemplate).toBeInstanceOf(Function);
    });
  });

  describe("getAdapter", () => {
    test("should return correct adapter for known IDE", () => {
      const adapter = getAdapter("cursor");

      expect(adapter.name).toBe("Cursor");
      expect(adapter.rulesDir).toBe(".cursor/rules");
      expect(adapter.fileExt).toBe(".mdc");
    });

    test("should be case-insensitive", () => {
      const lower = getAdapter("cursor");
      const upper = getAdapter("CURSOR");
      const mixed = getAdapter("Cursor");

      expect(lower.name).toBe("Cursor");
      expect(upper.name).toBe("Cursor");
      expect(mixed.name).toBe("Cursor");
    });

    test("should return default adapter for unknown IDE", () => {
      const adapter = getAdapter("unknown-ide");

      expect(adapter.name).toBe("unknown-ide");
      expect(adapter.rulesDir).toBe(".unknown-ide/rules");
      expect(adapter.fileExt).toBe(".md");
      expect(adapter.supportsFrontmatter).toBe(false);
    });

    test("default adapter should have working headerTemplate", () => {
      const adapter = getAdapter("custom-ide");
      const header = adapter.headerTemplate({ title: "Test", description: "Desc" });

      expect(header).toContain("# Test");
      expect(header).toContain("Desc");
    });
  });

  describe("getSupportedIdes", () => {
    test("should return array of IDE keys", () => {
      const ides = getSupportedIdes();

      expect(Array.isArray(ides)).toBe(true);
      expect(ides).toContain("cursor");
      expect(ides).toContain("trae");
      expect(ides).toContain("windsurf");
      expect(ides).toContain("copilot");
      expect(ides).toContain("lingma");
      expect(ides).toContain("codebuddy");
      expect(ides).toContain("vscode");
    });

    test("should have at least 9 supported IDEs", () => {
      const ides = getSupportedIdes();
      expect(ides.length).toBeGreaterThanOrEqual(9);
    });

    test("should include Claude Code and Gemini CLI", () => {
      const ides = getSupportedIdes();
      expect(ides).toContain("claudecode");
      expect(ides).toContain("gemini");
    });
  });

  describe("slugify", () => {
    test("should convert to lowercase", () => {
      expect(slugify("UPPERCASE")).toBe("uppercase");
      expect(slugify("MixedCase")).toBe("mixedcase");
    });

    test("should replace special characters with hyphens", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("React/Vue")).toBe("react-vue");
      expect(slugify("Node.js")).toBe("node-js");
    });

    test("should remove leading and trailing hyphens", () => {
      expect(slugify("--test--")).toBe("test");
      expect(slugify("  spaced  ")).toBe("spaced");
    });

    test("should handle consecutive special characters", () => {
      expect(slugify("a___b")).toBe("a-b");
      expect(slugify("a   b   c")).toBe("a-b-c");
    });
  });

  describe("frontmatterTemplate", () => {
    test("Cursor frontmatter should include all fields", () => {
      const template = IDE_ADAPTERS.cursor.frontmatterTemplate({
        description: "Test desc",
        globs: "*.tsx",
        alwaysApply: true
      });

      expect(template).toMatch(/^---/);
      expect(template).toMatch(/---$/);
      expect(template).toContain("description: Test desc");
      expect(template).toContain("globs: *.tsx");
      expect(template).toContain("alwaysApply: true");
    });

    test("Cursor frontmatter should omit alwaysApply when false", () => {
      const template = IDE_ADAPTERS.cursor.frontmatterTemplate({
        description: "Test",
        globs: "*",
        alwaysApply: false
      });

      expect(template).not.toContain("alwaysApply");
    });
  });

  describe("headerTemplate", () => {
    test("Trae header should use blockquote for description", () => {
      const template = IDE_ADAPTERS.trae.headerTemplate({
        title: "My Rule",
        description: "Rule description"
      });

      expect(template).toContain("# My Rule");
      expect(template).toContain("> Rule description");
    });

    test("Lingma header should use HTML comment for metadata", () => {
      const template = IDE_ADAPTERS.lingma.headerTemplate({
        title: "Lingma Rule",
        description: "Description",
        globs: "*.py",
        alwaysApply: true
      });

      expect(template).toContain("<!--");
      expect(template).toContain("type: always");
      expect(template).toContain("globs: *.py");
      expect(template).toContain("-->");
    });
  });
});

