<!-- Reason: Template for initializing project memory during scaffold. -->

# 🧠 Project Memory: [项目名称]

> **AI 指令**: 本文件是项目的“长期记忆”和“唯一架构事实来源”。
> 1. 在回答任何架构问题前，优先参考此文件。
> 2. 若发现代码实现与本文件冲突，请**指出冲突**并询问用户。
> 3. 若用户确认了新的架构变更，**必须**在任务结束时提醒用户更新此文件。

## 1. 🗺️ Context Map & Resources (资源索引)
*指向外部事实来源，防止幻觉。*
- **Design System**: [Figma Link / UI Kit Name]
- **DB Schema**: `prisma/schema.prisma` (Primary Truth)
- **API Docs**: [Swagger / Postman Link]
- **Product Specs**: `docs/tasks/`

## 2. 🏗️ High-Level Architecture (系统架构)
- **架构模式**: (例如：Modular Monolith - 模块化单体)
- **核心数据流**: `Client (Next.js)` -> `Edge (Cloudflare)` -> `Core API (Hono)` -> `DB (Neon PG)`
- **关键组件**:
    - **Frontend**: Next.js 14 (App Router), Server Actions (for mutations).
    - **Backend**: Hono.js (Edge runtime), Zod (Validation).
    - **Database**: PostgreSQL + Prisma ORM.
    - **Queue**: (例如 BullMQ / Cloudflare Queues)

## 3. 🛠️ Tech Stack & Conventions (技术栈与约定)
- **语言**: TypeScript 5.x (Strict Mode enabled).
- **样式**: Tailwind CSS (Utility-first), shadcn/ui (Component Lib).
- **状态管理**:
    - Server State: React Query / SWR (优先使用).
    - Client State: Zustand (仅用于复杂交互).
    - Form State: React Hook Form + Zod.
- **文件命名**: `kebab-case` for files, `PascalCase` for components.

## 4. 🧪 Testing Strategy (测试策略)
- **Unit Test**: Vitest. 覆盖 Utils 和纯逻辑 Hooks。
- **Component Test**: Testing Library. 仅测试关键 UI 组件。
- **E2E**: Playwright. 覆盖 "User Login" 和 "Checkout" 核心路径。
- **Mocking**: 禁止测试真实数据库，必须使用 Mock。

## 5. 🧩 Key Design Decisions (ADRs - 关键决策记录)
*记录“为什么这么做”，防止 AI 提议回滚到旧方案。*

- **[ADR-001] 认证方案**:
    - *决策*: 使用 Clerk。
    - *理由*: 避免自行维护 Auth 安全性，且支持多租户。
    - *约束*: 所有用户数据必须通过 Webhook 同步到本地 DB。

- **[ADR-002] 数据获取**:
    - *决策*: 优先使用 Server Components 获取数据。
    - *理由*: 减少客户端 Bundle 大小，提升 SEO。

## 6. 🔄 Business Context & Vocabulary (业务词汇表 - Ubiquitous Language)
*AI 命名变量时必须查阅此表。*

| 术语 (English) | 术语 (中文) | 定义/代码映射 |
| :--- | :--- | :--- |
| **User** | 用户 | 登录账号，映射 `users` 表。 |
| **Workspace** | 工作区 | 资源隔离边界，URL 路径通常包含 `/w/[workspaceId]`。 |
| **Member** | 成员 | User 在特定 Workspace 下的身份 (包含 Role)。 |

## 7. 🚀 Development State (当前开发状态)
- **当前阶段**: Phase 2 - 计费集成
- **当前焦点任务**: `docs/tasks/TASK-005-Stripe-Integration.md` (请重点关注此任务文件)
- **已完成**:
    - [x] Auth 基础流程
    - [x] 多租户切换逻辑

## 8. ⚠️ Known Issues & Technical Debt (已知问题)
- **[High]**: 移动端 Sidebar 在 iOS Safari 上滑动穿透 (待修复)。
- **[Medium]**: `User` 表目前缺少软删除 (`deletedAt`) 字段。

