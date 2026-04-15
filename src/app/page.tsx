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
  { icon: BookOpen, label: '今日任务', href: '/learn', color: 'text-primary' },
  { icon: TrendingUp, label: '热榜', href: '/resources', color: 'text-accent' },
  { icon: Users, label: '社区', href: '/', color: 'text-success' },
  { icon: Zap, label: '新资源', href: '/resources', color: 'text-warning' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
                    <Card className="bg-card/50 border-border/50 hover-lift cursor-pointer h-full">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                        <span className="text-sm font-medium">{action.label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Stats */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">在线学习者</span>
                    <span className="font-heading font-bold text-success">1,284</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">今日完成任务</span>
                    <span className="font-heading font-bold text-primary">356</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">社区动态</span>
                    <span className="font-heading font-bold text-accent">892</span>
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
                  <Sparkles className="h-5 w-5 text-primary" />
                  社区动态
                </h2>
              </div>
              
              <div className="space-y-4">
                {mockPosts.map((post, index) => (
                  <div key={post.id} className={`animate-fade-in-up delay-${(index + 2) * 100}`}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" asChild>
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
            <Card className="bg-card/50 border-border/50 glow-accent">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between font-heading text-lg">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    精选文章
                  </span>
                  <Link href="/resources">
                    <Button variant="ghost" size="sm" className="text-xs h-auto py-1 px-2">
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
                    <div className="group p-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {article.views.toLocaleString()} 阅读
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Daily Task CTA */}
            <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <CardContent className="relative p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">今日任务</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  完成今日 AI 学习任务，获得积分奖励
                </p>
                <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
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
