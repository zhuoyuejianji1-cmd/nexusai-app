'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Trophy, 
  Calendar, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  Star, 
  FileText, 
  Award,
  BookOpen,
  Target,
  Zap,
  Crown,
  Shield,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// 今日任务数据
const todayTasks = [
  { id: 1, title: '完成 AI 基础课程第 3 章', desc: '学习机器学习核心概念', progress: 80, xp: 50, icon: BookOpen, completed: false },
  { id: 2, title: '使用 ChatGPT 写一篇文章', desc: '练习 Prompt 技巧', progress: 100, xp: 30, xpEarned: 30, icon: FileText, completed: true },
  { id: 3, title: '阅读 AI 最新资讯', desc: '了解行业动态', progress: 60, xp: 20, icon: TrendingUp, completed: false },
];

// 学习路径
const learningPaths = [
  { 
    id: 1, 
    title: 'AI 入门', 
    desc: '零基础学习人工智能',
    progress: 65,
    courses: 8,
    completed: 5,
    icon: Target,
    gradient: 'from-emerald-500 to-teal-500',
  },
  { 
    id: 2, 
    title: 'Prompt 工程', 
    desc: '掌握 AI 对话交互技巧',
    progress: 40,
    courses: 6,
    completed: 2,
    icon: Zap,
    gradient: 'from-amber-500 to-orange-500',
  },
  { 
    id: 3, 
    title: 'AI 图像创作', 
    desc: 'Midjourney & Stable Diffusion',
    progress: 20,
    courses: 10,
    completed: 2,
    icon: Star,
    gradient: 'from-pink-500 to-rose-500',
  },
  { 
    id: 4, 
    title: 'AI 编程开发', 
    desc: 'GitHub Copilot & Claude',
    progress: 10,
    courses: 12,
    completed: 1,
    icon: Award,
    gradient: 'from-blue-500 to-indigo-500',
  },
];

// 徽章数据
const badges = [
  { id: 1, name: '初学者', desc: '完成第一个学习任务', icon: Star, color: 'from-amber-400 to-orange-400', earned: true },
  { id: 2, name: '连续7天', desc: '连续学习7天', icon: Flame, color: 'from-red-400 to-pink-400', earned: true },
  { id: 3, name: 'Prompt 大师', desc: '完成 Prompt 课程', icon: Zap, color: 'from-yellow-400 to-amber-400', earned: true },
  { id: 4, name: 'AI 探索者', desc: '探索10个 AI 工具', icon: Target, color: 'from-emerald-400 to-teal-400', earned: false },
  { id: 5, name: '图像专家', desc: '生成100张 AI 图像', icon: Star, color: 'from-purple-400 to-pink-400', earned: false },
  { id: 6, name: '学习达人', desc: '累计学习100小时', icon: Trophy, color: 'from-blue-400 to-indigo-400', earned: false },
];

// 统计数据
const stats = [
  { label: '学习天数', value: '23', icon: Calendar, color: 'text-emerald-500', bgDark: 'bg-emerald-500/20', bgLight: 'bg-emerald-100' },
  { label: '获得积分', value: '1,250', icon: Star, color: 'text-amber-500', bgDark: 'bg-amber-500/20', bgLight: 'bg-amber-100' },
  { label: '完成课程', value: '12', icon: BookOpen, color: 'text-blue-500', bgDark: 'bg-blue-500/20', bgLight: 'bg-blue-100' },
  { label: '获得徽章', value: '3/18', icon: Award, color: 'text-purple-500', bgDark: 'bg-purple-500/20', bgLight: 'bg-purple-100' },
];

export default function LearnPage() {
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
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
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
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/10 via-teal-500/8 to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 via-purple-500/8 to-transparent rounded-full blur-[100px]" />
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
              <GraduationCap className="h-5 w-5 text-white" />
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

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Banner */}
        <section className="mb-10">
          <div className={cn(
            "relative overflow-hidden rounded-3xl",
            isDark 
              ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a2a1a] border border-white/5" 
              : "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 border border-emerald-200/50"
          )}>
            {/* 装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-10 py-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-black text-white tracking-tight">
                    学习中心
                  </h1>
                  <p className="text-white/70 text-sm font-medium">
                    Learning Center · 成长路径 · 成就系统
                  </p>
                </div>
              </div>
              
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed mb-8">
                系统化学习 AI 技能，完成每日任务获得积分，解锁专属徽章。<br />
                与千万学习者一起成长，成为 AI 时代的领先者。
              </p>

              {/* 统计卡片 */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm",
                    isDark ? "bg-white/5" : "bg-white/20"
                  )}>
                    <div className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl",
                      isDark ? stat.bgDark : stat.bgLight
                    )}>
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 今日任务 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "font-heading text-xl font-bold flex items-center gap-2",
              isDark ? "text-white" : "text-slate-900"
            )}>
              <Target className={cn("h-5 w-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
              今日任务
            </h2>
            <Badge className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium",
              isDark 
                ? "bg-emerald-500/20 text-emerald-400 border-0" 
                : "bg-emerald-100 text-emerald-600 border-0"
            )}>
              <Flame className="h-3 w-3 mr-1" />
              3/5 完成
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {todayTasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "relative rounded-2xl p-5 transition-all duration-300",
                  isDark
                    ? task.completed
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-[#12121a] border border-white/5 hover:border-white/10"
                    : task.completed
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-white border border-slate-200/50 hover:border-slate-200 hover:shadow-md"
                )}
              >
                {task.completed && (
                  <div className={cn(
                    "absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center",
                    isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                  )}>
                    <Shield className={cn(
                      "h-4 w-4",
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    )} />
                  </div>
                )}
                
                <div className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-xl mb-4",
                  task.completed
                    ? isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                    : isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                )}>
                  <task.icon className={cn(
                    "h-6 w-6",
                    task.completed
                      ? isDark ? "text-emerald-400" : "text-emerald-600"
                      : isDark ? "text-indigo-400" : "text-indigo-600"
                  )} />
                </div>

                <h3 className={cn(
                  "font-semibold text-base mb-1",
                  isDark ? "text-white" : "text-slate-800"
                )}>
                  {task.title}
                </h3>
                <p className={cn(
                  "text-sm mb-4",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {task.desc}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? "text-slate-500" : "text-slate-400"}>进度</span>
                    <span className={isDark ? "text-slate-300" : "text-slate-600"}>{task.progress}%</span>
                  </div>
                  <Progress 
                    value={task.progress} 
                    className={cn(
                      "h-1.5",
                      isDark ? "bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" : ""
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-xs font-medium",
                      isDark ? "text-amber-400" : "text-amber-600"
                    )}>
                      +{task.xpEarned || task.xp} XP
                    </span>
                    <Button 
                      size="sm" 
                      className={cn(
                        "h-7 px-3 rounded-lg text-xs font-medium",
                        task.completed
                          ? isDark
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          : isDark
                            ? "bg-indigo-500 text-white hover:bg-indigo-400"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                      )}
                    >
                      {task.completed ? '已完成' : '继续学习'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 学习路径 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "font-heading text-xl font-bold flex items-center gap-2",
              isDark ? "text-white" : "text-slate-900"
            )}>
              <TrendingUp className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
              成长路径
            </h2>
            <Link 
              href="/resources"
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors group",
                isDark 
                  ? "text-slate-400 hover:text-white" 
                  : "text-slate-500 hover:text-indigo-600"
              )}
            >
              查看全部
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {learningPaths.map((path) => (
              <div 
                key={path.id}
                className={cn(
                  "relative rounded-2xl p-6 transition-all duration-300 overflow-hidden",
                  isDark
                    ? "bg-[#12121a] border border-white/5 hover:border-white/10"
                    : "bg-white border border-slate-200/50 hover:border-slate-200 hover:shadow-lg"
                )}
              >
                {/* 装饰 */}
                <div className={cn(
                  "absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-50",
                  isDark ? `bg-gradient-to-br ${path.gradient} opacity-20` : `bg-gradient-to-br ${path.gradient} opacity-10`
                )} />
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "flex items-center justify-center h-14 w-14 rounded-2xl",
                      `bg-gradient-to-br ${path.gradient}`
                    )}>
                      <path.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-lg font-bold",
                        isDark ? "text-white" : "text-slate-800"
                      )}>
                        {path.title}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}>
                        {path.desc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDark ? "text-slate-500" : "text-slate-400"}>完成度</span>
                      <span className={cn(
                        "font-semibold",
                        isDark ? "text-white" : "text-slate-700"
                      )}>{path.completed}/{path.courses} 课程</span>
                    </div>
                    <Progress 
                      value={(path.completed / path.courses) * 100} 
                      className={cn(
                        "h-2",
                        isDark ? "bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" : ""
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={cn(
                      "text-xs font-medium",
                      isDark 
                        ? "bg-white/10 text-white border-0" 
                        : "bg-slate-100 text-slate-600 border-0"
                    )}>
                      {path.progress}% 完成
                    </Badge>
                    <Button 
                      size="sm" 
                      className={cn(
                        "h-8 px-4 rounded-lg text-xs font-medium",
                        isDark
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400"
                          : "bg-indigo-500 text-white hover:bg-indigo-600"
                      )}
                    >
                      继续学习
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 徽章墙 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "font-heading text-xl font-bold flex items-center gap-2",
              isDark ? "text-white" : "text-slate-900"
            )}>
              <Award className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
              徽章墙
            </h2>
            <Badge className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium",
              isDark 
                ? "bg-amber-500/20 text-amber-400 border-0" 
                : "bg-amber-100 text-amber-600 border-0"
            )}>
              3/18 已获得
            </Badge>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300",
                  badge.earned
                    ? isDark
                      ? "bg-[#12121a] border border-white/5 hover:border-amber-500/30"
                      : "bg-white border border-slate-200/50 hover:border-amber-200 hover:shadow-lg"
                    : isDark
                      ? "bg-[#0a0a0f] border border-white/5 opacity-50"
                      : "bg-slate-50 border border-slate-200/50 opacity-50"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center h-16 w-16 rounded-2xl mb-3",
                  badge.earned
                    ? `bg-gradient-to-br ${badge.color} shadow-lg`
                    : isDark ? "bg-slate-800" : "bg-slate-200"
                )}>
                  <badge.icon className={cn(
                    "h-8 w-8",
                    badge.earned ? "text-white" : isDark ? "text-slate-600" : "text-slate-400"
                  )} />
                  {!badge.earned && (
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-2xl",
                      isDark ? "bg-slate-900/60" : "bg-white/60"
                    )}>
                      <Crown className={cn(
                        "h-6 w-6",
                        isDark ? "text-slate-600" : "text-slate-300"
                      )} />
                    </div>
                  )}
                </div>
                <h4 className={cn(
                  "text-sm font-semibold text-center mb-1",
                  badge.earned
                    ? isDark ? "text-white" : "text-slate-800"
                    : isDark ? "text-slate-500" : "text-slate-400"
                )}>
                  {badge.name}
                </h4>
                <p className={cn(
                  "text-xs text-center",
                  isDark ? "text-slate-600" : "text-slate-400"
                )}>
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

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
