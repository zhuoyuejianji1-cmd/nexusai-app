'use client';

import dynamic from 'next/dynamic';
import { TrendingUp, Users, Flame, Hash, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { resourceCategories, iconMap } from '@/lib/resources';

// 动态导入重型组件，避免阻塞首屏
const PostCard = dynamic(() => import('@/components/home/post-card').then(mod => ({ default: mod.PostCard })), {
  loading: () => <div className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />,
  ssr: false,
});

const CreatePost = dynamic(() => import('@/components/home/create-post').then(mod => ({ default: mod.CreatePost })), {
  loading: () => <div className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />,
  ssr: false,
});

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

// 首页分类导航 - 使用真实数据
const categories = resourceCategories.slice(0, 8).map(cat => ({
  icon: iconMap[cat.icon] || Sparkles,
  label: cat.name,
  desc: cat.description,
  color: cat.color,
  href: '/resources'
}));

// AI 热榜
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
  { name: '设计小能手', content: '刚刚完成了 Midjourney 的进阶课程学习...', time: '15分钟前', likes: 42 },
  { name: '效率达人', content: '分享一个超好用的 AI 工具：Notion AI...', time: '45分钟前', likes: 128 },
  { name: 'AI学习者', content: 'Day 3/30：今天开始学习 Prompt Engineering...', time: '2小时前', likes: 35 },
  { name: '技术大牛', content: '用 Claude 3.5 写代码一周了...', time: '3小时前', likes: 89 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero 大Logo区域 */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-purple-900/80 border border-indigo-500/30">
            {/* 背景光效 */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-6 py-12 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/50">
                  <Sparkles className="h-11 w-11 text-white" />
                </div>
                <h1 className="font-heading text-5xl font-black bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                  NexusAI
                </h1>
              </div>
              
              {/* 标语 */}
              <h2 className="text-2xl font-bold text-white mb-2">
                探索AI · 分享知识 · 连接未来
              </h2>
              <p className="text-base text-indigo-200/80 mb-6 max-w-xl">
                加入最大的AI学习社区，与千万学习者一起掌握最前沿的人工智能技术
              </p>
              
              {/* 数据指标 */}
              <div className="flex items-center gap-10 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">10,000+</div>
                  <div className="text-xs text-indigo-300/60">精品资源</div>
                </div>
                <div className="w-px h-12 bg-indigo-500/30" />
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">500+</div>
                  <div className="text-xs text-indigo-300/60">AI工具</div>
                </div>
                <div className="w-px h-12 bg-indigo-500/30" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1,000,000+</div>
                  <div className="text-xs text-indigo-300/60">学习者</div>
                </div>
              </div>
              
              {/* 分类导航 - 完整资源分类 */}
              <div className="w-full grid grid-cols-4 gap-3">
                {categories.map((cat, index) => (
                  <Link key={index} href={cat.href}>
                    <div className={cn(
                      'group flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer',
                    )}>
                      <div className={cn(
                        'flex items-center justify-center h-10 w-10 rounded-xl mb-2 bg-gradient-to-br text-white',
                        cat.color
                      )}>
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-white">{cat.label}</span>
                      <span className="text-[10px] text-slate-400">{cat.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 第二行：AI 热榜 + 最新动态（左右并排） */}
        <section className="grid grid-cols-2 gap-4 mb-4">
          {/* AI 热榜 */}
          <Card className="border-gradient overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/90 to-orange-900/30" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <CardHeader className="relative pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span className="font-heading text-sm font-bold text-white">🏆 AI 热榜</span>
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
            <CardHeader className="relative pb-2">
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-indigo-400" />
                <span className="font-heading text-sm font-bold text-white">📢 最新动态</span>
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

        {/* 第三行：社区动态 */}
        <section>
          <Card className="glass border-indigo-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="font-heading text-sm font-bold text-white">💬 社区动态</span>
                </div>
                <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
                  查看全部 →
                </Link>
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
