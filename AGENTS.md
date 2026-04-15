# NexusAI - AI 学习社区

## 项目概述

NexusAI 是一个 AI 学习社区平台，帮助用户追踪 AI 前沿动态、分享学习心得、完成成长任务。

### 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **包管理器**: pnpm

## 项目结构

```
/workspace/projects/
├── src/
│   ├── app/                    # 页面路由
│   │   ├── api/               # API 路由
│   │   │   ├── posts/         # 动态相关 API
│   │   │   ├── resources/     # 资源相关 API
│   │   │   ├── tasks/         # 任务相关 API
│   │   │   ├── news/          # 新闻 API
│   │   │   └── hot-list/      # 热榜 API
│   │   ├── learn/             # 学习中心页面
│   │   ├── profile/           # 个人中心页面
│   │   ├── resources/         # 资源区页面
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/
│   │   ├── common/            # 通用组件
│   │   │   └── user-avatar.tsx
│   │   ├── home/              # 首页组件
│   │   │   ├── article-card.tsx
│   │   │   ├── create-post.tsx
│   │   │   ├── hot-list.tsx
│   │   │   ├── news-carousel.tsx
│   │   │   └── post-card.tsx
│   │   ├── layout/
│   │   │   └── navbar.tsx
│   │   └── ui/                # shadcn/ui 组件
│   ├── lib/
│   │   ├── utils.ts           # 工具函数
│   │   └── types.ts           # 类型定义
│   └── storage/
│       └── database/
│           └── shared/
│               └── schema.ts  # 数据库 Schema
├── public/                     # 静态资源
├── package.json
├── tsconfig.json
└── .coze                       # Coze 配置文件
```

## 开发命令

```bash
# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 启动生产环境
pnpm start

# TypeScript 检查
npx tsc --noEmit
```

## 数据库

### 表结构

- **users**: 用户表
- **posts**: 动态表
- **likes**: 点赞表
- **comments**: 评论表
- **resources**: 资源表
- **tasks**: 任务表
- **user_task_progress**: 用户任务进度表
- **news**: AI 新闻表
- **hot_list**: 热榜表
- **favorites**: 收藏表

### 数据库操作

```bash
# 同步模型到数据库
coze-coding-ai db upgrade

# 生成模型文件
coze-coding-ai db generate-models
```

## 设计规范

### 颜色系统

```css
--primary: #6366f1      /* 靛蓝紫 - 主色 */
--accent: #22d3ee       /* 青色 - 强调色 */
--background: #09090b   /* 深黑背景 */
--card: #18181b         /* 卡片背景 */
--success: #10b981      /* 成功绿 */
--warning: #f59e0b      /* 警告黄 */
--error: #ef4444        /* 错误红 */
```

### 动画规范

- 入场动画: `fade-in-up` 400ms ease-out
- 悬浮效果: `hover-lift` transform + shadow
- 脉冲动画: `pulse-glow` 2s infinite

## 页面说明

### 首页 (`/`)
- AI 一周大事轮播
- AI 热榜列表
- 精选文章
- 用户动态流
- 发布动态功能

### 资源区 (`/resources`)
- 分类浏览（全部、AI工具、教程、论文、视频、数据集、开源项目）
- 资源搜索
- 收藏功能

### 学习中心 (`/learn`)
- 今日任务
- 成长路径可视化
- 学习统计
- 徽章墙

### 个人中心 (`/profile`)
- 用户信息
- 我的动态
- 我的收藏
- 任务记录
- 徽章展示

## 注意事项

1. 使用 pnpm 作为包管理器
2. 组件使用 `'use client'` 标记客户端组件
3. 样式使用 Tailwind CSS 4 和 CSS 变量
4. 数据库字段使用 snake_case
5. API 返回格式统一为 `{ data, error }`
