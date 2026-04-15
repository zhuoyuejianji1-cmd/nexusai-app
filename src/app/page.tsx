'use client';

import { Sparkles, BookOpen, TrendingUp, Users, Zap, ChevronRight, MessageSquare, Code, Image, Video, FileText, Hash, Clock, Flame, Target } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { NewsCarousel } from '@/components/home/news-carousel';
import { HotList } from '@/components/home/hot-list';
import { PostCard } from '@/components/home/post-card';
import { CreatePost } from '@/components/home/create-post';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  { tag: '大模型', posts: 867 },
  { tag: 'AI Agent', posts: 654 },
];

// 学习小贴士
const tips = [
  { icon: '💡', text: '使用 CoT 提示词可以让 AI 的推理更准确' },
  { icon: '⚡', text: 'Few-shot 示例能显著提升输出质量' },
  { icon: '🎯', text: '明确的任务描述可以获得更好的结果' },
];

// 活跃用户
const activeUsers = [
  { name: 'AI探险家', tasks: 45, avatar: 'A', streak: 12 },
  { name: '技术小能手', tasks: 38, avatar: 'T', streak: 8 },
  { name: '学习达人', tasks: 32, avatar: 'L', streak: 6 },
  { name: '效率专家', tasks: 28, avatar: 'E', streak: 5 },
  { name: 'AI爱好者', tasks: 24, avatar: 'H', streak: 4 },
];

// 推荐资源
const recommendedResources = [
  { title: 'ChatGPT 官方指南', category: '教程', likes: 2340 },
  { title: 'Claude 使用技巧', category: '教程', likes: 1890 },
  { title: 'Midjourney 进阶', category: '视频', likes: 1560 },
  { title: 'Prompt 工程实战', category: '教程', likes: 1230 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl aurora-glow" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl aurora-glow-delay" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl aurora-glow" />
        
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
          <NewsCarousel />
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left: Main Feed - 3 columns */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quick Actions Bar */}
            <div className="grid grid-cols-4 gap-3 animate-fade-in-up delay-100">
              <Link href="/learn">
                <Card className="glass hover-lift cursor-pointer h-full group border-indigo-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">今日任务</span>
                      <p className="text-xs text-slate-500">开始学习</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/resources">
                <Card className="glass hover-lift cursor-pointer h-full group border-cyan-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">资源库</span>
                      <p className="text-xs text-slate-500">浏览资源</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/">
                <Card className="glass hover-lift cursor-pointer h-full group border-emerald-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30">
                      <Users className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">社区</span>
                      <p className="text-xs text-slate-500">参与讨论</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card className="glass border-amber-500/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-amber-400" /> 7天
                    </span>
                    <p className="text-xs text-slate-500">连续学习</p>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs" asChild>
                  <Link href="/">查看全部</Link>
                </Button>
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
                  加载更多动态
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Sidebar - 1 column */}
          <div className="space-y-5">
            {/* 今日任务卡片 */}
            <Card className="border-gradient overflow-hidden relative group animate-fade-in-up delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-purple-900/50" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
              <CardContent className="relative p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                    <Target className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-indigo-400">今日任务</span>
                </div>
                <h3 className="font-heading font-bold text-white mb-2">掌握 ChatGPT 提示词工程</h3>
                <p className="text-xs text-slate-400 mb-3">学习编写有效的提示词技巧</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">进度</span>
                    <span className="text-white">2/4 步骤</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                  </div>
                </div>
                <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" asChild>
                  <Link href="/learn">继续学习</Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI 热榜 */}
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
                          index < 3 && 'bg-pink-500/20 text-pink-400 border-pink-400'
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

            {/* 推荐资源 */}
            <Card className="glass border-cyan-500/20 animate-fade-in-up delay-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-white">推荐资源</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommendedResources.map((res, index) => (
                  <Link key={index} href="/resources">
                    <div className="group p-2.5 -mx-2.5 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-cyan-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300 group-hover:text-white line-clamp-1">
                          {res.title}
                        </span>
                        <Badge variant="secondary" className="text-xs shrink-0 ml-2 bg-cyan-500/10 text-cyan-400 border-0">
                          {res.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{res.likes.toLocaleString()} 收藏</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* 学习小贴士 */}
            <Card className="glass border-amber-500/20 animate-fade-in-up delay-400">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-white">学习小贴士</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-amber-500/10">
                    <span className="text-lg shrink-0">{tip.icon}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 活跃用户排行 */}
            <Card className="glass border-emerald-500/20 animate-fade-in-up delay-400">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/30">
                    <Users className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-white">活跃学习者</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/5 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white',
                        index === 0 && 'bg-gradient-to-br from-amber-500 to-orange-500',
                        index === 1 && 'bg-gradient-to-br from-slate-400 to-slate-500',
                        index === 2 && 'bg-gradient-to-br from-orange-600 to-orange-700',
                        index >= 3 && 'bg-gradient-to-br from-emerald-500 to-teal-500'
                      )}>
                        {user.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-slate-300">{user.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-400">{user.tasks} 任务</span>
                      <p className="text-[10px] text-slate-500 flex items-center justify-end gap-0.5">
                        <Flame className="h-2.5 w-2.5 text-amber-400" />
                        {user.streak}天
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 社区统计 */}
            <Card className="glass border-indigo-500/20 animate-fade-in-up delay-400">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-white mb-3">社区数据</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="font-heading text-xl font-bold text-indigo-400">1,284</div>
                    <div className="text-xs text-slate-500">在线用户</div>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-heading text-xl font-bold text-emerald-400">8,920</div>
                    <div className="text-xs text-slate-500">总任务数</div>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="font-heading text-xl font-bold text-cyan-400">3,456</div>
                    <div className="text-xs text-slate-500">精选资源</div>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="font-heading text-xl font-bold text-amber-400">12.5k</div>
                    <div className="text-xs text-slate-500">社区动态</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
