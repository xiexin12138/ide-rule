// Reason: Centralized type definitions for consumers and internal modules.

export type LocaleCode = "zh-CN" | "en-US" | string;

export interface GenerationOptions {
  targetDir: string;
  ide: string;
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

