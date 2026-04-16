'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Edit3, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Trophy, 
  Calendar, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  Star, 
  FileText, 
  Award,
  Sun,
  Moon,
  ArrowLeft,
  Crown,
  Settings,
  LogOut,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PostCard } from '@/components/home/post-card';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';

// 模拟用户数据
const mockUser = {
  id: '1',
  nickname: 'AI探索者',
  email: 'user@example.com',
  avatar: null as string | null,
  is_vip: true,
  bio: '热爱 AI，专注学习新技术。希望用 AI 提升工作效率，探索无限可能。',
  points: 1250,
  joinedDays: 23,
  level: 8,
  exp: 750,
  expToNext: 1000,
};

// 统计数据
const stats = [
  { label: '动态', value: '42', icon: FileText, color: 'text-blue-500', bgDark: 'bg-blue-500/20', bgLight: 'bg-blue-100' },
  { label: '获赞', value: '328', icon: Heart, color: 'text-pink-500', bgDark: 'bg-pink-500/20', bgLight: 'bg-pink-100' },
  { label: '收藏', value: '15', icon: Bookmark, color: 'text-amber-500', bgDark: 'bg-amber-500/20', bgLight: 'bg-amber-100' },
  { label: '评论', value: '89', icon: MessageSquare, color: 'text-emerald-500', bgDark: 'bg-emerald-500/20', bgLight: 'bg-emerald-100' },
];

// 最近动态
const recentPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: '完成了今天的 AI 学习任务，感觉收获满满！特别是关于 Prompt Engineering 的部分，对工作效率提升很大。',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: 'AI探索者', points: 1250, is_vip: true, created_at: '' },
  },
  {
    id: '2',
    user_id: '1',
    content: '尝试用 Midjourney 生成了一套品牌视觉设计，效果超出预期！设计师们要开始学习 AI 工具了',
    images: [],
    likes_count: 128,
    comments_count: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: 'AI探索者', points: 1250, is_vip: true, created_at: '' },
  },
];

// 任务记录
const taskHistory = [
  { id: 1, title: '完成 AI 基础课程第 3 章', date: '2024-01-15', xp: 50, completed: true },
  { id: 2, title: '使用 ChatGPT 写一篇文章', date: '2024-01-15', xp: 30, completed: true },
  { id: 3, title: '阅读 AI 最新资讯', date: '2024-01-14', xp: 20, completed: true },
  { id: 4, title: '分享一个 AI 工具', date: '2024-01-14', xp: 40, completed: true },
];

// 已获徽章
const earnedBadges = [
  { name: '初学者', icon: Star, gradient: 'from-amber-400 to-orange-400' },
  { name: '连续7天', icon: Flame, gradient: 'from-red-400 to-pink-400' },
  { name: 'Prompt 大师', icon: Zap, gradient: 'from-yellow-400 to-amber-400' },
  { name: '分享达人', icon: Award, gradient: 'from-purple-400 to-pink-400' },
];

export default function ProfilePage() {
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
      {/* 背景装饰 */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/10 via-rose-500/8 to-transparent rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      )}

      {/* 导航栏 */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isDark 
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-white/80 backdrop-blur-xl border-b border-slate-200/80"
      )}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
              isDark 
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20" 
                : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/10"
            )}>
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              "font-heading text-xl font-bold tracking-tight",
              isDark 
                ? "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent" 
                : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            )}>
              NexusAI
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-200",
                isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
              )}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-200",
                isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
              )}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className={cn(
                "gap-2 h-10 px-4 rounded-xl font-medium",
                isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              )}>
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* 用户信息卡片 */}
        <section className="mb-10">
          <Card className={cn(
            "overflow-hidden",
            isDark 
              ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-white/5" 
              : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-indigo-200/50"
          )}>
            {/* 装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>
            
            <CardContent className="relative px-10 py-10">
              <div className="flex items-start gap-8">
                {/* 头像 */}
                <div className="relative">
                  <div className={cn(
                    "flex items-center justify-center h-28 w-28 rounded-2xl text-3xl font-bold shadow-2xl",
                    isDark 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
                      : "bg-gradient-to-br from-indigo-400 to-purple-400 text-white"
                  )}>
                    {mockUser.nickname[0].toUpperCase()}
                  </div>
                  {mockUser.is_vip && (
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* 用户信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-heading text-2xl font-bold text-white">
                      {mockUser.nickname}
                    </h1>
                    {mockUser.is_vip && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                        VIP
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/70 text-sm mb-4 max-w-md">
                    {mockUser.bio}
                  </p>
                  
                  {/* 等级进度 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        isDark ? "bg-white/20 text-white" : "bg-white/30 text-white"
                      )}>
                        Lv.{mockUser.level}
                      </Badge>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>经验值</span>
                        <span>{mockUser.exp}/{mockUser.expToNext}</span>
                      </div>
                      <div className={cn(
                        "h-2 rounded-full overflow-hidden",
                        isDark ? "bg-white/10" : "bg-white/20"
                      )}>
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${(mockUser.exp / mockUser.expToNext) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-full",
                      isDark ? "bg-white/10" : "bg-white/20"
                    )}>
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-white">{mockUser.points}</span>
                    </div>
                  </div>

                  {/* 统计 */}
                  <div className="flex items-center gap-6">
                    {stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className={cn(
                          "flex items-center justify-center h-8 w-8 rounded-lg mb-1 mx-auto",
                          isDark ? stat.bgDark : stat.bgLight
                        )}>
                          <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </div>
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col gap-2">
                  <Button className={cn(
                    "h-10 px-5 rounded-xl font-medium",
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-white/20 hover:bg-white/30 text-white border border-white/20"
                  )}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    编辑资料
                  </Button>
                  <Button className={cn(
                    "h-10 px-5 rounded-xl font-medium text-red-400",
                    isDark
                      ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                      : "bg-red-50 hover:bg-red-100 border border-red-100"
                  )}>
                    <LogOut className="h-4 w-4 mr-2" />
                    退出登录
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-3 gap-6">
          {/* 左侧：动态 */}
          <div className="col-span-2 space-y-6">
            {/* 我的动态 */}
            <Card className={cn(
              "",
              isDark 
                ? "bg-[#12121a] border-white/5" 
                : "bg-white border-slate-200/80 shadow-sm"
            )}>
              <div className={cn(
                "h-1",
                isDark 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                  : "bg-gradient-to-r from-blue-400 to-cyan-400"
              )} />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-xl",
                      isDark ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20" : "bg-gradient-to-br from-blue-100 to-cyan-100"
                    )}>
                      <FileText className={cn(
                        "h-4 w-4",
                        isDark ? "text-blue-400" : "text-blue-600"
                      )} />
                    </div>
                    <span className={cn(
                      "font-heading text-base font-bold",
                      isDark ? "text-white" : "text-slate-800"
                    )}>我的动态</span>
                  </div>
                  <Badge className={cn(
                    "text-xs font-medium",
                    isDark 
                      ? "bg-blue-500/20 text-blue-400 border-0" 
                      : "bg-blue-100 text-blue-600 border-0"
                  )}>
                    42 条
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：任务 + 徽章 */}
          <div className="space-y-6">
            {/* 任务记录 */}
            <Card className={cn(
              "",
              isDark 
                ? "bg-[#12121a] border-white/5" 
                : "bg-white border-slate-200/80 shadow-sm"
            )}>
              <div className={cn(
                "h-1",
                isDark 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              )} />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-xl",
                      isDark ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20" : "bg-gradient-to-br from-emerald-100 to-teal-100"
                    )}>
                      <Target className={cn(
                        "h-4 w-4",
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      )} />
                    </div>
                    <span className={cn(
                      "font-heading text-base font-bold",
                      isDark ? "text-white" : "text-slate-800"
                    )}>任务记录</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {taskHistory.map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 py-2 px-3 rounded-xl transition-all",
                      isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-lg shrink-0",
                      isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                    )}>
                      <BookOpen className={cn(
                        "h-4 w-4",
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        isDark ? "text-white" : "text-slate-700"
                      )}>
                        {task.title}
                      </p>
                      <p className={cn(
                        "text-xs",
                        isDark ? "text-slate-500" : "text-slate-400"
                      )}>
                        {task.date}
                      </p>
                    </div>
                    <Badge className={cn(
                      "text-xs font-medium",
                      isDark 
                        ? "bg-amber-500/20 text-amber-400 border-0" 
                        : "bg-amber-100 text-amber-600 border-0"
                    )}>
                      +{task.xp} XP
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 徽章展示 */}
            <Card className={cn(
              "",
              isDark 
                ? "bg-[#12121a] border-white/5" 
                : "bg-white border-slate-200/80 shadow-sm"
            )}>
              <div className={cn(
                "h-1",
                isDark 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                  : "bg-gradient-to-r from-amber-400 to-orange-400"
              )} />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-xl",
                      isDark ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" : "bg-gradient-to-br from-amber-100 to-orange-100"
                    )}>
                      <Award className={cn(
                        "h-4 w-4",
                        isDark ? "text-amber-400" : "text-amber-600"
                      )} />
                    </div>
                    <span className={cn(
                      "font-heading text-base font-bold",
                      isDark ? "text-white" : "text-slate-800"
                    )}>我的徽章</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {earnedBadges.map((badge, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "flex flex-col items-center p-3 rounded-xl transition-all",
                        isDark 
                          ? "bg-[#0a0a0f] hover:bg-white/5" 
                          : "bg-slate-50 hover:bg-slate-100"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center h-12 w-12 rounded-xl mb-2",
                        `bg-gradient-to-br ${badge.gradient}`
                      )}>
                        <badge.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className={cn(
                        "text-xs font-medium text-center",
                        isDark ? "text-white" : "text-slate-700"
                      )}>
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className={cn(
          "mt-20 pt-8 border-t text-center",
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
