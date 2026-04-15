'use client';

import { Sparkles, BookOpen, TrendingUp, Users, Zap, ChevronRight, MessageSquare, Code, Image, Video, FileText, Hash, Flame, Target, Clock, Star, ArrowUp, Eye } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { NewsCarousel } from '@/components/home/news-carousel';
import { PostCard } from '@/components/home/post-card';
import { CreatePost } from '@/components/home/create-post';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  { icon: MessageSquare, label: 'AI对话', count: '2.4k', color: 'from-indigo-500 to-blue-500', desc: 'ChatGPT、Claude' },
  { icon: Image, label: 'AI图像', count: '1.8k', color: 'from-pink-500 to-purple-500', desc: 'Midjourney、SD' },
  { icon: Code, label: 'AI编程', count: '1.2k', color: 'from-emerald-500 to-teal-500', desc: 'Copilot、Cursor' },
  { icon: Video, label: 'AI视频', count: '890', color: 'from-orange-500 to-red-500', desc: 'Sora、Runway' },
  { icon: FileText, label: '文档处理', count: '756', color: 'from-cyan-500 to-blue-500', desc: 'Notion AI、Ghost' },
];

// AI 热榜
const hotListItems = [
  { rank: 1, title: 'GPT-5 正式发布：OpenAI 开启新一代多模态时代', heat: 98600, category: '大模型', isHot: true },
  { rank: 2, title: 'Claude 3.5 超越 GPT-4 成为编程最强助手', heat: 87500, category: '大模型', isHot: true },
  { rank: 3, title: '开源模型 Llama 4 发布：性能直逼闭源', heat: 76200, category: '开源' },
  { rank: 4, title: 'AI Agent 落地应用：AutoGPT 成为焦点', heat: 65400, category: 'Agent', isNew: true },
  { rank: 5, title: 'Midjourney V7 发布：细节控制更精准', heat: 54300, category: '图像' },
  { rank: 6, title: 'GitHub Copilot X 新功能解析', heat: 43200, category: '编程' },
  { rank: 7, title: '国产大模型新进展：Kimi 3 来了', heat: 32100, category: '大模型' },
  { rank: 8, title: 'AI 视频生成：Sora 正式开放API', heat: 28700, category: '视频', isNew: true },
  { rank: 9, title: 'Prompt Engineering 最佳实践指南', heat: 25400, category: '教程' },
  { rank: 10, title: '2024 AI 领域五大趋势预测', heat: 21300, category: '观点' },
];

// 精选文章
const featuredArticles = [
  { 
    id: 1,
    title: '从零开始学习 ChatGPT：新手入门完全指南', 
    category: '入门', 
    reads: '12.5k',
    author: 'AI导师',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format'
  },
  { 
    id: 2,
    title: '掌握 Midjourney 提示词的10个技巧', 
    category: '进阶', 
    reads: '8.3k',
    author: '设计达人',
    image: 'https://images.unsplash.com/photo-1685793606076-5ff5766f2e83?w=400&auto=format'
  },
  { 
    id: 3,
    title: '用 AI 提升10倍编程效率的实战经验', 
    category: '实战', 
    reads: '6.8k',
    author: '全栈工程师',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format'
  },
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
        {/* 第一屏：AI 一周大事轮播 */}
        <section className="mb-6 animate-fade-in-up">
          <NewsCarousel />
        </section>

        {/* ⭐⭐⭐⭐ 工具分类横栏 - 突出显示 */}
        <section className="mb-6 animate-fade-in-up delay-100">
          <Card className="glass border-gradient overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900/90 to-purple-900/40" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            <CardContent className="relative p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                  <Zap className="h-5 w-5 text-indigo-400" />
                </div>
                <h2 className="font-heading text-lg font-bold text-white">AI 工具分类</h2>
                <span className="text-xs text-slate-500 ml-2">选择你感兴趣的领域开始学习</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {toolCategories.map((cat, index) => (
                  <Link key={index} href="/resources">
                    <div className="group relative p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20">
                      <div className={cn(
                        'flex items-center justify-center h-12 w-12 rounded-xl mb-3 bg-gradient-to-br text-white mx-auto',
                        cat.color
                      )}>
                        <cat.icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium text-white text-sm group-hover:text-indigo-400 transition-colors">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                        <Badge variant="secondary" className="mt-2 text-xs bg-slate-800 text-slate-400 border-0">
                          {cat.count} 资源
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 主内容区：左侧 + 右侧 */}
        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* 左侧主区 60% (3/5) */}
          <div className="xl:col-span-3 space-y-6">
            {/* ⭐⭐⭐⭐ AI 热榜 Top 10 */}
            <div className="animate-fade-in-up delay-200">
              <Card className="glass border-gradient overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/90 to-orange-900/30" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                <CardHeader className="relative pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30">
                        <TrendingUp className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="font-heading text-lg text-white">🏆 AI 热榜</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      <Flame className="h-3 w-3 mr-1" /> 实时更新
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-1">
                    {hotListItems.map((item) => (
                      <Link key={item.rank} href="/resources">
                        <div className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-transparent transition-all cursor-pointer">
                          <div className={cn(
                            'flex items-center justify-center h-8 w-8 rounded-lg font-heading font-bold text-sm shrink-0',
                            item.rank === 1 && 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
                            item.rank === 2 && 'bg-gradient-to-br from-slate-400 to-slate-500 text-white',
                            item.rank === 3 && 'bg-gradient-to-br from-orange-600 to-orange-700 text-white',
                            item.rank > 3 && 'bg-slate-800 text-slate-400'
                          )}>
                            {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-1">
                                {item.title}
                              </h4>
                              {item.isHot && (
                                <Badge className="shrink-0 text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 border-0">
                                  爆
                                </Badge>
                              )}
                              {item.isNew && (
                                <Badge className="shrink-0 text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 border-0">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-indigo-500/30 text-indigo-400">
                                {item.category}
                              </Badge>
                              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                <Flame className="h-3 w-3 text-orange-400" />
                                {item.heat.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <ArrowUp className="h-4 w-4 text-emerald-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-3 text-slate-400 hover:text-white" asChild>
                    <Link href="/resources">
                      查看完整热榜
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* ⭐⭐⭐ 精选文章 */}
            <div className="animate-fade-in-up delay-300">
              <Card className="glass border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                      <Star className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="font-heading text-lg text-white">✨ 精选文章</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {featuredArticles.map((article) => (
                      <Link key={article.id} href="/resources">
                        <div className="group cursor-pointer">
                          <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                            <Badge className="absolute top-2 left-2 bg-purple-500/80 text-white border-0 text-xs">
                              {article.category}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <span>{article.author}</span>
                            <span className="flex items-center gap-0.5">
                              <Eye className="h-3 w-3" />
                              {article.reads}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ⭐⭐⭐ 社区动态 */}
            <div className="animate-fade-in-up delay-400">
              <Card className="glass border-indigo-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/30 to-blue-500/30">
                      <Users className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="font-heading text-lg text-white">💬 社区动态</span>
                    <Badge variant="outline" className="ml-auto text-xs border-indigo-500/30 text-indigo-400">
                      {mockPosts.length} 条新动态
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CreatePost />
                  {mockPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  <Button variant="outline" className="w-full glass border-indigo-500/30 hover:bg-indigo-500/10" asChild>
                    <Link href="/">
                      查看更多动态
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 右侧栏 40% (2/5) */}
          <div className="xl:col-span-2 space-y-5">
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
                  <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                    <Flame className="h-3 w-3 mr-0.5" /> 7天连续
                  </Badge>
                </div>
                <h3 className="font-heading font-bold text-white mb-2">掌握 ChatGPT 提示词工程</h3>
                <p className="text-xs text-slate-400 mb-3">学习编写有效的提示词技巧</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">进度</span>
                    <span className="text-white">2/4 步骤</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" />
                  </div>
                </div>
                <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" asChild>
                  <Link href="/learn">继续学习</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 热门话题 */}
            <Card className="glass border-pink-500/20 animate-fade-in-up delay-200">
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
            <Card className="glass border-emerald-500/20 animate-fade-in-up delay-300">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white bg-gradient-to-br from-emerald-500 to-teal-500">
                      {user.avatar}
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

            {/* 社区数据 */}
            <Card className="glass border-indigo-500/20 animate-fade-in-up delay-400">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  社区数据
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="font-heading text-xl font-bold text-indigo-400">1,284</div>
                    <div className="text-xs text-slate-500">在线用户</div>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-heading text-xl font-bold text-emerald-400">8,920</div>
                    <div className="text-xs text-slate-500">完成任务</div>
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

            {/* 学习路径快捷入口 */}
            <Card className="glass border-cyan-500/20 animate-fade-in-up delay-400">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30">
                    <Clock className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-white">学习路径</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/learn">
                  <div className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent transition-all cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                      1
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-300 group-hover:text-white">AI 入门指南</span>
                      <p className="text-xs text-slate-500">完成度 100%</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">已完成</Badge>
                  </div>
                </Link>
                <Link href="/learn">
                  <div className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent transition-all cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium">
                      2
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-300 group-hover:text-white">提示词工程</span>
                      <p className="text-xs text-slate-500">完成度 50%</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">进行中</Badge>
                  </div>
                </Link>
                <Link href="/learn">
                  <div className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent transition-all cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-500 text-xs font-medium">
                      3
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-500">AI 工具实战</span>
                      <p className="text-xs text-slate-600">未开始</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
