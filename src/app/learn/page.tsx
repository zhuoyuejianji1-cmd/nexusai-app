'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, Clock, Trophy, CheckCircle2, 
  Circle, Lock, BookOpen, Flame, Calendar, Star,
  TrendingUp, Award, Zap, Play, ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserAvatar } from '@/components/common/user-avatar';
import { cn, formatNumber } from '@/lib/utils';
import type { Task, PathNode } from '@/lib/types';

// 模拟任务数据
const mockTodayTask: Task = {
  id: '1',
  title: '掌握 ChatGPT 提示词工程基础',
  description: '学习如何编写有效的提示词，让 ChatGPT 更好地理解你的需求并给出更准确的回答。',
  steps: [
    {
      title: '了解提示词基本结构',
      content: '一个好的提示词通常包含：角色设定、任务描述、输出格式要求、约束条件。了解这些要素如何协同工作。',
      resources: ['提示词工程指南'],
    },
    {
      title: '实践 Few-shot 学习',
      content: '通过提供少量示例，让 AI 学习你的期望输出格式。例如：输入-输出对的形式展示期望的回复风格。',
      resources: ['Few-shot 示例库'],
    },
    {
      title: '掌握 Chain of Thought',
      content: '引导 AI 分步骤思考问题，这在复杂推理任务中特别有效。学习如何在提示词中加入"请逐步思考"的指令。',
      resources: ['CoT 实战案例'],
    },
    {
      title: '完成作业：编写你的第一个专业提示词',
      content: '运用今天学到的技巧，为你的工作或学习场景编写一个专业提示词，并测试效果。',
    },
  ],
  duration: '约 45 分钟',
  points: 50,
  path_id: 2,
  created_at: '',
};

// 模拟成长路径数据
const mockPath: PathNode[] = [
  { id: 1, name: '入门', description: '了解 AI 基本概念', tasks: 5, completed: 5, status: 'completed' },
  { id: 2, name: '基础', description: '掌握 AI 工具使用', tasks: 8, completed: 6, status: 'in_progress' },
  { id: 3, name: '进阶', description: '深入 AI 原理', tasks: 10, completed: 0, status: 'available' },
  { id: 4, name: '实战', description: 'AI 项目实战', tasks: 6, completed: 0, status: 'locked' },
  { id: 5, name: '专家', description: '成为 AI 高手', tasks: 12, completed: 0, status: 'locked' },
];

// 模拟学习数据
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

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  in_progress: { icon: Circle, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  available: { icon: Circle, color: 'text-slate-500', bg: 'bg-slate-500/20' },
  locked: { icon: Lock, color: 'text-slate-600', bg: 'bg-slate-800' },
};

export default function LearnPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const progress = (completedSteps.size / mockTodayTask.steps.length) * 100;

  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl aurora-glow" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl aurora-glow-delay" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl aurora-glow" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-heading text-3xl font-bold mb-2">
            <span className="gradient-text">学习中心</span>
          </h1>
          <p className="text-slate-400">
            每日任务、成长路径，记录你的 AI 学习之旅
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Task */}
            <section className="animate-fade-in-up delay-100">
              <Card className="border-gradient overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/30" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                <CardHeader className="relative pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 font-heading text-xl text-white">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                        <Target className="h-5 w-5 text-indigo-400" />
                      </div>
                      今日任务
                    </CardTitle>
                    <Badge variant="outline" className="gap-1 border-indigo-500/50 text-indigo-400 bg-indigo-500/10">
                      <Zap className="h-3 w-3" />
                      +{mockTodayTask.points} 积分
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-2 text-white">
                      {mockTodayTask.title}
                    </h2>
                    <p className="text-slate-400">
                      {mockTodayTask.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      {mockTodayTask.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-cyan-400" />
                      {mockTodayTask.steps.length} 个步骤
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">完成进度</span>
                      <span className="font-medium text-white">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
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
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-slate-900/50 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-slate-900/70'
                        )}
                        onClick={() => toggleStep(index)}
                      >
                        <div className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                          completedSteps.has(index)
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-indigo-500/50 text-indigo-400'
                        )}>
                          {completedSteps.has(index) ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            'font-medium mb-1 text-white',
                            completedSteps.has(index) && 'line-through text-slate-500'
                          )}>
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {step.content}
                          </p>
                          {step.resources && step.resources.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {step.resources.map((resource, i) => (
                                <Badge key={i} variant="secondary" className="text-xs bg-indigo-500/20 text-indigo-300 border-0">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Complete Button */}
                  {progress === 100 && (
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 gap-2 shadow-lg shadow-emerald-500/25" size="lg">
                      <Trophy className="h-5 w-5" />
                      完成任务，获得 {mockTodayTask.points} 积分
                    </Button>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Growth Path */}
            <section className="animate-fade-in-up delay-200">
              <Card className="glass border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading text-xl text-white">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/30">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                    </div>
                    成长路径
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 right-0 h-1.5 bg-slate-800 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: '25%' }}
                      />
                    </div>

                    {/* Nodes */}
                    <div className="relative flex justify-between">
                      {mockPath.map((node) => {
                        const config = statusConfig[node.status];
                        const Icon = config.icon;

                        return (
                          <div key={node.id} className="flex flex-col items-center">
                            <div className={cn(
                              'relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all',
                              node.status === 'completed' && 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/30',
                              node.status === 'in_progress' && 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 animate-pulse',
                              node.status === 'available' && 'bg-slate-800 border-slate-600 text-slate-400',
                              node.status === 'locked' && 'bg-slate-900 border-slate-700 text-slate-600'
                            )}>
                              {node.status === 'completed' ? (
                                <CheckCircle2 className="h-7 w-7" />
                              ) : (
                                <Icon className="h-6 w-6" />
                              )}
                            </div>
                            <div className="mt-3 text-center">
                              <span className={cn(
                                'block font-medium text-white',
                                node.status === 'locked' && 'text-slate-600'
                              )}>
                                {node.name}
                              </span>
                              <span className="text-xs text-slate-500">
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
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="glass border-indigo-500/20 animate-fade-in-up delay-100">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                    <Award className="h-5 w-5 text-indigo-400" />
                  </div>
                  学习统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-xl glass border border-indigo-500/20">
                    <div className="font-heading text-2xl font-bold text-indigo-400">
                      {mockStats.totalDays}
                    </div>
                    <div className="text-xs text-slate-400">学习天数</div>
                  </div>
                  <div className="text-center p-3 rounded-xl glass border border-emerald-500/20">
                    <div className="font-heading text-2xl font-bold text-emerald-400">
                      {mockStats.completedTasks}
                    </div>
                    <div className="text-xs text-slate-400">完成任务</div>
                  </div>
                  <div className="text-center p-3 rounded-xl glass border border-cyan-500/20">
                    <div className="font-heading text-2xl font-bold text-cyan-400">
                      {formatNumber(mockStats.totalPoints)}
                    </div>
                    <div className="text-xs text-slate-400">获得积分</div>
                  </div>
                  <div className="text-center p-3 rounded-xl glass border border-amber-500/20">
                    <div className="font-heading text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Flame className="h-5 w-5" />
                      {mockStats.currentStreak}
                    </div>
                    <div className="text-xs text-slate-400">连续天数</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="glass border-amber-500/20 animate-fade-in-up delay-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30">
                    <Trophy className="h-5 w-5 text-amber-400" />
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
                          ? 'glass border border-indigo-500/20' 
                          : 'bg-slate-900/50 opacity-40'
                      )}
                    >
                      <div className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-xl',
                        badge.earned 
                          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-400' 
                          : 'bg-slate-800 text-slate-600'
                      )}>
                        <badge.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs text-center text-slate-400">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="glass border-cyan-500/20 animate-fade-in-up delay-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/30">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                  本周学习
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2 h-28">
                  {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                    const hours = mockStats.weeklyHours[index];
                    const maxHours = Math.max(...mockStats.weeklyHours);
                    const height = (hours / maxHours) * 100;
                    const isToday = index === new Date().getDay() - 1;

                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end" style={{ height: '56px' }}>
                          <div
                            className={cn(
                              'w-full rounded-t-lg transition-all',
                              isToday 
                                ? 'bg-gradient-to-t from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30' 
                                : 'bg-gradient-to-t from-slate-700 to-slate-600'
                            )}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className={cn(
                          'text-xs',
                          isToday ? 'text-indigo-400 font-medium' : 'text-slate-500'
                        )}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass border-indigo-500/20 animate-fade-in-up delay-400">
              <CardContent className="p-3 space-y-2">
                <Button variant="outline" className="w-full justify-between border-indigo-500/30 text-slate-300 hover:bg-indigo-500/10 hover:text-white" asChild>
                  <Link href="/resources">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-400" />
                      浏览资源库
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between border-amber-500/30 text-slate-300 hover:bg-amber-500/10 hover:text-white" asChild>
                  <Link href="/profile">
                    <span className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-400" />
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
