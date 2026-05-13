'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Layers,
  Star,
  Heart,
  Crown,
  Bookmark,
  Share2,
  MessageCircle,
  Search,
  BookOpen,
  Target,
  Trophy,
  Calendar,
  Award,
  Zap,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Shield,
  Play,
  Clock,
  TrendingUp as TrendUp,
  Edit3,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

// 数据从 API 获取，不在前端暴露硬编码数据



// 学习路径
const learningPaths = [
  { id: 1, title: 'AI 入门', desc: '零基础学习人工智能', progress: 65, courses: 8, completed: 5, gradient: 'from-emerald-500 to-teal-500' },
  { id: 2, title: 'Prompt 工程', desc: '掌握 AI 对话交互技巧', progress: 40, courses: 6, completed: 2, gradient: 'from-amber-500 to-orange-500' },
  { id: 3, title: 'AI 图像创作', desc: 'Midjourney & Stable Diffusion', progress: 20, courses: 10, completed: 2, gradient: 'from-pink-500 to-rose-500' },
];

// 徽章
const badges = [
  { id: 1, name: '初学者', icon: Star, gradient: 'from-amber-400 to-orange-400', earned: true },
  { id: 2, name: '连续7天', icon: Flame, gradient: 'from-red-400 to-pink-400', earned: true },
  { id: 3, name: 'Prompt 大师', icon: Zap, gradient: 'from-yellow-400 to-amber-400', earned: true },
  { id: 4, name: 'AI 探索者', icon: Target, gradient: 'from-emerald-400 to-teal-400', earned: false },
];



type TabType = 'home' | 'resources' | 'learn' | 'profile';

export default function HomePage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // API 数据状态
  const [hotList, setHotList] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
    setIsLoaded(true);
  }, []);

  // 从 API 获取数据
  useEffect(() => {
    if (!isLoaded) return;
    Promise.all([
      fetch('/api/hot-list').then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/posts?limit=4').then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/tasks').then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/auth/me').then(r => r.json()).catch(() => ({ user: null })),
    ]).then(([hotData, postsData, tasksData, userData]) => {
      if (hotData.data?.length) setHotList(hotData.data);
      if (postsData.data?.length) setPosts(postsData.data);
      if (tasksData.data?.length) setTasks(tasksData.data);
      if (userData.user) setUser(userData.user);
    });
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesSearch = !searchQuery || resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==================== 首页 ====================
  const renderHome = () => (
    <div className="space-y-8">
      {/* Hero */}
      <section>
        <div className={cn(
          "relative overflow-hidden rounded-[2rem]",
          isDark 
            ? "bg-gradient-to-br from-[#2a1f1a] via-[#1f1a16] to-[#2a2018] border border-white/5" 
            : "bg-gradient-to-br from-orange-50 via-amber-50/60 to-yellow-50/40 border border-orange-200/30 shadow-warm"
        )}>
          <div className="absolute inset-0 overflow-hidden">
            <div className={cn("absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl", isDark ? "bg-orange-500/8" : "bg-orange-200/40")} />
            <div className={cn("absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl", isDark ? "bg-amber-500/8" : "bg-amber-200/30")} />
            <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl", isDark ? "bg-yellow-500/5" : "bg-yellow-100/40")} />
          </div>
          <div className="relative px-10 py-12 flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-8">
              <div className={cn("flex items-center justify-center h-16 w-16 rounded-2xl shadow-lg", isDark ? "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 shadow-orange-500/20" : "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 shadow-orange-500/15")}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className={cn("font-heading text-4xl font-black", isDark ? "text-stone-100" : "text-stone-800")}>
                  NexusAI
                </h1>
                <p className={cn("text-xs font-medium tracking-wider uppercase mt-1", isDark ? "text-stone-500" : "text-stone-400")}>AI Learning Community</p>
              </div>
            </div>
            <h2 className={cn("text-2xl font-semibold mb-3", isDark ? "text-stone-200" : "text-stone-700")}>探索 AI · 分享知识 · 连接未来</h2>
            <p className={cn("text-sm mb-8 max-w-md", isDark ? "text-stone-400" : "text-stone-500")}>加入最温暖的 AI 学习社区，与千万学习者一起成长</p>
            <div className={cn("flex items-center gap-8 p-5 rounded-2xl", isDark ? "bg-white/5 border border-white/8" : "bg-white/70 border border-orange-200/30 shadow-sm")}>
              {[{ value: '10,000+', label: '精品资源' }, { value: '500+', label: 'AI工具' }, { value: '1M+', label: '学习者' }].map((stat, i) => (
                <div key={i} className={cn("text-center px-6", i < 2 && (isDark ? "border-r border-white/10" : "border-r border-orange-200/30"))}>
                  <div className={cn("font-heading text-2xl font-bold", isDark ? "text-stone-100" : "text-stone-800")}>{stat.value}</div>
                  <div className={cn("text-xs mt-1 font-medium", isDark ? "text-stone-500" : "text-stone-500")}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 分类导航 */}
      <section>
        <h2 className={cn("font-heading text-lg font-bold mb-5 flex items-center gap-2", isDark ? "text-stone-100" : "text-stone-800")}>
          <Layers className={cn("h-5 w-5", isDark ? "text-orange-400" : "text-orange-500")} />
          发现 AI 资源
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {resourceCategories.slice(0, 8).map((cat) => {
            const colors = colorMap[cat.id] || colorMap['default'];
            const Icon = iconMap[cat.icon] || Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setActiveTab('resources'); }}
                className={cn(
                  "p-5 rounded-2xl transition-all duration-300 text-left hover-warm",
                  isDark ? "bg-[#1c1917] hover:bg-[#2a2420] border border-white/5 hover:border-orange-500/20" : "bg-white border border-stone-200/40 hover:border-orange-200/60"
                )}
              >
                <div className={cn("flex items-center justify-center h-11 w-11 rounded-xl mb-3 bg-gradient-to-br " + colors.gradient)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className={cn("text-sm font-semibold mb-1", isDark ? "text-stone-100" : "text-stone-800")}>{cat.name}</h3>
                <p className={cn("text-xs line-clamp-1", isDark ? "text-stone-500" : "text-stone-500")}>{cat.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 精品课程入口 */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className={cn("font-heading text-lg font-bold flex items-center gap-2", isDark ? "text-stone-100" : "text-stone-800")}>
            <Crown className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-500")} />
            精品课程
          </h2>
          <Link href="/premium" className={cn("text-sm font-medium flex items-center gap-1 group", isDark ? "text-stone-400 hover:text-stone-200" : "text-stone-500 hover:text-orange-600")}>
            查看全部 <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        <Link href="/premium" className="block group">
          <div className={cn(
            "rounded-2xl p-7 transition-all duration-300 hover-warm",
            isDark ? "bg-gradient-to-br from-amber-500/8 to-orange-500/8 border border-amber-500/15 hover:border-amber-500/30" : "bg-gradient-to-br from-amber-50/80 to-orange-50/60 border border-amber-200/30 hover:border-amber-300/50"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={cn("flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/15")}>
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className={cn("font-heading font-bold text-base mb-1", isDark ? "text-stone-100" : "text-stone-800")}>5000+ 精品课程</h3>
                  <p className={cn("text-xs", isDark ? "text-stone-400" : "text-stone-500")}>AI、副业、编程、设计... 持续更新中</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", isDark ? "text-amber-400" : "text-orange-600")}>浏览课程</span>
                <ChevronRight className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-orange-600")} />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 热榜 + 动态 */}
      <section className="grid grid-cols-2 gap-6">
        <Card className={cn("rounded-2xl overflow-hidden", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
          <div className={cn("h-1.5", isDark ? "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" : "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400")} />
          <CardHeader className="pb-3 pt-5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className={cn("h-4 w-4", isDark ? "text-orange-400" : "text-orange-500")} />
              <span className={cn("font-heading font-bold", isDark ? "text-stone-100" : "text-stone-800")}>AI 热榜</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hotList.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-orange-500/5 cursor-pointer transition-colors duration-200">
                <span className={cn(
                  'flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold',
                  item.rank === 1 ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm'
                    : item.rank === 2 ? 'bg-gradient-to-br from-amber-400 to-yellow-400 text-white shadow-sm'
                    : item.rank === 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-300 text-white shadow-sm'
                    : isDark ? 'bg-stone-700 text-stone-400' : 'bg-stone-200 text-stone-500'
                )}>{item.rank}</span>
                <span className={cn("flex-1 text-sm truncate", isDark ? "text-stone-300" : "text-stone-700")}>{item.title}</span>
                <span className={cn("text-xs font-medium", isDark ? "text-orange-400" : "text-orange-500")}>{Math.round(item.heat/1000)}k</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cn("rounded-2xl overflow-hidden", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
          <div className={cn("h-1.5", isDark ? "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" : "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400")} />
          <CardHeader className="pb-3 pt-5">
            <CardTitle className="flex items-center gap-2">
              <Hash className={cn("h-4 w-4", isDark ? "text-orange-400" : "text-orange-500")} />
              <span className={cn("font-heading font-bold", isDark ? "text-stone-100" : "text-stone-800")}>最新动态</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {posts.map((post, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-orange-500/5 transition-colors duration-200">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold", isDark ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white" : "bg-gradient-to-br from-orange-400 to-amber-400 text-white")}>
                  {post.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium", isDark ? "text-stone-200" : "text-stone-800")}>{post.name}</span>
                    <span className={cn("text-xs", isDark ? "text-stone-500" : "text-stone-400")}>{post.time}</span>
                  </div>
                  <p className={cn("text-xs line-clamp-1 mt-0.5", isDark ? "text-stone-400" : "text-stone-500")}>{post.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );

  // ==================== 资源页 ====================
  const renderResources = () => (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-3xl",
        isDark ? "bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600" : "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className={cn("font-heading text-3xl font-bold text-white mb-2")}>AI 资源库</h1>
            <p className={cn("text-white/80 text-sm")}>精选 {resources.length}+ 优质资源，持续更新</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center px-4">
              <div className={cn("text-2xl font-bold text-white")}>{resources.length}+</div>
              <div className={cn("text-xs text-white/70")}>资源总数</div>
            </div>
            <div className="text-center px-4 border-l border-white/20">
              <div className={cn("text-2xl font-bold text-white")}>{resourceCategories.length}</div>
              <div className={cn("text-xs text-white/70")}>分类</div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card className={cn("rounded-2xl", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
        <CardContent className="p-5">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索 AI 资源..."
                className={cn(
                  "w-full h-11 pl-10 pr-4 rounded-xl border text-sm transition-all duration-300",
                  isDark ? "bg-white/5 border-white/10 text-white placeholder:text-stone-500 focus:border-orange-500/40" : "bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:border-orange-300 focus:bg-white"
                )}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory(null)} className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300",
              !selectedCategory ? "bg-orange-500 text-white shadow-sm" : isDark ? "bg-white/5 text-stone-400 hover:bg-white/10" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}>全部</button>
            {resourceCategories.slice(0, 10).map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300",
                    selectedCategory === cat.id ? "bg-orange-500 text-white shadow-sm" : isDark ? "bg-white/5 text-stone-400 hover:bg-white/10" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 资源列表 */}
      <div className="grid grid-cols-4 gap-4">
        {filteredResources.slice(0, 20).map((resource) => {
          const category = resourceCategories.find(c => c.id === resource.category);
          const colors = colorMap[resource.category] || colorMap['default'];
          const Icon = iconMap[category?.icon || 'sparkles'] || Sparkles;
          return (
            <div key={resource.id} className={cn(
              "rounded-2xl p-5 transition-all duration-300 cursor-pointer group hover-warm",
              isDark ? "bg-[#1c1917] hover:bg-[#2a2420] border border-white/5 hover:border-orange-500/20" : "bg-white border border-stone-200/40 hover:border-orange-200/50"
            )}>
              <div className={cn("flex items-center justify-center h-11 w-11 rounded-xl mb-3 bg-gradient-to-br " + colors.gradient)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className={cn("text-sm font-semibold line-clamp-1 mb-1", isDark ? "text-stone-100" : "text-stone-800")}>{resource.title}</h3>
              <p className={cn("text-xs line-clamp-1 mb-3", isDark ? "text-stone-500" : "text-stone-500")}>{resource.description}</p>
              <div className="flex items-center gap-2">
                <Star className={cn("h-3 w-3", isDark ? "text-amber-400" : "text-amber-500")} />
                <span className={cn("text-xs", isDark ? "text-stone-400" : "text-stone-500")}>{resource.rating}</span>
                {resource.hot && <Badge className={cn("px-2 py-0.5 rounded-md text-[10px]", isDark ? "bg-orange-500/20 text-orange-400 border-0" : "bg-orange-100 text-orange-600 border-0")}>热门</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ==================== 学习中心 ====================
  const renderLearn = () => (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-3xl",
        isDark ? "bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600" : "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative px-8 py-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/20">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h1 className={cn("font-heading text-2xl font-bold text-white")}>学习中心</h1>
            </div>
            <p className={cn("text-white/80 text-sm")}>系统化学习 AI 技能，完成每日任务获得积分</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center px-4">
              <div className={cn("text-2xl font-bold text-white")}>23</div>
              <div className={cn("text-xs text-white/70")}>学习天数</div>
            </div>
            <div className="text-center px-4 border-l border-white/20">
              <div className={cn("text-2xl font-bold text-white")}>1,250</div>
              <div className={cn("text-xs text-white/70")}>积分</div>
            </div>
          </div>
        </div>
      </div>

      {/* 今日任务 */}
      <Card className={cn("rounded-2xl", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className={cn("h-4 w-4", isDark ? "text-orange-400" : "text-orange-500")} />
              <span className={cn("font-heading font-bold", isDark ? "text-stone-100" : "text-stone-800")}>今日任务</span>
            </div>
            <Badge className={cn("text-xs", isDark ? "bg-orange-500/20 text-orange-400 border-0" : "bg-orange-100 text-orange-600 border-0")}>
              2/3 完成
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 pt-0">
          {tasks.map((task) => (
            <div key={task.id} className={cn(
              "p-5 rounded-2xl",
              isDark ? "bg-[#2a2420]" : "bg-stone-50/80"
            )}>
              <div className={cn(
                "flex items-center justify-center h-10 w-10 rounded-xl mb-3",
                task.completed ? (isDark ? "bg-orange-500/20" : "bg-orange-100") : (isDark ? "bg-amber-500/20" : "bg-amber-100")
              )}>
                {task.completed ? <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-orange-400" : "text-orange-600")} /> : <BookOpen className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />}
              </div>
              <h3 className={cn("text-sm font-semibold mb-1", isDark ? "text-stone-100" : "text-stone-800")}>{task.title}</h3>
              <p className={cn("text-xs mb-3", isDark ? "text-stone-500" : "text-stone-500")}>{task.desc}</p>
              <Progress value={task.progress} className={cn("h-1.5 mb-2", isDark ? "[&>div]:bg-orange-500" : "")} />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-medium", isDark ? "text-amber-400" : "text-amber-600")}>+{task.xp} XP</span>
                <Badge className={cn("text-xs", task.completed ? (isDark ? "bg-orange-500/20 text-orange-400 border-0" : "bg-orange-100 text-orange-600 border-0") : (isDark ? "bg-amber-500/20 text-amber-400 border-0" : "bg-amber-100 text-amber-600 border-0"))}>
                  {task.completed ? '已完成' : '进行中'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 学习路径 */}
      <Card className={cn("rounded-2xl", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center gap-2">
            <TrendUp className={cn("h-4 w-4", isDark ? "text-orange-400" : "text-orange-500")} />
            <span className={cn("font-heading font-bold", isDark ? "text-stone-100" : "text-stone-800")}>成长路径</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 pt-0">
          {learningPaths.map((path) => (
            <div key={path.id} className={cn(
              "p-5 rounded-2xl",
              isDark ? "bg-[#2a2420]" : "bg-stone-50/80"
            )}>
              <div className={cn("h-10 w-10 rounded-xl mb-3 bg-gradient-to-br " + path.gradient)} />
              <h3 className={cn("text-sm font-semibold mb-1", isDark ? "text-stone-100" : "text-stone-800")}>{path.title}</h3>
              <p className={cn("text-xs mb-3", isDark ? "text-stone-500" : "text-stone-500")}>{path.desc}</p>
              <Progress value={path.progress} className={cn("h-1.5 mb-2", isDark ? "[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-amber-500" : "")} />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs", isDark ? "text-stone-400" : "text-stone-500")}>{path.completed}/{path.courses} 课程</span>
                <Badge className={cn("text-xs", isDark ? "bg-white/8 text-stone-300 border-0" : "bg-stone-200 text-stone-600 border-0")}>{path.progress}%</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 徽章墙 */}
      <Card className={cn("rounded-2xl", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center gap-2">
            <Award className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-500")} />
            <span className={cn("font-heading font-bold", isDark ? "text-stone-100" : "text-stone-800")}>我的徽章</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className={cn(
                "flex flex-col items-center p-5 rounded-2xl",
                isDark ? badge.earned ? "bg-[#2a2420]" : "bg-[#1c1917] opacity-50" : badge.earned ? "bg-stone-50/80" : "bg-stone-100 opacity-50"
              )}>
                <div className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-xl mb-2",
                  badge.earned ? "bg-gradient-to-br " + badge.gradient : (isDark ? "bg-stone-800" : "bg-stone-200")
                )}>
                  <badge.icon className={cn("h-6 w-6", badge.earned ? "text-white" : (isDark ? "text-stone-600" : "text-stone-400"))} />
                </div>
                <span className={cn("text-xs font-medium", isDark ? "text-stone-100" : "text-stone-700")}>{badge.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== 个人中心 ====================
  const renderProfile = () => (
    <div className="space-y-6">
      {/* 用户信息 */}
      <Card className={cn(
        "overflow-hidden rounded-3xl",
        isDark ? "bg-gradient-to-br from-[#2a1f1a] via-[#1f1a16] to-[#2a2018] border border-white/5" : "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <CardContent className="relative px-8 py-8">
          <div className="flex items-center gap-6">
            <div className={cn("flex items-center justify-center h-20 w-20 rounded-2xl text-2xl font-bold shadow-lg", isDark ? "bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-500/20" : "bg-white/20")}>
              {user?.nickname?.[0] || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className={cn("font-heading text-xl font-bold text-white")}>{user?.nickname || 'AI探索者'}</h1>
                {user?.is_vip && <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">VIP</Badge>}
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className={cn("text-sm text-white/80")}>Lv.{user?.level || 8}</span>
                <div className="flex items-center gap-2">
                  <div className={cn("w-24 h-2 rounded-full overflow-hidden", isDark ? "bg-white/20" : "bg-white/30")}>
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: `${((user?.exp || 750)/(user?.expToNext || 1000))*100}%` }} />
                  </div>
                  <span className={cn("text-xs text-white/70")}>{user?.exp || 750}/{user?.expToNext || 1000}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className={cn("text-sm font-semibold text-white")}>{user?.points || 1250}</span>
                </div>
              </div>
            </div>
            <Button className={cn("h-10 px-5 rounded-xl bg-white/15 hover:bg-white/25 text-white border-0 transition-all duration-300")}>
              <Edit3 className="h-4 w-4 mr-2" />
              编辑资料
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 统计 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '动态', value: user?.stats?.posts ?? 42, icon: FileText, color: 'text-orange-500' },
          { label: '获赞', value: user?.stats?.likes ?? 328, icon: Heart, color: 'text-rose-500' },
          { label: '收藏', value: user?.stats?.favorites ?? 15, icon: Bookmark, color: 'text-amber-500' },
          { label: '评论', value: user?.stats?.comments ?? 89, icon: MessageCircle, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <Card key={i} className={cn("rounded-2xl", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("flex items-center justify-center h-10 w-10 rounded-xl", isDark ? "bg-white/5" : "bg-stone-100"))}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <div className={cn("text-xl font-bold", isDark ? "text-stone-100" : "text-stone-800")}>{stat.value}</div>
                <div className={cn("text-xs", isDark ? "text-stone-500" : "text-stone-500")}>{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 我的动态 */}
      <Card className={cn("rounded-2xl", isDark ? "bg-[#1c1917] border-white/5" : "bg-white border-stone-200/40 shadow-warm")}>
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center gap-2">
            <FileText className={cn("h-4 w-4", isDark ? "text-orange-400" : "text-orange-500")} />
            <span className={cn("font-heading font-bold", isDark ? "text-stone-100" : "text-stone-800")}>我的动态</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {[
            { content: '完成了今天的 AI 学习任务，感觉收获满满！特别是关于 Prompt Engineering 的部分。', time: '2小时前', likes: 42, comments: 8 },
            { content: '尝试用 Midjourney 生成了一套品牌视觉设计，效果超出预期！', time: '1天前', likes: 128, comments: 23 },
          ].map((post, i) => (
            <div key={i} className={cn(
              "p-5 rounded-2xl",
              isDark ? "bg-[#2a2420]" : "bg-stone-50/80"
            )}>
              <p className={cn("text-sm mb-3", isDark ? "text-stone-300" : "text-stone-700")}>{post.content}</p>
              <div className="flex items-center gap-4">
                <span className={cn("text-xs", isDark ? "text-stone-500" : "text-stone-400")}>{post.time}</span>
                <div className="flex items-center gap-1">
                  <Heart className={cn("h-3 w-3", isDark ? "text-stone-500" : "text-stone-400")} />
                  <span className={cn("text-xs", isDark ? "text-stone-500" : "text-stone-400")}>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className={cn("h-3 w-3", isDark ? "text-stone-500" : "text-stone-400")} />
                  <span className={cn("text-xs", isDark ? "text-stone-500" : "text-stone-400")}>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isDark ? "bg-[#171412] text-stone-100" : "bg-[#fefdfb] text-stone-900")}>
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/12 via-amber-500/8 to-transparent rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      )}
      
      <Navbar onTabChange={setActiveTab} theme={theme} onThemeToggle={toggleTheme} />
      
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'resources' && renderResources()}
          {activeTab === 'learn' && renderLearn()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </main>
    </div>
  );
}
