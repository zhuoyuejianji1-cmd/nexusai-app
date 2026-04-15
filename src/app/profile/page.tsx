'use client';

import { useState } from 'react';
import { 
  Edit3, Heart, MessageSquare, Bookmark, 
  Trophy, Calendar, Flame, TrendingUp, ChevronRight,
  Star, FileText, Award
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { UserAvatar } from '@/components/common/user-avatar';
import { PostCard } from '@/components/home/post-card';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';

// 模拟用户数据
const mockUser = {
  id: '1',
  nickname: 'AI探索者',
  email: 'user@example.com',
  avatar_url: '',
  bio: '热爱 AI，专注学习新技术。希望用 AI 提升工作效率，探索无限可能。',
  points: 1250,
  joinedDays: 23,
};

// 模拟用户动态
const mockUserPosts: Post[] = [
  {
    id: '1',
    user_id: mockUser.id,
    content: '完成了今天的 AI 学习任务，感觉收获满满！',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: { id: mockUser.id, email: mockUser.email, nickname: mockUser.nickname, points: 0, created_at: '' },
  },
  {
    id: '2',
    user_id: mockUser.id,
    content: '分享一个最近在用的 AI 写作工具，真的太好用了！',
    images: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format'],
    likes_count: 128,
    comments_count: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: { id: mockUser.id, email: mockUser.email, nickname: mockUser.nickname, points: 0, created_at: '' },
  },
];

// 模拟收藏
const mockFavorites = [
  { id: '1', title: 'ChatGPT 提示词工程指南', category: 'tutorial' },
  { id: '2', title: 'Claude 3.5 深度测评', category: 'paper' },
  { id: '3', title: 'Midjourney 进阶教程', category: 'video' },
];

// 模拟任务历史
const mockTaskHistory = [
  { title: '了解 AI 基本概念', date: '2024-01-15', points: 10, status: 'completed' },
  { title: '注册并体验 ChatGPT', date: '2024-01-15', points: 15, status: 'completed' },
  { title: '学习有效提问技巧', date: '2024-01-16', points: 20, status: 'completed' },
  { title: '掌握 ChatGPT 提示词工程基础', date: '2024-01-17', points: 50, status: 'completed' },
];

// 徽章
const mockBadges = [
  { name: '初学者', icon: Star, earned: true, date: '2024-01-15' },
  { name: '活跃用户', icon: Flame, earned: true, date: '2024-01-16' },
  { name: '连续7天', icon: Calendar, earned: true, date: '2024-01-22' },
  { name: '文章作者', icon: FileText, earned: true, date: '2024-01-18' },
  { name: '进阶者', icon: TrendingUp, earned: true, date: '2024-01-20' },
  { name: '专家', icon: Award, earned: false, date: null },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(mockUser.nickname);
  const [editBio, setEditBio] = useState(mockUser.bio);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl aurora-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl aurora-glow-delay" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <section className="mb-8 animate-fade-in-up">
          <Card className="border-gradient overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900/80 to-purple-900/40" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            <CardContent className="relative p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-900">
                    <UserAvatar name={mockUser.nickname} size="lg" className="h-full w-full" />
                  </div>
                  <button className="absolute bottom-1 right-1 p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg shadow-indigo-500/30">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        className="w-full px-4 py-2 glass border border-indigo-500/30 rounded-xl focus:border-indigo-500 outline-none text-xl font-heading font-bold bg-slate-900/50 text-white"
                      />
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full px-4 py-2 glass border border-indigo-500/30 rounded-xl focus:border-indigo-500 outline-none text-sm resize-none h-20 bg-slate-900/50 text-white"
                      />
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">保存</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="border-indigo-500/30">取消</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-heading text-3xl font-bold mb-1 text-white">{mockUser.nickname}</h1>
                      <p className="text-slate-400 text-sm mb-3">{mockUser.email}</p>
                      <p className="text-slate-300 mb-4">{mockUser.bio}</p>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-1.5 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-white">
                        <Edit3 className="h-3.5 w-3.5" />
                        编辑资料
                      </Button>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-8 text-center">
                  <div className="glass p-4 rounded-xl border border-indigo-500/20">
                    <div className="font-heading text-3xl font-bold text-indigo-400">{mockUser.points}</div>
                    <div className="text-xs text-slate-400 mt-1">积分</div>
                  </div>
                  <div className="glass p-4 rounded-xl border border-emerald-500/20">
                    <div className="font-heading text-3xl font-bold text-emerald-400">{mockUser.joinedDays}</div>
                    <div className="text-xs text-slate-400 mt-1">天学习</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Tabs */}
        <section className="animate-fade-in-up delay-100">
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="glass border border-indigo-500/20 p-1">
              <TabsTrigger value="posts" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <MessageSquare className="h-4 w-4" />
                我的动态
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Heart className="h-4 w-4" />
                收藏
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Trophy className="h-4 w-4" />
                任务记录
              </TabsTrigger>
              <TabsTrigger value="badges" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Award className="h-4 w-4" />
                徽章
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              {mockUserPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {mockUserPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl glass mb-4">
                    <MessageSquare className="h-8 w-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400">还没有发布动态</p>
                  <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600" asChild>
                    <Link href="/">去社区看看</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className="glass border-indigo-500/20">
                <CardContent className="p-4 space-y-3">
                  {mockFavorites.map((item) => (
                    <Link key={item.id} href="/resources">
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-indigo-500/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/20">
                            <Bookmark className="h-5 w-5 text-amber-400" />
                          </div>
                          <span className="text-slate-300">{item.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <Card className="glass border-indigo-500/20">
                <CardContent className="p-4 space-y-3">
                  {mockTaskHistory.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-900/50 to-transparent border border-indigo-500/10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                          <Trophy className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-400 border-emerald-500/50 bg-emerald-500/10">
                        +{task.points}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockBadges.map((badge, index) => (
                  <Card 
                    key={index} 
                    className={cn(
                      'glass overflow-hidden',
                      badge.earned 
                        ? 'border-indigo-500/30' 
                        : 'opacity-50 border-slate-700'
                    )}
                  >
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        'inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-3',
                        badge.earned 
                          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30' 
                          : 'bg-slate-800'
                      )}>
                        <badge.icon className={cn(
                          'h-8 w-8', 
                          badge.earned ? 'text-indigo-400' : 'text-slate-600'
                        )} />
                      </div>
                      <h3 className="font-medium text-white mb-1">{badge.name}</h3>
                      {badge.date && (
                        <p className="text-xs text-slate-500">{badge.date}</p>
                      )}
                      {!badge.earned && (
                        <Badge variant="outline" className="mt-2 text-xs border-slate-600 text-slate-500">未解锁</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Learning Progress */}
        <section className="mt-8 animate-fade-in-up delay-200">
          <Card className="glass border-indigo-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                </div>
                学习进度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">成长路径进度</span>
                    <span className="font-medium text-white">基础 75%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">本周目标</span>
                    <span className="font-medium text-white">4/5 任务</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">连续学习</span>
                    <span className="font-medium text-white">7 天</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
