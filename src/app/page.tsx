'use client';

import { Sparkles, BookOpen, TrendingUp, Users, Zap, ChevronRight, MessageSquare, Code, Image, Video, FileText, Hash } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { NewsCarousel } from '@/components/home/news-carousel';
import { HotList } from '@/components/home/hot-list';
import { PostCard } from '@/components/home/post-card';
import { CreatePost } from '@/components/home/create-post';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';

// 模拟动态数据
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: '刚刚完成了 Midjourney 的进阶课程学习，终于掌握了如何生成高质量的产品图片！感觉自己的设计效率提升了不少。',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: '设计小能手', points: 150, created_at: '' },
  },
  {
    id: '2',
    user_id: '2',
    content: '分享一个超好用的 AI 工具：Notion AI 真的太香了！用它来整理笔记和写文章效率直接翻倍。',
    images: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format'],
    likes_count: 128,
    comments_count: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: { id: '2', email: 'b@test.com', nickname: '效率达人', points: 280, created_at: '' },
  },
  {
    id: '3',
    user_id: '3',
    content: 'Day 3/30：今天开始学习 Prompt Engineering，Chain of Thought 这个技巧真的很实用！',
    images: [],
    likes_count: 35,
    comments_count: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: { id: '3', email: 'c@test.com', nickname: 'AI学习者', points: 75, created_at: '' },
  },
];

const quickActions = [
  { icon: BookOpen, label: '今日任务', href: '/learn', color: 'text-indigo-400' },
  { icon: TrendingUp, label: '热榜', href: '/resources', color: 'text-cyan-400' },
  { icon: Users, label: '社区', href: '/', color: 'text-emerald-400' },
  { icon: Zap, label: '新资源', href: '/resources', color: 'text-amber-400' },
];

// AI 工具分类
const toolCategories = [
  { icon: MessageSquare, label: 'AI对话', count: '2.4k', color: 'from-indigo-500 to-blue-500' },
  { icon: Image, label: 'AI图像', count: '1.8k', color: 'from-pink-500 to-purple-500' },
  { icon: Code, label: '编程工具', count: '1.2k', color: 'from-emerald-500 to-teal-500' },
  { icon: Video, label: 'AI视频', count: '890', color: 'from-orange-500 to-red-500' },
  { icon: FileText, label: '文档处理', count: '756', color: 'from-cyan-500 to-blue-500' },
];

// 热门话题
const hotTopics = [
  { tag: 'ChatGPT-5', posts: 2340 },
  { tag: 'Claude3.5', posts: 1890 },
  { tag: 'AI编程', posts: 1560 },
  { tag: 'AI绘图', posts: 1230 },
  { tag: 'Prompt工程', posts: 980 },
];

// 学习小贴士
const tips = [
  { icon: '💡', text: '使用 CoT 提示词可以让 AI 的推理更准确' },
  { icon: '⚡', text: 'Few-shot 示例能显著提升输出质量' },
  { icon: '🎯', text: '明确的任务描述可以获得更好的结果' },
];

// 活跃用户
const activeUsers = [
  { name: 'AI探险家', tasks: 45, avatar: 'A' },
  { name: '技术小能手', tasks: 38, avatar: 'T' },
  { name: '学习达人', tasks: 32, avatar: 'L' },
  { name: '效率专家', tasks: 28, avatar: 'E' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl aurora-glow" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl aurora-glow-delay" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl aurora-glow" />
        
        {/* 漂浮光点 */}
        <div className="star" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
        <div className="star" style={{ top: '25%', left: '85%', animationDelay: '1s' }} />
        <div className="star" style={{ top: '60%', left: '5%', animationDelay: '2s' }} />
        <div className="star" style={{ top: '75%', left: '90%', animationDelay: '0.5s' }} />
        <div className="star" style={{ top: '40%', left: '95%', animationDelay: '1.5s' }} />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-6">
            {/* News Carousel */}
            <div className="flex-1">
              <NewsCarousel />
            </div>
            
            {/* Quick Actions */}
            <div className="w-full md:w-64 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Card className="glass hover-lift cursor-pointer h-full group">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                          <action.icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <span className="text-sm font-medium text-slate-300">{action.label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Stats */}
              <Card className="glass-strong border-indigo-500/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">在线学习者</span>
                    <span className="font-heading font-bold text-emerald-400">1,284</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">今日完成任务</span>
                    <span className="font-heading font-bold text-indigo-400">356</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">社区动态</span>
                    <span className="font-heading font-bold text-cyan-400">892</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="animate-fade-in-up delay-100">
              <CreatePost />
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <span className="gradient-text-v2">社区动态</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                {mockPosts.map((post, index) => (
                  <div key={post.id} className={`animate-fade-in-up delay-${(index + 2) * 100}`}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full glass border-indigo-500/30 hover:bg-indigo-500/10" asChild>
                <Link href="/">
                  查看更多
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Hot List */}
            <div className="animate-fade-in-up delay-200">
              <HotList />
            </div>

            {/* AI 工具分类 */}
            <Card className="glass border-purple-500/20 animate-fade-in-up delay-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                    <Zap className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-white">AI 工具分类</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {toolCategories.map((cat, index) => (
                  <Link key={index} href="/resources">
                    <div className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-purple-500/20">
                      <div className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                        cat.color
                      )}>
                        <cat.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                          {cat.label}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                        {cat.count}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* 热门话题 */}
            <Card className="glass border-pink-500/20 animate-fade-in-up delay-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500/30 to-rose-500/30">
                    <Hash className="h-4 w-4 text-pink-400" />
                  </div>
                  <span className="text-white">热门话题</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotTopics.map((topic, index) => (
                    <Link key={index} href="/resources">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'cursor-pointer transition-all hover:bg-pink-500/20 border-pink-500/30',
                          index === 0 && 'bg-pink-500/20 text-pink-400 border-pink-400'
                        )}
                      >
                        #{topic.tag}
                        <span className="ml-1.5 text-xs opacity-60">{topic.posts}</span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 学习小贴士 */}
            <Card className="glass border-amber-500/20 animate-fade-in-up delay-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-white">学习小贴士</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-amber-500/10">
                    <span className="text-xl">{tip.icon}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 活跃用户 */}
            <Card className="glass border-emerald-500/20 animate-fade-in-up delay-400">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between font-heading text-base">
                  <span className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/30">
                      <Users className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-white">活跃学习者</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/5 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">
                        {user.avatar}
                      </div>
                      {index < 3 && (
                        <div className={cn(
                          'absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold',
                          index === 0 && 'bg-amber-400 text-black',
                          index === 1 && 'bg-slate-300 text-black',
                          index === 2 && 'bg-orange-400 text-white'
                        )}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-slate-300">{user.name}</span>
                    </div>
                    <span className="text-xs text-emerald-400">{user.tasks} 任务</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Task CTA */}
            <Card className="border-gradient overflow-hidden relative group hover:shadow-2xl transition-all duration-500 animate-fade-in-up delay-400">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/20" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
              <CardContent className="relative p-5 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-1 text-white">今日任务</h3>
                <p className="text-xs text-slate-400 mb-3">
                  掌握 ChatGPT 提示词工程基础
                </p>
                <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25" asChild>
                  <Link href="/learn">
                    开始学习
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
