'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, Flame, Hash, Sparkles, Sun, Moon, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { resourceCategories, iconMap } from '@/lib/resources';

import { PostCard } from '@/components/home/post-card';
import { CreatePost } from '@/components/home/create-post';

// 分类导航
const categories = resourceCategories.slice(0, 8).map(cat => ({
  icon: iconMap[cat.icon] || Sparkles,
  label: cat.name,
  desc: cat.description,
  color: cat.color,
  href: '/resources',
  gradient: {
    'ai-tools': 'from-violet-500 to-purple-500',
    'ai-chat': 'from-blue-500 to-cyan-500',
    'ai-image': 'from-pink-500 to-rose-500',
    'ai-video': 'from-red-500 to-orange-500',
    'ai-music': 'from-purple-500 to-fuchsia-500',
    'ai-coding': 'from-emerald-500 to-green-500',
    'ai-prompts': 'from-amber-500 to-yellow-500',
    'video-streaming': 'from-red-500 to-pink-500',
  }[cat.id] || 'from-indigo-500 to-purple-500',
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

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark 
        ? "bg-[#0a0a0f] text-white" 
        : "bg-[#fafbfc] text-slate-900"
    )}>
      {/* 背景装饰 - 仅深色模式 */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-[100px]" />
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      )}
      
      <Navbar />
      
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero 区域 */}
        <section className="mb-12">
          <div className={cn(
            "relative overflow-hidden rounded-3xl",
            isDark 
              ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-white/5" 
              : "bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 border border-slate-200/80 shadow-xl shadow-slate-200/50"
          )}>
            {/* 装饰元素 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={cn(
                "absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl",
                isDark ? "bg-indigo-500/10" : "bg-indigo-200/50"
              )} />
              <div className={cn(
                "absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl",
                isDark ? "bg-purple-500/10" : "bg-purple-200/50"
              )} />
            </div>
            
            <div className="relative px-10 py-16 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="flex items-center gap-5 mb-8">
                <div className={cn(
                  "relative flex items-center justify-center h-20 w-20 rounded-2xl",
                  isDark 
                    ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30" 
                    : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20"
                )}>
                  <Sparkles className="h-10 w-10 text-white" />
                  <div className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent",
                    isDark ? "" : ""
                  )} />
                </div>
                <div>
                  <h1 className={cn(
                    "font-heading text-5xl font-black tracking-tight",
                    isDark 
                      ? "bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  )}>
                    NexusAI
                  </h1>
                  <p className={cn(
                    "text-sm font-medium tracking-wider uppercase",
                    isDark ? "text-slate-500" : "text-slate-400"
                  )}>
                    AI Learning Community
                  </p>
                </div>
              </div>
              
              {/* 标语 */}
              <h2 className={cn(
                "text-2xl font-semibold mb-4 tracking-wide",
                isDark ? "text-white/90" : "text-slate-700"
              )}>
                探索 AI · 分享知识 · 连接未来
              </h2>
              <p className={cn(
                "text-base mb-10 max-w-xl leading-relaxed",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                加入最大的AI学习社区，与千万学习者一起掌握最前沿的人工智能技术
              </p>
              
              {/* 数据指标 */}
              <div className={cn(
                "flex items-center gap-10 mb-12 p-6 rounded-2xl",
                isDark 
                  ? "bg-white/5 backdrop-blur-sm border border-white/10" 
                  : "bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg"
              )}>
                {[
                  { value: '10,000+', label: '精品资源', border: isDark ? 'border-white/10' : 'border-slate-200' },
                  { value: '500+', label: 'AI工具', border: isDark ? 'border-white/10' : 'border-slate-200' },
                  { value: '1M+', label: '学习者', border: '' },
                ].map((stat, i) => (
                  <div key={i} className={cn(
                    "text-center px-8",
                    i < 2 ? (isDark ? "border-r border-white/10" : "border-r border-slate-200") : ""
                  )}>
                    <div className={cn(
                      "font-heading text-3xl font-bold tracking-tight",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      {stat.value}
                    </div>
                    <div className={cn(
                      "text-sm mt-1 font-medium",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 分类导航 */}
              <div className="w-full grid grid-cols-4 gap-4">
                {categories.map((cat, index) => (
                  <Link 
                    key={index} 
                    href={cat.href}
                    className="group"
                  >
                    <div className={cn(
                      "relative p-5 rounded-2xl transition-all duration-300 h-full",
                      isDark
                        ? "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 backdrop-blur-sm"
                        : "bg-white hover:bg-white border border-slate-200/50 hover:border-indigo-200/50 shadow-sm hover:shadow-md"
                    )}>
                      <div className={cn(
                        "flex items-center justify-center h-12 w-12 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110",
                        `bg-gradient-to-br ${cat.gradient}`
                      )}>
                        <cat.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className={cn(
                        "text-sm font-semibold mb-1 transition-colors",
                        isDark ? "text-white group-hover:text-white" : "text-slate-800 group-hover:text-indigo-600"
                      )}>
                        {cat.label}
                      </h3>
                      <p className={cn(
                        "text-xs line-clamp-1",
                        isDark ? "text-slate-500" : "text-slate-400"
                      )}>
                        {cat.desc}
                      </p>
                      <div className={cn(
                        "absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                        isDark ? "text-white/50" : "text-indigo-400"
                      )}>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 第二行：AI 热榜 + 最新动态 */}
        <section className="grid grid-cols-2 gap-6 mb-8">
          {/* AI 热榜 */}
          <Card className={cn(
            "overflow-hidden h-full",
            isDark 
              ? "bg-[#12121a] border-white/5" 
              : "bg-white border-slate-200/80 shadow-sm"
          )}>
            <div className={cn(
              "h-1",
              isDark 
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" 
                : "bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"
            )} />
            <CardHeader className={cn(
              "pb-3",
              isDark ? "bg-gradient-to-r from-amber-900/20 to-transparent" : "bg-gradient-to-r from-amber-50/50 to-transparent"
            )}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-xl",
                    isDark ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" : "bg-gradient-to-br from-amber-100 to-orange-100"
                  )}>
                    <TrendingUp className={cn(
                      "h-4 w-4",
                      isDark ? "text-amber-400" : "text-amber-600"
                    )} />
                  </div>
                  <span className={cn(
                    "font-heading text-base font-bold",
                    isDark ? "text-white" : "text-slate-800"
                  )}>AI 热榜</span>
                </div>
                <Badge className={cn(
                  "text-xs font-medium",
                  isDark 
                    ? "bg-amber-500/20 text-amber-400 border-0" 
                    : "bg-amber-100 text-amber-600 border-0"
                )}>
                  <Flame className="h-3 w-3 mr-1" /> 实时更新
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {hotListItems.map((item) => (
                  <Link key={item.rank} href="/resources">
                    <div className={cn(
                      "group flex items-center gap-4 py-3 px-3 -mx-3 rounded-xl transition-all cursor-pointer",
                      isDark
                        ? "hover:bg-white/5"
                        : "hover:bg-slate-50"
                    )}>
                      <span className={cn(
                        'flex items-center justify-center h-7 w-7 rounded-lg text-sm font-bold shrink-0',
                        item.rank === 1 
                          ? isDark 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                            : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-200'
                          : item.rank === 2 
                            ? isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                            : item.rank === 3 
                              ? isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                              : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                      )}>
                        {item.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium truncate transition-colors",
                          isDark 
                            ? "text-slate-200 group-hover:text-white" 
                            : "text-slate-700 group-hover:text-slate-900"
                        )}>
                          {item.title}
                        </h4>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs shrink-0 px-2 py-1 rounded-full",
                        isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
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
            "h-full",
            isDark 
              ? "bg-[#12121a] border-white/5" 
              : "bg-white border-slate-200/80 shadow-sm"
          )}>
            <div className={cn(
              "h-1",
              isDark 
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" 
                : "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
            )} />
            <CardHeader className={cn(
              "pb-3",
              isDark ? "bg-gradient-to-r from-indigo-900/20 to-transparent" : "bg-gradient-to-r from-indigo-50/50 to-transparent"
            )}>
              <CardTitle className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-xl",
                  isDark ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20" : "bg-gradient-to-br from-indigo-100 to-purple-100"
                )}>
                  <Hash className={cn(
                    "h-4 w-4",
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  )} />
                </div>
                <span className={cn(
                  "font-heading text-base font-bold",
                  isDark ? "text-white" : "text-slate-800"
                )}>最新动态</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {latestPosts.map((post, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start gap-3 py-3 px-3 -mx-3 rounded-xl transition-all",
                    isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold shrink-0 shadow-md",
                    isDark 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
                      : "bg-gradient-to-br from-indigo-400 to-purple-400 text-white"
                  )}>
                    {post.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn(
                        "text-sm font-medium",
                        isDark ? "text-white" : "text-slate-800"
                      )}>{post.name}</span>
                      <span className={cn(
                        "text-xs",
                        isDark ? "text-slate-500" : "text-slate-400"
                      )}>{post.time}</span>
                    </div>
                    <p className={cn(
                      "text-xs line-clamp-1 leading-relaxed",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>{post.content}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs shrink-0",
                    isDark ? "text-pink-400" : "text-pink-500"
                  )}>
                    <Flame className="h-3 w-3" />
                    {post.likes}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 第三行：社区动态 */}
        <section>
          <Card className={cn(
            "",
            isDark 
              ? "bg-[#12121a] border-white/5" 
              : "bg-white border-slate-200/80 shadow-sm"
          )}>
            <div className={cn(
              "h-1",
              isDark 
                ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" 
                : "bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
            )} />
            <CardHeader className={cn(
              "pb-3",
              isDark ? "bg-gradient-to-r from-cyan-900/20 to-transparent" : "bg-gradient-to-r from-cyan-50/50 to-transparent"
            )}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-xl",
                    isDark ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20" : "bg-gradient-to-br from-cyan-100 to-blue-100"
                  )}>
                    <Users className={cn(
                      "h-4 w-4",
                      isDark ? "text-cyan-400" : "text-cyan-600"
                    )} />
                  </div>
                  <span className={cn(
                    "font-heading text-base font-bold",
                    isDark ? "text-white" : "text-slate-800"
                  )}>社区动态</span>
                </div>
                <Link 
                  href="/" 
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors group",
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-500 hover:text-indigo-600"
                  )}
                >
                  查看全部
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CreatePost />
              <PostCard 
                post={{
                  id: '1',
                  user_id: '1',
                  content: '完成了今天的 AI 学习任务，感觉收获满满！',
                  images: [],
                  likes_count: 42,
                  comments_count: 8,
                  created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                  user: { id: '1', email: 'a@test.com', nickname: '设计小能手', points: 150, created_at: '' },
                }} 
              />
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className={cn(
          "mt-16 pt-8 border-t text-center",
          isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-400"
        )}>
          <p className="text-sm">
            © 2024 NexusAI. Built with passion for AI learning.
          </p>
        </footer>
      </main>
    </div>
  );
}
