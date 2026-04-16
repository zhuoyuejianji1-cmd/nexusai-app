'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, Flame, Hash, Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { resourceCategories, iconMap } from '@/lib/resources';

// 主题上下文
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// 动态导入重型组件
import dynamic from 'next/dynamic';
const PostCard = dynamic(() => import('@/components/home/post-card').then(mod => ({ default: mod.PostCard })), {
  loading: () => <div className="h-24 bg-white dark:bg-slate-800 rounded-xl animate-pulse shadow-sm" />,
  ssr: false,
});

const CreatePost = dynamic(() => import('@/components/home/create-post').then(mod => ({ default: mod.CreatePost })), {
  loading: () => <div className="h-16 bg-white dark:bg-slate-800 rounded-xl animate-pulse shadow-sm" />,
  ssr: false,
});

// 模拟动态数据
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: '刚刚完成了 Midjourney 的进阶课程学习，终于掌握了如何生成高质量的产品图片！',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: '设计小能手', points: 150, created_at: '' },
  },
];

// 首页分类导航
const categories = resourceCategories.slice(0, 8).map(cat => ({
  icon: iconMap[cat.icon] || Sparkles,
  label: cat.name,
  desc: cat.description,
  color: cat.color,
  href: '/resources'
}));

// AI 热榜
const hotListItems = [
  { rank: 1, title: 'GPT-5 正式发布：OpenAI 开启新一代多模态时代', heat: 98600, category: '大模型', isHot: true },
  { rank: 2, title: 'Claude 3.5 超越 GPT-4 成为编程最强助手', heat: 87500, category: '大模型', isHot: true },
  { rank: 3, title: '开源模型 Llama 4 发布：性能直逼闭源', heat: 76200, category: '开源' },
  { rank: 4, title: 'AI Agent 落地应用：AutoGPT 成为焦点', heat: 65400, category: 'Agent', isNew: true },
  { rank: 5, title: 'Midjourney V7 发布：细节控制更精准', heat: 54300, category: '图像' },
  { rank: 6, title: 'GitHub Copilot X 新功能解析', heat: 43200, category: '编程' },
];

// 最新动态
const latestPosts = [
  { name: '设计小能手', content: '刚刚完成了 Midjourney 的进阶课程学习...', time: '15分钟前', likes: 42 },
  { name: '效率达人', content: '分享一个超好用的 AI 工具：Notion AI...', time: '45分钟前', likes: 128 },
  { name: 'AI学习者', content: 'Day 3/30：今天开始学习 Prompt Engineering...', time: '2小时前', likes: 35 },
  { name: '技术大牛', content: '用 Claude 3.5 写代码一周了...', time: '3小时前', likes: 89 },
];

// 主题 Provider 组件
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 主题切换按钮
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-slate-600" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </Button>
  );
}

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "min-h-screen relative",
      theme === 'light' 
        ? "bg-gradient-to-br from-slate-50 via-white to-indigo-50" 
        : "gradient-bg tech-grid"
    )}>
      {/* 动态光效背景 - 仅深色模式 */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      )}
      
      <Navbar />
      
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero 大Logo区域 - 更大更醒目 */}
        <section className="mb-8">
          <div className={cn(
            "relative overflow-hidden rounded-2xl shadow-xl",
            theme === 'light'
              ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700"
              : "bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-purple-900/90 border border-indigo-500/30"
          )}>
            {/* 背景光效 */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-8 py-16 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="flex items-center gap-5 mb-6">
                <div className="flex items-center justify-center h-24 w-24 rounded-3xl bg-white/20 backdrop-blur shadow-lg">
                  <Sparkles className="h-14 w-14 text-white" />
                </div>
                <h1 className="font-heading text-6xl font-black text-white tracking-tight">
                  NexusAI
                </h1>
              </div>
              
              {/* 标语 */}
              <h2 className="text-3xl font-bold text-white/90 mb-4">
                探索AI · 分享知识 · 连接未来
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-2xl">
                加入最大的AI学习社区，与千万学习者一起掌握最前沿的人工智能技术
              </p>
              
              {/* 数据指标 - 更大 */}
              <div className="flex items-center gap-14 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">10,000+</div>
                  <div className="text-sm text-white/60 mt-1">精品资源</div>
                </div>
                <div className="w-px h-14 bg-white/20" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/60 mt-1">AI工具</div>
                </div>
                <div className="w-px h-14 bg-white/20" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">1,000,000+</div>
                  <div className="text-sm text-white/60 mt-1">学习者</div>
                </div>
              </div>
              
              {/* 分类导航 - 更大更醒目 */}
              <div className="w-full grid grid-cols-4 gap-4">
                {categories.map((cat, index) => (
                  <Link key={index} href={cat.href}>
                    <div className={cn(
                      'group flex flex-col items-center p-5 rounded-2xl backdrop-blur transition-all duration-300 cursor-pointer',
                      theme === 'light'
                        ? 'bg-white/15 hover:bg-white/25 text-white'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    )}>
                      <div className={cn(
                        'flex items-center justify-center h-14 w-14 rounded-2xl mb-3 bg-white/20 group-hover:bg-white/30 transition-colors',
                        cat.color
                      )}>
                        <cat.icon className="h-7 w-7 text-white" />
                      </div>
                      <span className="text-base font-bold text-white mb-1">{cat.label}</span>
                      <span className="text-xs text-white/60">{cat.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 第二行：AI 热榜 + 最新动态（左右并排） */}
        <section className="grid grid-cols-2 gap-6 mb-6">
          {/* AI 热榜 */}
          <Card className={cn(
            "overflow-hidden relative shadow-sm",
            theme === 'light' ? "bg-white border-slate-200" : "border-gradient bg-slate-900/80"
          )}>
            {theme === 'dark' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/90 to-orange-900/30" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
              </>
            )}
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  <span className={cn(
                    "font-heading text-base font-bold",
                    theme === 'light' ? "text-slate-800" : "text-white"
                  )}>🏆 AI 热榜</span>
                </div>
                <Badge className={cn(
                  "text-xs",
                  theme === 'light' 
                    ? "bg-amber-100 text-amber-700 border-0" 
                    : "bg-amber-500/20 text-amber-400 border-0"
                )}>
                  <Flame className="h-3 w-3 mr-1" /> 实时
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="space-y-0">
                {hotListItems.map((item) => (
                  <Link key={item.rank} href="/resources">
                    <div className="group flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <span className={cn(
                        'flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold shrink-0',
                        theme === 'light'
                          ? item.rank === 1 ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                          : item.rank === 1 ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                          : item.rank === 2 ? 'bg-slate-300 text-slate-700'
                          : item.rank === 3 ? 'bg-orange-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                          : item.rank === 2 && 'bg-gradient-to-br from-slate-400 to-slate-500 text-white',
                          item.rank === 3 && 'bg-gradient-to-br from-orange-600 to-orange-700 text-white',
                          item.rank > 3 && 'bg-slate-800 text-slate-400'
                      )}>
                        {item.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium truncate",
                          theme === 'light' ? "text-slate-700 group-hover:text-indigo-600" : "text-slate-200 group-hover:text-white"
                        )}>
                          {item.title}
                        </h4>
                      </div>
                      <div className={cn(
                        "flex items-center gap-0.5 text-xs shrink-0",
                        theme === 'light' ? "text-orange-500" : "text-orange-400"
                      )}>
                        <Flame className="h-3 w-3" />
                        {(item.heat / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 最新动态 */}
          <Card className={cn(
            "shadow-sm",
            theme === 'light' ? "bg-white border-slate-200" : "glass border-indigo-500/20"
          )}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Hash className={cn("h-5 w-5", theme === 'light' ? "text-indigo-500" : "text-indigo-400")} />
                <span className={cn(
                  "font-heading text-base font-bold",
                  theme === 'light' ? "text-slate-800" : "text-white"
                )}>📢 最新动态</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {latestPosts.map((post, index) => (
                <div key={index} className="flex items-start gap-3 py-2 px-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-semibold shrink-0">
                    {post.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        theme === 'light' ? "text-slate-800" : "text-white"
                      )}>{post.name}</span>
                      <span className={cn(
                        "text-xs",
                        theme === 'light' ? "text-slate-400" : "text-slate-500"
                      )}>{post.time}</span>
                    </div>
                    <p className={cn(
                      "text-xs line-clamp-1 leading-tight",
                      theme === 'light' ? "text-slate-500" : "text-slate-400"
                    )}>{post.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 第三行：社区动态 */}
        <section>
          <Card className={cn(
            "shadow-sm",
            theme === 'light' ? "bg-white border-slate-200" : "glass border-indigo-500/20"
          )}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className={cn("h-5 w-5", theme === 'light' ? "text-indigo-500" : "text-indigo-400")} />
                  <span className={cn(
                    "font-heading text-base font-bold",
                    theme === 'light' ? "text-slate-800" : "text-white"
                  )}>💬 社区动态</span>
                </div>
                <Link href="/" className={cn(
                  "text-sm transition-colors",
                  theme === 'light' ? "text-slate-400 hover:text-indigo-600" : "text-slate-400 hover:text-white"
                )}>
                  查看全部 →
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CreatePost />
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
