// Reason: Unit tests for formatters.js - validates IDE-specific formatting logic.

const {
  formatForIde,
  formatBaseRule,
  formatCategoryRule,
  getOutputFileName,
  mergeRulesForSingleFile,
  stripExistingFrontmatter
} = require("../src/formatters");

describe("formatters", () => {
  describe("formatForIde", () => {
    const sampleContent = "# Sample Rule\n\nThis is test content.";
    const meta = {
      description: "Test description",
      globs: "*.ts",
      alwaysApply: true,
      title: "Test Rule"
    };

    test("Cursor: should generate frontmatter with globs and alwaysApply", () => {
      const result = formatForIde(sampleContent, "cursor", meta);

      expect(result).toContain("---");
      expect(result).toContain("description: Test description");
      expect(result).toContain("globs: *.ts");
      expect(result).toContain("alwaysApply: true");
      expect(result).toContain("# Sample Rule");
    });

    test("Trae: should use Markdown header without frontmatter", () => {
      const result = formatForIde(sampleContent, "trae", meta);

      // Trae 不使用 frontmatter
      expect(result).not.toMatch(/^---[\s\S]*?---/);
      expect(result).toContain("# Test Rule");
      expect(result).toContain("> Test description");
      expect(result).toContain("# Sample Rule");
    });

    test("Windsurf: should use hash header format", () => {
      const result = formatForIde(sampleContent, "windsurf", meta);

      expect(result).not.toMatch(/^---[\s\S]*?---/);
      expect(result).toContain("# Windsurf Rules");
      expect(result).toContain("# Sample Rule");
    });

    test("Copilot: should use simple Markdown header", () => {
      const result = formatForIde(sampleContent, "copilot", meta);

      expect(result).toContain("# Copilot Instructions");
      expect(result).toContain("Test description");
    });

    test("Lingma: should use HTML comment metadata", () => {
      const result = formatForIde(sampleContent, "lingma", meta);

      expect(result).toContain("<!--");
      expect(result).toContain("type: always");
      expect(result).toContain("globs: *.ts");
      expect(result).toContain("-->");
    });

    test("CodeBuddy: should use simple Markdown header", () => {
      const result = formatForIde(sampleContent, "codebuddy", meta);

      expect(result).toContain("# Test Rule");
      expect(result).toContain("Test description");
    });

    test("should replace __IDE_NAME__ placeholder", () => {
      const contentWithPlaceholder = "Welcome to __IDE_NAME__ rules!";
      const result = formatForIde(contentWithPlaceholder, "cursor", meta);

      expect(result).toContain("Welcome to Cursor rules!");
      expect(result).not.toContain("__IDE_NAME__");
    });

    test("should replace __IDE_RULES_DIR__ placeholder", () => {
      const contentWithPlaceholder = "Rules are in __IDE_RULES_DIR__/";
      const result = formatForIde(contentWithPlaceholder, "cursor", meta);

      expect(result).toContain("Rules are in .cursor/rules/");
      expect(result).not.toContain("__IDE_RULES_DIR__");
    });
  });

  describe("stripExistingFrontmatter", () => {
    test("should remove frontmatter from content", () => {
      const content = `---
description: old
globs: *
---
# Content`;

      const result = stripExistingFrontmatter(content);

      expect(result).toBe("# Content");
      expect(result).not.toContain("---");
    });

    test("should leave content unchanged if no frontmatter", () => {
      const content = "# Just Content\n\nNo frontmatter here.";
      const result = stripExistingFrontmatter(content);

      expect(result).toBe(content);
    });
  });

  describe("formatBaseRule", () => {
    test("should apply base rule meta for Cursor", () => {
      const content = "# Base Content";
      const result = formatBaseRule(content, "cursor");

      expect(result).toContain("基础架构师规则");
      expect(result).toContain("globs: *");
      expect(result).toContain("alwaysApply: true");
    });
  });

  describe("formatCategoryRule", () => {
    test("should apply category meta for frontend", () => {
      const content = "# React rules";
      const result = formatCategoryRule(content, "cursor", "frontend", "React");

      expect(result).toContain("frontend guideline for React");
    });
  });

  describe("getOutputFileName", () => {
    test("Cursor: should return .mdc extension", () => {
      const result = getOutputFileName("cursor", "base");
      expect(result).toBe("base.mdc");
    });

    test("Trae: should return .md extension", () => {
      const result = getOutputFileName("trae", "base");
      expect(result).toBe("base.md");
    });

    test("Windsurf: should return .windsurfrules (single file)", () => {
      const result = getOutputFileName("windsurf", "base");
      expect(result).toBe("windsurfrules");
    });

    test("Copilot: should return fixed filename", () => {
      const result = getOutputFileName("copilot", "base");
      expect(result).toBe("copilot-instructions.md");
    });
  });

  describe("mergeRulesForSingleFile", () => {
    test("should merge multiple rules with separator", () => {
      const rules = [
        { content: "Rule 1 content", category: "base", name: "base" },
        { content: "Rule 2 content", category: "frontend", name: "React" }
      ];

      const result = mergeRulesForSingleFile(rules, "windsurf");

      expect(result).toContain("Rule 1 content");
      expect(result).toContain("Rule 2 content");
      expect(result).toContain("---"); // separator
    });

    test("should add IDE-specific header", () => {
      const rules = [{ content: "Test", category: "base", name: "base" }];
      const result = mergeRulesForSingleFile(rules, "copilot");

      expect(result).toContain("# Copilot Instructions");
    });
  });
});

