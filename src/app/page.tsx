'use client';

import { TrendingUp, Users, Zap, ChevronRight, MessageSquare, Code, Image, Video, FileText, Hash, Flame, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { NewsCarousel } from '@/components/home/news-carousel';
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
    content: '刚刚完成了 Midjourney 的进阶课程学习，终于掌握了如何生成高质量的产品图片！',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: '设计小能手', points: 150, created_at: '' },
  },
];

// AI 工具分类
const toolCategories = [
  { icon: MessageSquare, label: 'AI对话', count: '2.4k', color: 'from-indigo-500 to-blue-500' },
  { icon: Image, label: 'AI图像', count: '1.8k', color: 'from-pink-500 to-purple-500' },
  { icon: Code, label: 'AI编程', count: '1.2k', color: 'from-emerald-500 to-teal-500' },
  { icon: Video, label: 'AI视频', count: '890', color: 'from-orange-500 to-red-500' },
  { icon: FileText, label: '文档处理', count: '756', color: 'from-cyan-500 to-blue-500' },
];

// AI 热榜 - 竖排排名列表
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
  { name: '设计小能手', content: '刚刚完成了 Midjourney 的进阶课程学习，终于掌握了如何生成高质量的产品图片！', time: '15分钟前', likes: 42 },
  { name: '效率达人', content: '分享一个超好用的 AI 工具：Notion AI 真的太香了！用它来整理笔记效率翻倍。', time: '45分钟前', likes: 128 },
  { name: 'AI学习者', content: 'Day 3/30：今天开始学习 Prompt Engineering，Chain of Thought 技巧真的很实用！', time: '2小时前', likes: 35 },
  { name: '技术大牛', content: '用 Claude 3.5 写代码一周了，总结了10个提升效率的技巧分享给大家。', time: '3小时前', likes: 89 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl aurora-glow" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl aurora-glow-delay" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl aurora-glow" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        {/* Hero 大Logo区域 */}
        <section className="mb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-purple-900/80 border border-indigo-500/30">
            {/* 背景光效 */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-8 py-12 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/50">
                  <Sparkles className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-4xl font-black bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                    NexusAI
                  </h1>
                </div>
              </div>
              
              {/* 标语 */}
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                探索AI · 分享知识 · 连接未来
              </h2>
              <p className="text-base md:text-lg text-indigo-200/80 mb-6 max-w-2xl">
                加入最大的AI学习社区，与千万学习者一起掌握最前沿的人工智能技术
              </p>
              
              {/* 数据指标 */}
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1,000,000+</div>
                  <div className="text-xs text-indigo-300/60">学习者</div>
                </div>
                <div className="w-px h-10 bg-indigo-500/30" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10,000+</div>
                  <div className="text-xs text-indigo-300/60">精选资源</div>
                </div>
                <div className="w-px h-10 bg-indigo-500/30" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-indigo-300/60">AI工具</div>
                </div>
              </div>
              
              {/* CTA按钮 */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50">
                  <Zap className="h-5 w-5" />
                  开始学习
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all border border-white/20">
                  <Sparkles className="h-5 w-5" />
                  了解更多
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 第二行：AI 热榜 + 最新动态（左右并排） */}
        <section className="grid grid-cols-2 gap-3 mb-3">
          {/* AI 热榜 */}
          <Card className="border-gradient overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/90 to-orange-900/30" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <CardHeader className="relative pb-1">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-amber-400" />
                  <span className="font-heading text-xs font-bold text-white">🏆 AI 热榜</span>
                </div>
                <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-0">
                  <Flame className="h-2 w-2 mr-0.5" /> 实时
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="space-y-0">
                {hotListItems.map((item) => (
                  <Link key={item.rank} href="/resources">
                    <div className="group flex items-center gap-2 py-1.5 px-1 -mx-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <span className={cn(
                        'flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold shrink-0',
                        item.rank === 1 && 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
                        item.rank === 2 && 'bg-gradient-to-br from-slate-400 to-slate-500 text-white',
                        item.rank === 3 && 'bg-gradient-to-br from-orange-600 to-orange-700 text-white',
                        item.rank > 3 && 'bg-slate-800 text-slate-400'
                      )}>
                        {item.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] text-orange-400 shrink-0">
                        <Flame className="h-2.5 w-2.5" />
                        {(item.heat / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 最新动态 */}
          <Card className="glass border-indigo-500/20">
            <CardHeader className="relative pb-1">
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-3 w-3 text-indigo-400" />
                <span className="font-heading text-xs font-bold text-white">📢 最新动态</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {latestPosts.map((post, index) => (
                <div key={index} className="flex items-start gap-2 py-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[10px] font-semibold shrink-0">
                    {post.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium text-white">{post.name}</span>
                      <span className="text-[10px] text-slate-500">{post.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">{post.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 第四行：社区动态 */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          {/* 社区动态 - 居中显示 */}
          <Card className="xl:col-span-8 xl:col-start-3 glass border-indigo-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="font-heading text-sm font-bold text-white">💬 社区动态</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-slate-400 h-auto p-0" asChild>
                  <Link href="/">查看全部 →</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <CreatePost />
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
