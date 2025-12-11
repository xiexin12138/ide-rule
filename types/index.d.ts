// Reason: Centralized type definitions for consumers and internal modules.

export type LocaleCode = "zh-CN" | "en-US" | string;

/**
 * 支持的 IDE 类型
 */
export type SupportedIde =
  | "cursor"
  | "trae"
  | "windsurf"
  | "copilot"
  | "lingma"
  | "codebuddy"
  | "vscode"
  | string;

/**
 * IDE 适配器配置
 */
export interface IdeAdapter {
  name: string;
  rulesDir: string;
  fileExt: string;
  fileName?: string;
  singleFile?: boolean;
  supportsFrontmatter: boolean;
  supportsGlobs: boolean;
  supportsAlwaysApply: boolean;
  frontmatterTemplate?: (meta: RuleMeta) => string;
  headerTemplate?: (meta: RuleMeta) => string;
  placeholders: Record<string, string>;
}

/**
 * 规则元数据
 */
export interface RuleMeta {
  description: string;
  globs?: string;
  alwaysApply?: boolean;
  title?: string;
}

export interface GenerationOptions {
  targetDir: string;
  ide: SupportedIde;
  frontend?: string[];
  backend?: string[];
  language?: string[];
  locale?: LocaleCode;
  force?: boolean;
}

export interface RuleTemplate {
  id?: string;
  name: string;
  target: string;
  locale?: LocaleCode;
  content: string;
}

export interface LocaleBundle {
  locale: LocaleCode;
  messages: Record<string, unknown>;
}

export interface ScaffoldPlan {
  locale: LocaleCode;
  baseTemplate: RuleTemplate;
  extraTemplates: RuleTemplate[];
  backups: string[];
}

/**
 * 文件生成计划
 */
export interface FilePlan {
  filename: string;
  content: string;
  category?: string;
  name?: string;
}

/**
 * 脚手架执行结果
 */
export interface ScaffoldResult {
  targetDir: string;
  locale: LocaleCode;
  summary: {
    written: string[];
    skipped: string[];
    backups: string[];
  };
  memory: {
    filePath: string;
    skipped: boolean;
    backup: string | null;
  };
}
