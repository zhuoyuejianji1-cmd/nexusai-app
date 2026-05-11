# NexusAI 项目宪章

## 🎯 项目愿景

打造一个集AI学习资源、精品课程、热榜资讯、社区动态于一体的AI学习社区平台。

## 🏗️ 最终架构

### 技术栈
- **前端**: Next.js 16 + React 19 + TypeScript
- **UI框架**: TailwindCSS v4 + shadcn/ui + Radix UI
- **样式**: 自定义暗色/亮色主题切换（next-themes）
- **数据库**: PostgreSQL + Drizzle ORM
- **认证**: Supabase Auth（邮箱验证码登录）
- **部署**: Vercel / 自建服务器
- **AI集成**: 智谱AI glm-4.6v（热榜内容生成）
- **爬虫**: Python requests + BeautifulSoup（课程数据爬取）

### 核心设计原则
1. **内容真实** - 所有热榜、课程内容必须基于真实数据，不编造
2. **增量更新** - 爬虫支持增量更新，自动跳过已存在数据
3. **用户体验优先** - 暗色/亮色主题、响应式设计、流畅动画
4. **数据驱动** - 所有功能基于JSON数据文件，便于维护和扩展
5. **自动化运营** - 定时任务自动更新热榜、爬取新课程

## 📁 项目结构

```
projects/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页（热榜+动态+资源导航）
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   ├── premium/           # 精品课程模块
│   │   │   ├── page.tsx       # 课程列表页
│   │   │   ├── courses.json   # 课程数据
│   │   │   └── [id]/page.tsx  # 课程详情页
│   │   ├── hot-list/          # AI热榜模块
│   │   │   └── [id]/page.tsx  # 热榜详情页
│   │   ├── course/[id]/       # 普通课程详情页
│   │   ├── resource/[id]/     # 资源详情页
│   │   ├── login/             # 登录页
│   │   ├── profile/           # 个人中心
│   │   ├── learn/             # 学习页
│   │   └── api/               # API路由
│   │       ├── hot-list/      # 热榜API
│   │       ├── posts/         # 动态API
│   │       ├── auth/          # 认证API
│   │       └── resources/     # 资源API
│   ├── lib/                   # 工具库
│   │   ├── resources.ts       # 资源数据
│   │   ├── types.ts           # 类型定义
│   │   └── utils.ts           # 工具函数
│   └── data/                  # 数据文件
│       └── hot-list.json      # 热榜数据
├── shujuzhuanqu-youyouyunchang/  # 课程爬虫
│   ├── spider.py              # 主爬虫脚本
│   ├── run_daily.py           # 每日定时运行
│   ├── config.py              # 配置
│   └── data/                  # 爬取数据
│       ├── articles.json      # 原始文章数据
│       └── images/            # 下载的图片
├── scripts/                   # 脚本目录
│   ├── generate_latest_hot_list_content.py  # 热榜内容生成
│   └── 设置定时任务说明.md
└── public/                    # 静态资源
```

## ✅ 完成标准

项目完成的标志：
1. 首页功能完整（热榜、动态、资源导航、精品课程）
2. 课程数据持续更新（爬虫定时运行）
3. 热榜每日自动更新（智谱AI生成详细内容）
4. 用户系统完善（登录、注册、个人中心）
5. 响应式设计，移动端友好

## 📝 规则更新要求

**每次修改代码后，必须更新以下文件**：
1. `PROGRESS.md` - 记录完成的任务
2. 如有架构变更，更新 `ARCHITECTURE.md`
3. 如有新功能，更新 `DEVELOPMENT_GUIDE.md`

**禁止**：
- 使用模拟数据代替真实功能
- 删除已有的规则文件
- 修改 `PROJECT_CHARTER.md` 除非是重大架构变更
