'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Flame, 
  Hash, 
  Sparkles, 
  Sun, 
  Moon, 
  ChevronRight, 
  ArrowRight,
  Layers,
  Star,
  Heart,
  Crown,
  Bookmark,
  Share2,
  Image,
  MessageCircle,
  Search,
  Filter
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { resourceCategories, resources, iconMap } from '@/lib/resources';

// 分类颜色映射
const colorMap: Record<string, { gradient: string; text: string }> = {
  'ai-tools': { gradient: 'from-violet-500 to-purple-500', text: 'text-violet-500' },
  'ai-chat': { gradient: 'from-blue-500 to-cyan-500', text: 'text-blue-500' },
  'ai-image': { gradient: 'from-pink-500 to-rose-500', text: 'text-pink-500' },
  'ai-video': { gradient: 'from-red-500 to-orange-500', text: 'text-red-500' },
  'ai-music': { gradient: 'from-purple-500 to-fuchsia-500', text: 'text-purple-500' },
  'ai-coding': { gradient: 'from-emerald-500 to-green-500', text: 'text-emerald-500' },
  'ai-prompts': { gradient: 'from-amber-500 to-yellow-500', text: 'text-amber-500' },
  'default': { gradient: 'from-indigo-500 to-purple-500', text: 'text-indigo-500' },
};

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

// 模拟动态数据
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: '完成了今天的 AI 学习任务，感觉收获满满！特别是关于 Prompt Engineering 的部分，对工作效率提升很大。',
    images: [],
    likes_count: 42,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: '设计小能手', points: 150, is_vip: false, created_at: '' },
  },
];

type TabType = 'home' | 'resources' | 'premium' | 'learn' | 'profile';

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark 
        ? "bg-[#0a0a0f] text-white" 
        : "bg-[#fafbfc] text-slate-900"
    )}>
      {/* 背景装饰 */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      )}
      
      <Navbar onTabChange={setActiveTab} />
      
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        {/* 首页内容 */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            {/* Hero 区域 */}
            <section className="mb-8">
              <div className={cn(
                "relative overflow-hidden rounded-3xl",
                isDark 
                  ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-white/5" 
                  : "bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 border border-slate-200/80 shadow-xl shadow-slate-200/50"
              )}>
                <div className="absolute inset-0 overflow-hidden">
                  <div className={cn(
                    "absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl",
                    isDark ? "bg-indigo-500/10" : "bg-indigo-200/50"
                  )} />
                  <div className={cn(
                    "absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl",
                    isDark ? "bg-purple-500/10" : "bg-purple-200/50"
                  )} />
                </div>
                
                <div className="relative px-8 py-10 flex flex-col items-center text-center">
                  {/* Logo */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "flex items-center justify-center h-16 w-16 rounded-xl",
                      isDark 
                        ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30" 
                        : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20"
                    )}>
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className={cn(
                        "font-heading text-4xl font-black tracking-tight",
                        isDark 
                          ? "bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent"
                          : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                      )}>
                        NexusAI
                      </h1>
                      <p className={cn(
                        "text-xs font-medium tracking-wider uppercase",
                        isDark ? "text-slate-500" : "text-slate-400"
                      )}>
                        AI Learning Community
                      </p>
                    </div>
                  </div>
                  
                  <h2 className={cn(
                    "text-xl font-semibold mb-3",
                    isDark ? "text-white/90" : "text-slate-700"
                  )}>
                    探索 AI · 分享知识 · 连接未来
                  </h2>
                  <p className={cn(
                    "text-sm mb-6 max-w-xl",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    加入最大的AI学习社区，与千万学习者一起掌握最前沿的人工智能技术
                  </p>
                  
                  {/* 数据指标 */}
                  <div className={cn(
                    "flex items-center gap-8 p-4 rounded-xl",
                    isDark 
                      ? "bg-white/5 backdrop-blur-sm border border-white/10" 
                      : "bg-white/80 backdrop-blur-sm border border-slate-200/50"
                  )}>
                    {[
                      { value: '10,000+', label: '精品资源' },
                      { value: '500+', label: 'AI工具' },
                      { value: '1M+', label: '学习者' },
                    ].map((stat, i) => (
                      <div key={i} className={cn(
                        "text-center px-6",
                        i < 2 ? (isDark ? "border-r border-white/10" : "border-r border-slate-200") : ""
                      )}>
                        <div className={cn(
                          "font-heading text-2xl font-bold",
                          isDark ? "text-white" : "text-slate-900"
                        )}>
                          {stat.value}
                        </div>
                        <div className={cn(
                          "text-xs mt-0.5 font-medium",
                          isDark ? "text-slate-400" : "text-slate-500"
                        )}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* AI 热榜 + 最新动态 */}
            <section className="grid grid-cols-2 gap-6">
              {/* AI 热榜 */}
              <Card className={cn(
                "overflow-hidden",
                isDark 
                  ? "bg-[#12121a] border-white/5" 
                  : "bg-white border-slate-200/80 shadow-sm"
              )}>
                <div className={cn(
                  "h-1",
                  isDark 
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" 
                    : "bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"
                )} />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        isDark ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" : "bg-gradient-to-br from-amber-100 to-orange-100"
                      )}>
                        <TrendingUp className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-600")} />
                      </div>
                      <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>AI 热榜</span>
                    </div>
                    <Badge className={cn("text-xs", isDark ? "bg-amber-500/20 text-amber-400 border-0" : "bg-amber-100 text-amber-600 border-0")}>
                      <Flame className="h-3 w-3 mr-1" /> 实时
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hotListItems.map((item) => (
                    <div key={item.rank} className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <span className={cn(
                        'flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold',
                        item.rank === 1 
                          ? isDark ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                          : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                      )}>
                        {item.rank}
                      </span>
                      <span className={cn(
                        "flex-1 text-sm truncate",
                        isDark ? "text-slate-300" : "text-slate-700"
                      )}>
                        {item.title}
                      </span>
                      <span className={cn(
                        "text-xs shrink-0",
                        isDark ? "text-red-400" : "text-red-500"
                      )}>
                        {(item.heat / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 最新动态 */}
              <Card className={cn(
                isDark 
                  ? "bg-[#12121a] border-white/5" 
                  : "bg-white border-slate-200/80 shadow-sm"
              )}>
                <div className={cn(
                  "h-1",
                  isDark 
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" 
                    : "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                )} />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      isDark ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20" : "bg-gradient-to-br from-indigo-100 to-purple-100"
                    )}>
                      <Hash className={cn("h-4 w-4", isDark ? "text-indigo-400" : "text-indigo-600")} />
                    </div>
                    <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>最新动态</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {latestPosts.map((post, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold shrink-0",
                        isDark ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" : "bg-gradient-to-br from-indigo-400 to-purple-400 text-white"
                      )}>
                        {post.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-800")}>{post.name}</span>
                          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{post.time}</span>
                        </div>
                        <p className={cn("text-xs line-clamp-1 mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>{post.content}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* 资源页面内容 */}
        {activeTab === 'resources' && (
          <div className="animate-fade-in">
            <section>
              <Card className={cn(
                "overflow-hidden",
                isDark 
                  ? "bg-[#12121a] border-white/5" 
                  : "bg-white border-slate-200/80 shadow-sm"
              )}>
                <div className={cn(
                  "h-1",
                  isDark 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
                    : "bg-gradient-to-r from-indigo-400 to-purple-400"
                )} />
                <CardContent className="p-6">
                  {/* 搜索和分类 */}
                  <div className="flex gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索 AI 资源..."
                        className={cn(
                          "w-full h-10 pl-10 pr-4 rounded-xl border text-sm transition-all",
                          isDark
                            ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-300"
                        )}
                      />
                    </div>
                  </div>

                  {/* 分类筛选 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        !selectedCategory
                          ? isDark ? "bg-indigo-500 text-white" : "bg-indigo-500 text-white"
                          : isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      全部
                    </button>
                    {resourceCategories.slice(0, 8).map((cat) => {
                      const colors = colorMap[cat.id] || colorMap['default'];
                      const Icon = iconMap[cat.icon] || Sparkles;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            selectedCategory === cat.id
                              ? `bg-gradient-to-r ${colors.gradient} text-white`
                              : isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          <Icon className="h-3 w-3" />
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* 资源列表 */}
                  <div className="grid grid-cols-4 gap-4">
                    {filteredResources.slice(0, 16).map((resource) => {
                      const category = resourceCategories.find(c => c.id === resource.category);
                      const colors = colorMap[resource.category] || colorMap['default'];
                      const Icon = iconMap[category?.icon || 'sparkles'] || Sparkles;
                      
                      return (
                        <div 
                          key={resource.id}
                          className={cn(
                            "rounded-xl p-4 transition-all duration-200 cursor-pointer group",
                            isDark
                              ? "bg-[#18181b] hover:bg-[#1f1f23] border border-white/5 hover:border-indigo-500/30"
                              : "bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-lg mb-3",
                            `bg-gradient-to-br ${colors.gradient}`
                          )}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className={cn(
                            "text-sm font-semibold line-clamp-1 mb-1",
                            isDark ? "text-white" : "text-slate-800"
                          )}>
                            {resource.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs">
                            <Star className={cn("h-3 w-3", isDark ? "text-amber-400" : "text-amber-500")} />
                            <span className={isDark ? "text-slate-400" : "text-slate-500"}>{resource.rating}</span>
                            {resource.hot && (
                              <Badge className={cn(
                                "px-1 py-0.5 rounded text-[10px]",
                                isDark ? "bg-red-500/20 text-red-400 border-0" : "bg-red-100 text-red-500 border-0"
                              )}>
                                热门
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* 精品课程页面 */}
        {activeTab === 'premium' && (
          <div className="animate-fade-in">
            {/* 这里可以复用 /premium 页面的内容，暂时放一个简化版 */}
            <Card className={cn(
              "overflow-hidden",
              isDark 
                ? "bg-[#12121a] border-white/5" 
                : "bg-white border-slate-200/80 shadow-sm"
            )}>
              <div className={cn(
                "h-1",
                isDark 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                  : "bg-gradient-to-r from-amber-400 to-orange-400"
              )} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    isDark ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" : "bg-gradient-to-br from-amber-100 to-orange-100"
                  )}>
                    <Crown className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-600")} />
                  </div>
                  <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>精品课程</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                  精选最前沿的 AI 技术课程，由行业顶尖专家倾力打造。
                </p>
                <Button 
                  onClick={() => setActiveTab('home')}
                  className={cn(
                    "h-10 px-6 rounded-xl font-medium",
                    isDark ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-indigo-500 text-white"
                  )}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  前往精品课程
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 学习中心页面 */}
        {activeTab === 'learn' && (
          <div className="animate-fade-in">
            <Card className={cn(
              "overflow-hidden",
              isDark 
                ? "bg-[#12121a] border-white/5" 
                : "bg-white border-slate-200/80 shadow-sm"
            )}>
              <div className={cn(
                "h-1",
                isDark 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              )} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    isDark ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20" : "bg-gradient-to-br from-emerald-100 to-teal-100"
                  )}>
                    <Sparkles className={cn("h-4 w-4", isDark ? "text-emerald-400" : "text-emerald-600")} />
                  </div>
                  <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>学习中心</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                  系统化学习 AI 技能，完成每日任务获得积分。
                </p>
                <Button 
                  onClick={() => setActiveTab('home')}
                  className={cn(
                    "h-10 px-6 rounded-xl font-medium",
                    isDark ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-indigo-500 text-white"
                  )}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  前往学习中心
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 个人中心页面 */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            <Card className={cn(
              "overflow-hidden",
              isDark 
                ? "bg-[#12121a] border-white/5" 
                : "bg-white border-slate-200/80 shadow-sm"
            )}>
              <div className={cn(
                "h-1",
                isDark 
                  ? "bg-gradient-to-r from-pink-500 to-rose-500" 
                  : "bg-gradient-to-r from-pink-400 to-rose-400"
              )} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    isDark ? "bg-gradient-to-br from-pink-500/20 to-rose-500/20" : "bg-gradient-to-br from-pink-100 to-rose-100"
                  )}>
                    <Users className={cn("h-4 w-4", isDark ? "text-pink-400" : "text-pink-600")} />
                  </div>
                  <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>个人中心</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                  查看你的学习记录、收藏和成就。
                </p>
                <Button 
                  onClick={() => setActiveTab('home')}
                  className={cn(
                    "h-10 px-6 rounded-xl font-medium",
                    isDark ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-indigo-500 text-white"
                  )}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  前往个人中心
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
