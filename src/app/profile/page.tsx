'use client';

import { useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 监听主题变化
  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "min-h-screen relative",
      isDark ? "gradient-bg tech-grid" : "bg-gradient-to-br from-slate-50 via-white to-indigo-50"
    )}>
      {/* 背景光效 */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      )}
      
      <Navbar />
      
      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <section className="mb-8">
          <Card className={cn(
            "overflow-hidden",
            isDark 
              ? "border-gradient bg-slate-900/80" 
              : "bg-white border-slate-200 shadow-sm"
          )}>
            <div className={cn(
              "h-2",
              isDark 
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" 
                : "bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
            )} />
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className={cn(
                    "h-28 w-28 rounded-2xl overflow-hidden ring-2 ring-offset-2",
                    isDark 
                      ? "ring-indigo-500/50 ring-offset-slate-900" 
                      : "ring-indigo-300 ring-offset-white"
                  )}>
                    <UserAvatar name={mockUser.nickname} size="lg" className="h-full w-full" />
                  </div>
                  <button className={cn(
                    "absolute bottom-1 right-1 p-2 rounded-xl transition-all shadow-lg",
                    isDark
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white"
                      : "bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white"
                  )}>
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
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border outline-none text-xl font-heading font-bold",
                          isDark
                            ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500"
                        )}
                      />
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border outline-none text-sm resize-none h-20",
                          isDark
                            ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500"
                        )}
                      />
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">保存</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className={cn(
                          isDark ? "border-slate-700" : "border-slate-200"
                        )}>取消</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className={cn(
                        "font-heading text-3xl font-bold mb-1",
                        isDark ? "text-white" : "text-slate-800"
                      )}>{mockUser.nickname}</h1>
                      <p className={cn(
                        "text-sm mb-3",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}>{mockUser.email}</p>
                      <p className={cn(
                        "mb-4",
                        isDark ? "text-slate-300" : "text-slate-600"
                      )}>{mockUser.bio}</p>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className={cn(
                        "gap-1.5",
                        isDark
                          ? "border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-white"
                          : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      )}>
                        <Edit3 className="h-3.5 w-3.5" />
                        编辑资料
                      </Button>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-center">
                  <div className={cn(
                    "p-4 rounded-xl border",
                    isDark 
                      ? "glass border-indigo-500/20" 
                      : "bg-indigo-50 border-indigo-100"
                  )}>
                    <div className={cn(
                      "font-heading text-3xl font-bold",
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    )}>{mockUser.points}</div>
                    <div className={cn(
                      "text-xs mt-1",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>积分</div>
                  </div>
                  <div className={cn(
                    "p-4 rounded-xl border",
                    isDark 
                      ? "glass border-emerald-500/20" 
                      : "bg-emerald-50 border-emerald-100"
                  )}>
                    <div className={cn(
                      "font-heading text-3xl font-bold",
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    )}>{mockUser.joinedDays}</div>
                    <div className={cn(
                      "text-xs mt-1",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>天学习</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Tabs */}
        <section>
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className={cn(
              "p-1 grid w-full grid-cols-4",
              isDark 
                ? "bg-slate-800/50 border border-slate-700" 
                : "bg-slate-100 border border-slate-200"
            )}>
              <TabsTrigger value="posts" className={cn(
                "gap-1.5 text-xs sm:text-sm",
                isDark ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400" : "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              )}>
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">我的动态</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className={cn(
                "gap-1.5 text-xs sm:text-sm",
                isDark ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400" : "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              )}>
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">收藏</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className={cn(
                "gap-1.5 text-xs sm:text-sm",
                isDark ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400" : "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              )}>
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">任务记录</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className={cn(
                "gap-1.5 text-xs sm:text-sm",
                isDark ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400" : "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              )}>
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">徽章</span>
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              {mockUserPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {mockUserPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className={cn(
                    "inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4",
                    isDark ? "glass" : "bg-slate-100"
                  )}>
                    <MessageSquare className={cn(
                      "h-8 w-8",
                      isDark ? "text-slate-500" : "text-slate-400"
                    )} />
                  </div>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>还没有发布动态</p>
                  <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600" asChild>
                    <Link href="/">去社区看看</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className={cn(
                isDark ? "glass border-indigo-500/20" : "bg-white border-slate-200 shadow-sm"
              )}>
                <CardContent className="p-4 space-y-3">
                  {mockFavorites.map((item) => (
                    <Link key={item.id} href="/resources">
                      <div className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border",
                        isDark
                          ? "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-transparent hover:border-indigo-500/20 border-transparent"
                          : "hover:bg-indigo-50 hover:border-indigo-200 border-transparent"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isDark ? "bg-amber-500/20" : "bg-amber-100"
                          )}>
                            <Bookmark className={cn(
                              "h-5 w-5",
                              isDark ? "text-amber-400" : "text-amber-500"
                            )} />
                          </div>
                          <span className={isDark ? "text-slate-300" : "text-slate-700"}>{item.title}</span>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4",
                          isDark ? "text-slate-500" : "text-slate-400"
                        )} />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <Card className={cn(
                isDark ? "glass border-indigo-500/20" : "bg-white border-slate-200 shadow-sm"
              )}>
                <CardContent className="p-4 space-y-3">
                  {mockTaskHistory.map((task, index) => (
                    <div key={index} className={cn(
                      "flex items-center justify-between p-3 rounded-xl border",
                      isDark
                        ? "bg-slate-800/50 border-indigo-500/10"
                        : "bg-slate-50 border-slate-100"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                        )}>
                          <Trophy className={cn(
                            "h-5 w-5",
                            isDark ? "text-emerald-400" : "text-emerald-500"
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium text-sm",
                            isDark ? "text-white" : "text-slate-800"
                          )}>{task.title}</p>
                          <p className={cn(
                            "text-xs",
                            isDark ? "text-slate-500" : "text-slate-400"
                          )}>{task.date}</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "border-0",
                        isDark 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-emerald-100 text-emerald-600"
                      )}>
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
                      "overflow-hidden",
                      badge.earned 
                        ? isDark 
                          ? "glass border-indigo-500/30" 
                          : "bg-white border-indigo-200 shadow-sm"
                        : isDark 
                          ? "opacity-50 border-slate-700" 
                          : "opacity-50 border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "h-1",
                      badge.earned 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
                        : isDark ? "bg-slate-700" : "bg-slate-200"
                    )} />
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        'inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-3',
                        badge.earned 
                          ? isDark 
                            ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30' 
                            : 'bg-indigo-100'
                          : isDark ? 'bg-slate-800' : 'bg-slate-100'
                      )}>
                        <badge.icon className={cn(
                          'h-8 w-8', 
                          badge.earned 
                            ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                            : isDark ? 'text-slate-600' : 'text-slate-400'
                        )} />
                      </div>
                      <h3 className={cn(
                        "font-medium mb-1",
                        isDark ? "text-white" : "text-slate-800"
                      )}>{badge.name}</h3>
                      {badge.date && (
                        <p className={cn(
                          "text-xs",
                          isDark ? "text-slate-500" : "text-slate-400"
                        )}>{badge.date}</p>
                      )}
                      {!badge.earned && (
                        <Badge variant="outline" className={cn(
                          "mt-2 text-xs",
                          isDark ? "border-slate-600 text-slate-500" : "border-slate-300 text-slate-400"
                        )}>未解锁</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Learning Progress */}
        <section className="mt-8">
          <Card className={cn(
            isDark ? "glass border-indigo-500/20" : "bg-white border-slate-200 shadow-sm"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2 font-heading text-lg",
                isDark ? "text-white" : "text-slate-800"
              )}>
                <div className={cn(
                  "p-2 rounded-xl",
                  isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                )}>
                  <TrendingUp className={cn(
                    "h-5 w-5",
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  )} />
                </div>
                学习进度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '成长路径进度', value: '75%', color: 'from-indigo-500 to-purple-500', barBg: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { label: '本周目标', value: '4/5 任务', color: 'from-cyan-500 to-indigo-500', barBg: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                  { label: '连续学习', value: '7 天', color: 'from-emerald-500 to-cyan-500', barBg: isDark ? 'bg-slate-800' : 'bg-slate-100' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className={cn(
                      "flex items-center justify-between text-sm mb-2",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      <span>{item.label}</span>
                      <span className={cn(
                        "font-medium",
                        isDark ? "text-white" : "text-slate-800"
                      )}>{item.value}</span>
                    </div>
                    <div className={cn(
                      "h-2 rounded-full overflow-hidden",
                      item.barBg
                    )}>
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          index === 0 ? 'w-[75%]' : index === 1 ? 'w-[80%]' : 'w-full',
                          `bg-gradient-to-r ${item.color}`
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
