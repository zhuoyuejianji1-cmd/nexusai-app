'use client';

import { Sparkles, BookOpen, TrendingUp, Users, Zap, ChevronRight, MessageSquare, Code, Image, Video, FileText, Hash, Flame, Target, Clock, Star, ArrowUp, Eye, Play } from 'lucide-react';
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

// AI 热榜 - 紧凑卡片
const hotListItems = [
  { rank: 1, title: 'GPT-5 正式发布', heat: 98600, category: '大模型', isHot: true },
  { rank: 2, title: 'Claude 3.5 超越 GPT-4', heat: 87500, category: '大模型', isHot: true },
  { rank: 3, title: '开源 Llama 4 发布', heat: 76200, category: '开源' },
  { rank: 4, title: 'AI Agent 落地应用', heat: 65400, category: 'Agent', isNew: true },
  { rank: 5, title: 'Midjourney V7 发布', heat: 54300, category: '图像' },
  { rank: 6, title: 'GitHub Copilot X 新功能', heat: 43200, category: '编程' },
  { rank: 7, title: '国产大模型新进展', heat: 32100, category: '大模型' },
];

// 热门话题
const hotTopics = [
  { tag: 'ChatGPT-5', posts: 2340 },
  { tag: 'Claude3.5', posts: 1890 },
  { tag: 'AI编程', posts: 1560 },
  { tag: 'AI绘图', posts: 1230 },
  { tag: 'Prompt工程', posts: 980 },
];

// 活跃用户
const activeUsers = [
  { name: 'AI探险家', tasks: 45, avatar: 'A', streak: 12 },
  { name: '技术小能手', tasks: 38, avatar: 'T', streak: 8 },
  { name: '学习达人', tasks: 32, avatar: 'L', streak: 6 },
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
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* 第一行：Hero + 今日任务 */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
          {/* Hero 轮播 - 2/3 宽度 */}
          <div className="xl:col-span-2">
            <NewsCarousel />
          </div>
          
          {/* 今日任务卡片 - 1/3 宽度 */}
          <Card className="border-gradient overflow-hidden relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-purple-900/50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            <CardContent className="relative p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                  <Target className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-indigo-400">今日任务</span>
                <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                  <Flame className="h-3 w-3 mr-0.5" /> 7天
                </Badge>
              </div>
              <h3 className="font-heading font-bold text-white text-base mb-1">掌握 ChatGPT 提示词工程</h3>
              <p className="text-xs text-slate-400 mb-3">学习编写有效的提示词技巧</p>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">进度</span>
                  <span className="text-white">2/4 步骤</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>
              </div>
              <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 mt-auto" asChild>
                <Link href="/learn">继续学习 →</Link>
              </Button>
              
              {/* 学习路径进度 */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <h4 className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 学习路径
                </h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-[10px] text-emerald-400">✓</span>
                    </div>
                    <span className="text-xs text-slate-400">AI 入门指南</span>
                    <Badge className="ml-auto text-[10px] px-1 py-0 bg-emerald-500/20 text-emerald-400 border-0">完成</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-amber-500/20 flex items-center justify-center">
                      <span className="text-[10px] text-amber-400">2</span>
                    </div>
                    <span className="text-xs text-white">提示词工程</span>
                    <Badge className="ml-auto text-[10px] px-1 py-0 bg-amber-500/20 text-amber-400 border-0">进行中</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-slate-800 flex items-center justify-center">
                      <span className="text-[10px] text-slate-500">3</span>
                    </div>
                    <span className="text-xs text-slate-500">AI 工具实战</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 第二行：工具分类 + 热门话题 */}
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
          {/* 工具分类 - 3/4 宽度 */}
          <div className="xl:col-span-3">
            <Card className="glass border-indigo-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                    <Zap className="h-4 w-4 text-indigo-400" />
                  </div>
                  <h2 className="font-heading text-sm font-bold text-white">AI 工具分类</h2>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {toolCategories.map((cat, index) => (
                    <Link key={index} href="/resources">
                      <div className="group flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer hover:-translate-y-0.5">
                        <div className={cn(
                          'flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br text-white shrink-0',
                          cat.color
                        )}>
                          <cat.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-white text-xs group-hover:text-indigo-400 transition-colors truncate">
                            {cat.label}
                          </h3>
                          <p className="text-[10px] text-slate-500">{cat.count}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 热门话题 - 1/4 宽度 */}
          <Card className="glass border-pink-500/20">
            <CardContent className="p-4">
              <h3 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                <Hash className="h-3 w-3 text-pink-400" />
                热门话题
              </h3>
              <div className="flex flex-wrap gap-1">
                {hotTopics.slice(0, 5).map((topic, index) => (
                  <Link key={index} href="/resources">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'cursor-pointer text-[10px] px-1.5 py-0.5 border-pink-500/30',
                        index < 2 && 'bg-pink-500/20 text-pink-400 border-pink-400'
                      )}
                    >
                      #{topic.tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 第三行：AI 热榜 + 精选文章 + 社区动态 */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
          {/* AI 热榜 - 横向滚动 - 5/12 */}
          <Card className="xl:col-span-5 border-gradient overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/90 to-orange-900/30" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <CardHeader className="relative pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span className="font-heading text-sm font-bold text-white">🏆 AI 热榜</span>
                </div>
                <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-0">
                  <Flame className="h-2.5 w-2.5 mr-0.5" /> 实时
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {hotListItems.map((item) => (
                  <Link key={item.rank} href="/resources" className="shrink-0">
                    <div className="w-40 p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={cn(
                          'flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold',
                          item.rank === 1 && 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
                          item.rank === 2 && 'bg-gradient-to-br from-slate-400 to-slate-500 text-white',
                          item.rank === 3 && 'bg-gradient-to-br from-orange-600 to-orange-700 text-white',
                          item.rank > 3 && 'bg-slate-800 text-slate-400'
                        )}>
                          {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                        </span>
                        <Badge className={cn(
                          'text-[8px] px-1 py-0 border-0',
                          item.isHot ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'
                        )}>
                          {item.isHot ? '🔥' : item.category}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-0.5">
                        <Flame className="h-2.5 w-2.5 text-orange-400" />
                        {(item.heat / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 精选文章 - 4/12 */}
          <Card className="xl:col-span-4 glass border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="font-heading text-sm font-bold text-white">✨ 精选文章</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: '从零开始学习 ChatGPT：新手入门完全指南', reads: '12.5k' },
                { title: '掌握 Midjourney 提示词的10个技巧', reads: '8.3k' },
                { title: '用 AI 提升10倍编程效率的实战经验', reads: '6.8k' },
              ].map((article, index) => (
                <Link key={index} href="/resources">
                  <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer">
                    <div className="h-10 w-14 rounded bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-medium text-slate-300 group-hover:text-white line-clamp-2 leading-tight">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-0.5">
                        <Eye className="h-2.5 w-2.5" />
                        {article.reads}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* 活跃学习者 - 3/12 */}
          <Card className="xl:col-span-3 glass border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span className="font-heading text-sm font-bold text-white">活跃学习者</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white bg-gradient-to-br from-emerald-500 to-teal-500 shrink-0">
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-300 block truncate">{user.name}</span>
                    <span className="text-[10px] text-emerald-400">{user.tasks} 任务</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                    <Flame className="h-2.5 w-2.5" />
                    {user.streak}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 第四行：社区动态 + 学习小贴士 + 社区数据 */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* 社区动态 - 7/12 */}
          <Card className="xl:col-span-7 glass border-indigo-500/20">
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
            <CardContent className="space-y-3">
              <CreatePost />
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </CardContent>
          </Card>

          {/* 右侧：学习小贴士 + 社区数据 - 5/12 */}
          <div className="xl:col-span-5 space-y-4">
            {/* 学习小贴士 */}
            <Card className="glass border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="font-heading text-sm font-bold text-white">💡 学习小贴士</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: '💡', text: '使用 CoT 提示词可以让 AI 的推理更准确' },
                  { icon: '⚡', text: 'Few-shot 示例能显著提升输出质量' },
                  { icon: '🎯', text: '明确的任务描述可以获得更好的结果' },
                ].map((tip, index) => (
                  <div key={index} className="flex gap-2 p-2 rounded-lg bg-slate-900/50 border border-amber-500/10">
                    <span className="text-base shrink-0">{tip.icon}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 社区数据 */}
            <Card className="glass border-indigo-500/20">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  社区数据
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: '1,284', label: '在线', color: 'text-indigo-400' },
                    { value: '8.9k', label: '任务', color: 'text-emerald-400' },
                    { value: '3.4k', label: '资源', color: 'text-cyan-400' },
                    { value: '12.5k', label: '动态', color: 'text-amber-400' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className={cn('font-heading text-lg font-bold', stat.color)}>{stat.value}</div>
                      <div className="text-[10px] text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 快速入口 */}
            <div className="grid grid-cols-2 gap-2">
              <Link href="/resources">
                <Card className="glass border-cyan-500/20 hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-3 text-center">
                    <BookOpen className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                    <span className="text-xs text-white">资源库</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/profile">
                <Card className="glass border-purple-500/20 hover:border-purple-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-3 text-center">
                    <Users className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-white">个人中心</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
