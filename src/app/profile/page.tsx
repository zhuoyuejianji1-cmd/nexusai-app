'use client';

import { useState } from 'react';
import { 
  Settings, Edit3, Heart, MessageSquare, Bookmark, 
  Trophy, Calendar, Flame, TrendingUp, ChevronRight,
  Star, Clock, FileText, Award, LogOut
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
  { name: '初学者', icon: Star, color: 'text-muted-foreground', earned: true, date: '2024-01-15' },
  { name: '活跃用户', icon: Flame, color: 'text-warning', earned: true, date: '2024-01-16' },
  { name: '连续7天', icon: Calendar, color: 'text-success', earned: true, date: '2024-01-22' },
  { name: '文章作者', icon: FileText, color: 'text-primary', earned: true, date: '2024-01-18' },
  { name: '进阶者', icon: TrendingUp, color: 'text-accent', earned: true, date: '2024-01-20' },
  { name: '专家', icon: Award, color: 'text-purple-500', earned: false, date: null },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(mockUser.nickname);
  const [editBio, setEditBio] = useState(mockUser.bio);

  const handleSave = () => {
    // 保存逻辑
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <section className="mb-8 animate-fade-in-up">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <CardContent className="relative p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <UserAvatar name={mockUser.nickname} size="lg" className="h-24 w-24" />
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
                    <Edit3 className="h-3 w-3" />
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
                        className="w-full px-3 py-2 bg-secondary rounded-lg border border-border focus:border-primary outline-none text-lg font-heading font-bold"
                      />
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary rounded-lg border border-border focus:border-primary outline-none text-sm resize-none h-20"
                      />
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <Button size="sm" onClick={handleSave}>保存</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>取消</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-heading text-2xl font-bold mb-1">{mockUser.nickname}</h1>
                      <p className="text-muted-foreground text-sm mb-3">{mockUser.email}</p>
                      <p className="text-sm mb-4">{mockUser.bio}</p>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-1.5">
                        <Edit3 className="h-3.5 w-3.5" />
                        编辑资料
                      </Button>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="font-heading text-2xl font-bold text-primary">{mockUser.points}</div>
                    <div className="text-xs text-muted-foreground">积分</div>
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-bold text-success">{mockUser.joinedDays}</div>
                    <div className="text-xs text-muted-foreground">天学习</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Tabs */}
        <section className="animate-fade-in-up delay-100">
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="posts" className="gap-1.5">
                <MessageSquare className="h-4 w-4" />
                我的动态
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-1.5">
                <Heart className="h-4 w-4" />
                收藏
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1.5">
                <Trophy className="h-4 w-4" />
                任务记录
              </TabsTrigger>
              <TabsTrigger value="badges" className="gap-1.5">
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
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">还没有发布动态</p>
                  <Button className="mt-4" asChild>
                    <Link href="/">去社区看看</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4 space-y-3">
                  {mockFavorites.map((item) => (
                    <Link key={item.id} href="/resources">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Bookmark className="h-5 w-5 text-primary" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4 space-y-3">
                  {mockTaskHistory.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                          <Trophy className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success/50">
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
                      'bg-card/50 border-border/50',
                      !badge.earned && 'opacity-50'
                    )}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        'inline-flex h-16 w-16 items-center justify-center rounded-full mb-3',
                        badge.earned ? 'bg-primary/10' : 'bg-secondary'
                      )}>
                        <badge.icon className={cn('h-8 w-8', badge.earned ? badge.color : 'text-muted-foreground')} />
                      </div>
                      <h3 className="font-medium mb-1">{badge.name}</h3>
                      {badge.date && (
                        <p className="text-xs text-muted-foreground">{badge.date}</p>
                      )}
                      {!badge.earned && (
                        <Badge variant="outline" className="mt-2 text-xs">未解锁</Badge>
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
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                学习进度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">成长路径进度</span>
                    <span className="font-medium">基础 75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">本周目标</span>
                    <span className="font-medium">4/5 任务</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">连续学习</span>
                    <span className="font-medium">7 天</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
