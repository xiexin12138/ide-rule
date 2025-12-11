// Reason: Unit tests for fs-utils.js - validates file operations and backup logic.

const fs = require("fs");
const path = require("path");
const { ensureDir, writeFileSafe } = require("../src/fs-utils");

const TEST_DIR = path.join(__dirname, "__temp__");

describe("fs-utils", () => {
  // 每次测试前清理目录
  beforeEach(async () => {
    await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
  });

  // 测试后清理
  afterAll(async () => {
    await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe("ensureDir", () => {
    test("should create directory if not exists", async () => {
      const targetDir = path.join(TEST_DIR, "new-dir", "nested");

      await ensureDir(targetDir);

      const exists = fs.existsSync(targetDir);
      expect(exists).toBe(true);
    });

    test("should not throw if directory already exists", async () => {
      const targetDir = path.join(TEST_DIR, "existing");

      await ensureDir(targetDir);
      // 第二次调用不应抛错
      await expect(ensureDir(targetDir)).resolves.not.toThrow();
    });
  });

  describe("writeFileSafe", () => {
    test("should create new file when not exists", async () => {
      const filePath = path.join(TEST_DIR, "new-file.txt");

      await ensureDir(TEST_DIR);
      const result = await writeFileSafe(filePath, "Hello, World!");

      expect(result.skipped).toBe(false);
      expect(result.backup).toBeNull();
      expect(fs.readFileSync(filePath, "utf8")).toBe("Hello, World!");
    });

    test("should skip existing file when force=false", async () => {
      const filePath = path.join(TEST_DIR, "existing.txt");

      await ensureDir(TEST_DIR);
      fs.writeFileSync(filePath, "Original content");

      const result = await writeFileSafe(filePath, "New content", { force: false });

      expect(result.skipped).toBe(true);
      expect(result.backup).toBeNull();
      // 原内容应保持不变
      expect(fs.readFileSync(filePath, "utf8")).toBe("Original content");
    });

    test("should overwrite and backup when force=true", async () => {
      const filePath = path.join(TEST_DIR, "to-overwrite.txt");

      await ensureDir(TEST_DIR);
      fs.writeFileSync(filePath, "Original");

      const result = await writeFileSafe(filePath, "Overwritten", { force: true });

      expect(result.skipped).toBe(false);
      expect(result.backup).not.toBeNull();
      expect(result.backup).toMatch(/\.bak$/);

      // 新内容应写入
      expect(fs.readFileSync(filePath, "utf8")).toBe("Overwritten");

      // 备份文件应存在且包含原内容
      expect(fs.existsSync(result.backup)).toBe(true);
      expect(fs.readFileSync(result.backup, "utf8")).toBe("Original");
    });

    test("backup filename should contain timestamp", async () => {
      const filePath = path.join(TEST_DIR, "timestamped.txt");

      await ensureDir(TEST_DIR);
      fs.writeFileSync(filePath, "Old");

      const result = await writeFileSafe(filePath, "New", { force: true });

      // 备份文件名格式: filename.txt.YYYY-MM-DDTHH-MM-SS-SSSZ.bak
      expect(result.backup).toMatch(/timestamped\.txt\.\d{4}-\d{2}-\d{2}T.*\.bak$/);
    });

    test("should handle special characters in content", async () => {
      const filePath = path.join(TEST_DIR, "special.md");
      const content = `# 中文标题

\`\`\`javascript
const x = "特殊字符: <>\"'&";
\`\`\`

--- 分隔线 ---
`;

      await ensureDir(TEST_DIR);
      await writeFileSafe(filePath, content);

      const written = fs.readFileSync(filePath, "utf8");
      expect(written).toBe(content);
    });

    test("should handle empty content", async () => {
      const filePath = path.join(TEST_DIR, "empty.txt");

      await ensureDir(TEST_DIR);
      await writeFileSafe(filePath, "");

      expect(fs.readFileSync(filePath, "utf8")).toBe("");
    });

    test("should default to skip mode when options not provided", async () => {
      const filePath = path.join(TEST_DIR, "default-mode.txt");

      await ensureDir(TEST_DIR);
      fs.writeFileSync(filePath, "Existing");

      // 不传 options
      const result = await writeFileSafe(filePath, "New");

      expect(result.skipped).toBe(true);
      expect(fs.readFileSync(filePath, "utf8")).toBe("Existing");
    });
  });
});

