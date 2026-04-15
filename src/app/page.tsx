'use client';

import { Sparkles, BookOpen, TrendingUp, Users, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { NewsCarousel } from '@/components/home/news-carousel';
import { HotList } from '@/components/home/hot-list';
import { ArticleCard, ArticleGrid } from '@/components/home/article-card';
import { PostCard } from '@/components/home/post-card';
import { CreatePost } from '@/components/home/create-post';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Post } from '@/lib/types';

// 模拟动态数据
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: '刚刚完成了 Midjourney 的进阶课程学习，终于掌握了如何生成高质量的产品图片！感觉自己的设计效率提升了不少。有没有一起学习的朋友可以交流一下？',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: '设计小能手', points: 150, created_at: '' },
  },
  {
    id: '2',
    user_id: '2',
    content: '分享一个超好用的 AI 工具：Notion AI 真的太香了！用它来整理笔记和写文章效率直接翻倍。特别是自动续写功能，让我的写作流程顺畅了很多。',
    images: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format',
    ],
    likes_count: 128,
    comments_count: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: { id: '2', email: 'b@test.com', nickname: '效率达人', points: 280, created_at: '' },
  },
  {
    id: '3',
    user_id: '3',
    content: 'Day 3/30：今天开始学习 Prompt Engineering，Chain of Thought 这个技巧真的很实用！学会了如何让 AI 更准确地理解我的意图。',
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
          <div className="space-y-6">
            {/* Hot List */}
            <div className="animate-fade-in-up delay-200">
              <HotList />
            </div>

            {/* Articles */}
            <Card className="glass border-cyan-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between font-heading text-lg">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                    <span className="gradient-text-v2">精选文章</span>
                  </span>
                  <Link href="/resources">
                    <Button variant="ghost" size="sm" className="text-xs h-auto py-1 px-2 text-slate-400 hover:text-slate-200">
                      查看全部
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: '如何在 30 天内从零基础到熟练使用 AI 工具', views: 15600 },
                  { title: 'Claude vs GPT-4：深度对比测评', views: 12300 },
                  { title: 'Prompt Engineering 进阶技巧', views: 21000 },
                ].map((article, index) => (
                  <Link key={index} href="/resources">
                    <div className="group p-3 -mx-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-indigo-500/20">
                      <p className="text-sm font-medium text-slate-300 line-clamp-2 group-hover:text-white transition-colors">
                        {article.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {article.views.toLocaleString()} 阅读
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Daily Task CTA */}
            <Card className="border-gradient overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/20" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
              <CardContent className="relative p-6 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-white">今日任务</h3>
                <p className="text-sm text-slate-400 mb-4">
                  完成今日 AI 学习任务，获得积分奖励
                </p>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/25" asChild>
                  <Link href="/learn">
                    开始学习
                    <ChevronRight className="h-4 w-4 ml-1" />
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
