'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, Clock, Trophy, CheckCircle2, 
  Circle, Lock, BookOpen, Flame, Calendar, Star,
  TrendingUp, Award, Zap, ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn, formatNumber } from '@/lib/utils';
import type { Task, PathNode } from '@/lib/types';

// 模拟任务数据
const mockTodayTask: Task = {
  id: '1',
  title: '掌握 ChatGPT 提示词工程基础',
  description: '学习如何编写有效的提示词，让 ChatGPT 更好地理解你的需求并给出更准确的回答。',
  steps: [
    { title: '了解提示词基本结构', content: '一个好的提示词通常包含：角色设定、任务描述、输出格式要求、约束条件。', resources: ['提示词工程指南'] },
    { title: '实践 Few-shot 学习', content: '通过提供少量示例，让 AI 学习你的期望输出格式。', resources: ['Few-shot 示例库'] },
    { title: '掌握 Chain of Thought', content: '引导 AI 分步骤思考问题，这在复杂推理任务中特别有效。', resources: ['CoT 实战案例'] },
    { title: '完成作业：编写你的第一个专业提示词', content: '运用今天学到的技巧，为你的工作或学习场景编写一个专业提示词。' },
  ],
  duration: '约 45 分钟',
  points: 50,
  path_id: 2,
  created_at: '',
};

const mockPath: PathNode[] = [
  { id: 1, name: '入门', description: '了解 AI 基本概念', tasks: 5, completed: 5, status: 'completed' },
  { id: 2, name: '基础', description: '掌握 AI 工具使用', tasks: 8, completed: 6, status: 'in_progress' },
  { id: 3, name: '进阶', description: '深入 AI 原理', tasks: 10, completed: 0, status: 'available' },
  { id: 4, name: '实战', description: 'AI 项目实战', tasks: 6, completed: 0, status: 'locked' },
  { id: 5, name: '专家', description: '成为 AI 高手', tasks: 12, completed: 0, status: 'locked' },
];

const mockStats = {
  totalDays: 23,
  completedTasks: 45,
  totalPoints: 1250,
  currentStreak: 7,
  weeklyHours: [2.5, 3.2, 1.8, 4.1, 2.9, 3.5, 2.1],
  badges: [
    { name: '初学者', icon: Star, earned: true },
    { name: '连续7天', icon: Flame, earned: true },
    { name: '完成10任务', icon: Trophy, earned: true },
    { name: '进阶者', icon: TrendingUp, earned: true },
    { name: '专家', icon: Award, earned: false },
  ],
};

export default function LearnPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 监听主题变化
  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const progress = (completedSteps.size / mockTodayTask.steps.length) * 100;

  return (
    <div className={cn(
      "min-h-screen relative",
      isDark ? "gradient-bg tech-grid" : "bg-gradient-to-br from-slate-50 via-white to-indigo-50"
    )}>
      {/* 背景光效 - 仅深色 */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
      )}
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={cn(
            "font-heading text-3xl font-bold mb-2",
            isDark ? "gradient-text" : "text-indigo-600"
          )}>
            学习中心
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-500"}>
            每日任务、成长路径，记录你的 AI 学习之旅
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Task */}
            <Card className={cn(
              "overflow-hidden",
              isDark ? "border-gradient bg-slate-900/80" : "bg-white border-slate-200 shadow-sm"
            )}>
              <CardHeader className={cn(
                "pb-2",
                isDark ? "bg-gradient-to-r from-indigo-900/50 to-purple-900/50" : "bg-indigo-50"
              )}>
                <div className="flex items-center justify-between">
                  <CardTitle className={cn(
                    "flex items-center gap-2 font-heading text-xl",
                    isDark ? "text-white" : "text-slate-800"
                  )}>
                    <div className={cn(
                      "p-2 rounded-xl",
                      isDark ? "bg-indigo-500/30" : "bg-indigo-100"
                    )}>
                      <Target className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
                    </div>
                    今日任务
                  </CardTitle>
                  <Badge className={cn(
                    "gap-1",
                    isDark ? "bg-amber-500/20 text-amber-400 border-0" : "bg-amber-100 text-amber-600 border-0"
                  )}>
                    <Zap className="h-3 w-3" />
                    +{mockTodayTask.points} 积分
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className={cn(
                    "font-heading text-2xl font-bold mb-2",
                    isDark ? "text-white" : "text-slate-800"
                  )}>
                    {mockTodayTask.title}
                  </h2>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                    {mockTodayTask.description}
                  </p>
                </div>

                <div className={cn(
                  "flex items-center gap-4 text-sm",
                  isDark ? "text-slate-500" : "text-slate-400"
                )}>
                  <span className="flex items-center gap-1">
                    <Clock className={cn("h-4 w-4", isDark ? "text-indigo-400" : "text-indigo-500")} />
                    {mockTodayTask.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className={cn("h-4 w-4", isDark ? "text-cyan-400" : "text-cyan-500")} />
                    {mockTodayTask.steps.length} 个步骤
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2 pt-2">
                  <div className={cn(
                    "flex items-center justify-between text-sm",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    <span>完成进度</span>
                    <span className={cn(
                      "font-medium",
                      isDark ? "text-white" : "text-slate-800"
                    )}>{Math.round(progress)}%</span>
                  </div>
                  <div className={cn(
                    "h-2 rounded-full overflow-hidden",
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  )}>
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-3 pt-4">
                  {mockTodayTask.steps.map((step, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex gap-3 p-4 rounded-xl border transition-all cursor-pointer',
                        completedSteps.has(index)
                          ? isDark
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-emerald-50 border-emerald-200'
                          : isDark
                            ? 'bg-slate-800/50 border-indigo-500/20 hover:border-indigo-500/40'
                            : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                      )}
                      onClick={() => toggleStep(index)}
                    >
                      <div className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                        completedSteps.has(index)
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isDark
                            ? 'border-indigo-500/50 text-indigo-400'
                            : 'border-indigo-400 text-indigo-500'
                      )}>
                        {completedSteps.has(index) ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          'font-medium mb-1',
                          completedSteps.has(index)
                            ? isDark ? 'line-through text-slate-500' : 'line-through text-slate-400'
                            : isDark ? 'text-white' : 'text-slate-800'
                        )}>
                          {step.title}
                        </h3>
                        <p className={cn(
                          "text-sm line-clamp-2",
                          isDark ? "text-slate-400" : "text-slate-500"
                        )}>
                          {step.content}
                        </p>
                        {step.resources && (
                          <div className="flex items-center gap-2 mt-2">
                            {step.resources.map((resource, i) => (
                              <Badge key={i} className={cn(
                                "text-xs",
                                isDark ? "bg-indigo-500/20 text-indigo-300 border-0" : "bg-indigo-100 text-indigo-600 border-0"
                              )}>
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {progress === 100 && (
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 gap-2">
                    <Trophy className="h-5 w-5" />
                    完成任务，获得 {mockTodayTask.points} 积分
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Growth Path */}
            <Card className={cn(
              "",
              isDark ? "glass border-cyan-500/20" : "bg-white border-slate-200 shadow-sm"
            )}>
              <CardHeader>
                <CardTitle className={cn(
                  "flex items-center gap-2 font-heading text-xl",
                  isDark ? "text-white" : "text-slate-800"
                )}>
                  <div className={cn(
                    "p-2 rounded-xl",
                    isDark ? "bg-cyan-500/20" : "bg-cyan-100"
                  )}>
                    <TrendingUp className={cn("h-5 w-5", isDark ? "text-cyan-400" : "text-cyan-600")} />
                  </div>
                  成长路径
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className={cn(
                    "absolute top-6 left-0 right-0 h-1.5 rounded-full",
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  )}>
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500 rounded-full"
                      style={{ width: '25%' }}
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {mockPath.map((node) => {
                      const statusStyle = {
                        completed: isDark ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-500 text-white border-emerald-500',
                        in_progress: isDark ? 'bg-indigo-500 text-white border-indigo-500 animate-pulse' : 'bg-indigo-500 text-white border-indigo-500',
                        available: isDark ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-slate-100 text-slate-500 border-slate-200',
                        locked: isDark ? 'bg-slate-800 text-slate-600 border-slate-700' : 'bg-slate-200 text-slate-400 border-slate-300',
                      };
                      return (
                        <div key={node.id} className="flex flex-col items-center">
                          <div className={cn(
                            'relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2',
                            statusStyle[node.status]
                          )}>
                            {node.status === 'completed' ? (
                              <CheckCircle2 className="h-7 w-7" />
                            ) : (
                              <span className="text-xs font-bold">
                                {node.status === 'locked' ? '🔒' : node.id}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 text-center">
                            <span className={cn(
                              "block font-medium",
                              isDark ? (node.status === 'locked' ? 'text-slate-600' : 'text-white') : (node.status === 'locked' ? 'text-slate-400' : 'text-slate-800')
                            )}>
                              {node.name}
                            </span>
                            <span className={cn(
                              "text-xs",
                              isDark ? "text-slate-500" : "text-slate-400"
                            )}>
                              {node.completed}/{node.tasks}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className={cn(
              "",
              isDark ? "glass border-indigo-500/20" : "bg-white border-slate-200 shadow-sm"
            )}>
              <CardHeader className="pb-4">
                <CardTitle className={cn(
                  "flex items-center gap-2 font-heading text-lg",
                  isDark ? "text-white" : "text-slate-800"
                )}>
                  <div className={cn(
                    "p-2 rounded-xl",
                    isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                  )}>
                    <Award className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
                  </div>
                  学习统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '学习天数', value: mockStats.totalDays, color: isDark ? 'text-indigo-400' : 'text-indigo-600', border: isDark ? 'border-indigo-500/20' : 'border-indigo-200' },
                    { label: '完成任务', value: mockStats.completedTasks, color: isDark ? 'text-emerald-400' : 'text-emerald-600', border: isDark ? 'border-emerald-500/20' : 'border-emerald-200' },
                    { label: '获得积分', value: formatNumber(mockStats.totalPoints), color: isDark ? 'text-cyan-400' : 'text-cyan-600', border: isDark ? 'border-cyan-500/20' : 'border-cyan-200' },
                    { label: '连续天数', value: mockStats.currentStreak, color: isDark ? 'text-amber-400' : 'text-amber-600', border: isDark ? 'border-amber-500/20' : 'border-amber-200' },
                  ].map((stat, i) => (
                    <div key={i} className={cn(
                      "text-center p-3 rounded-xl border",
                      isDark ? "bg-slate-800/50" : "bg-slate-50",
                      stat.border
                    )}>
                      <div className={cn("font-heading text-2xl font-bold", stat.color)}>
                        {stat.value}
                      </div>
                      <div className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className={cn(
              "",
              isDark ? "glass border-amber-500/20" : "bg-white border-slate-200 shadow-sm"
            )}>
              <CardHeader className="pb-4">
                <CardTitle className={cn(
                  "flex items-center gap-2 font-heading text-lg",
                  isDark ? "text-white" : "text-slate-800"
                )}>
                  <div className={cn(
                    "p-2 rounded-xl",
                    isDark ? "bg-amber-500/20" : "bg-amber-100"
                  )}>
                    <Trophy className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
                  </div>
                  徽章墙
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {mockStats.badges.map((badge, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                        badge.earned
                          ? isDark ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'
                          : isDark ? 'opacity-40' : 'opacity-50'
                      )}
                    >
                      <div className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-xl',
                        badge.earned
                          ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                          : isDark ? 'bg-slate-200 text-slate-500' : 'bg-slate-200 text-slate-400'
                      )}>
                        <badge.icon className="h-5 w-5" />
                      </div>
                      <span className={cn("text-xs text-center", isDark ? "text-slate-400" : "text-slate-500")}>
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={cn(
              "",
              isDark ? "glass border-indigo-500/20" : "bg-white border-slate-200 shadow-sm"
            )}>
              <CardContent className="p-3 space-y-2">
                <Button variant="outline" className={cn(
                  "w-full justify-between",
                  isDark
                    ? "border-indigo-500/30 text-slate-300 hover:bg-indigo-500/10"
                    : "border-indigo-200 text-slate-700 hover:bg-indigo-50"
                )} asChild>
                  <Link href="/resources">
                    <span className="flex items-center gap-2">
                      <BookOpen className={cn("h-4 w-4", isDark ? "text-indigo-400" : "text-indigo-500")} />
                      浏览资源库
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className={cn(
                  "w-full justify-between",
                  isDark
                    ? "border-amber-500/30 text-slate-300 hover:bg-amber-500/10"
                    : "border-amber-200 text-slate-700 hover:bg-amber-50"
                )} asChild>
                  <Link href="/profile">
                    <span className="flex items-center gap-2">
                      <Trophy className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-500")} />
                      我的成就
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
