# 架构设计规范

## 目录结构

```
projects/
├── src/
│   ├── app/                    # Next.js App Router（页面和API）
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx         # 根布局（主题、导航栏）
│   │   ├── globals.css        # 全局样式
│   │   ├── premium/           # 精品课程模块
│   │   ├── hot-list/          # AI热榜模块
│   │   ├── course/            # 普通课程模块
│   │   ├── resource/          # 资源详情模块
│   │   ├── login/             # 登录页
│   │   ├── profile/           # 个人中心
│   │   ├── learn/             # 学习页
│   │   └── api/               # API路由
│   ├── lib/                   # 工具库（类型、数据、工具函数）
│   └── data/                  # 数据文件（JSON）
├── shujuzhuanqu-youyouyunchang/  # 课程爬虫
├── scripts/                   # 脚本目录
└── public/                    # 静态资源
```

## 模块职责

### 1. 首页模块 (src/app/page.tsx)

**职责**: 展示首页所有内容，包括Hero区域、AI热榜、最新动态、资源导航、精品课程

**输入**:
- 热榜API数据
- 资源数据
- 课程数据

**输出**:
- 完整的首页UI

**技术实现**:
- 使用React hooks管理状态
- 通过fetch调用API获取数据
- 使用TailwindCSS实现响应式布局

### 2. 精品课程模块 (src/app/premium/)

**职责**: 展示精品课程列表和详情

**输入**:
- courses.json 课程数据

**输出**:
- 课程列表页（4列网格）
- 课程详情页（含资源获取区域）

**技术实现**:
- 静态数据加载
- 响应式网格布局
- 内容清洗（过滤无用信息）

### 3. AI热榜模块 (src/app/hot-list/)

**职责**: 展示AI热榜列表和详情

**输入**:
- hot-list.json 热榜数据
- 智谱AI生成的详细内容

**输出**:
- 热榜列表（首页展示前8条）
- 热榜详情页（2000+字详细内容）

**技术实现**:
- API路由提供数据
- Markdown渲染（纯文本格式）
- 动态路由[id]

### 4. 课程爬虫模块 (shujuzhuanqu-youyouyunchang/)

**职责**: 爬取悠悠云创网站的课程数据

**输入**:
- 网站URL
- 登录凭证

**输出**:
- articles.json 原始文章数据
- images/ 下载的图片

**技术实现**:
- Python requests + BeautifulSoup
- 增量更新（跳过已存在文章）
- 内容清洗（过滤广告、价格等）

## 数据流

```
爬虫脚本 → articles.json → 转换脚本 → courses.json → 前端展示
                                    ↓
智谱AI → hot-list.json → API路由 → 前端展示
```

## API端点

### 热榜
- `GET /api/hot-list` - 获取热榜数据

### 动态
- `GET /api/posts` - 获取动态列表
- `POST /api/posts` - 发布动态

### 认证
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/verify-code` - 验证验证码
- `GET /api/auth/me` - 获取当前用户
- `POST /api/auth/logout` - 登出

### 资源
- `GET /api/resources` - 获取资源列表

## 错误处理

### 统一错误响应格式
```json
{
    "success": false,
    "error": "错误描述信息"
}
```

## 配置管理

### 环境变量
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase匿名密钥
- `ZHIPU_API_KEY` - 智谱AI API密钥

## 性能考虑

1. 使用静态数据（JSON）减少API调用
2. 图片懒加载
3. 分页加载数据
4. 增量爬取避免重复数据

## 安全考虑

1. 验证码登录防止暴力破解
2. API路由验证用户身份
3. 不暴露敏感信息（密码、密钥）
4. 爬虫使用延迟避免被封IP
