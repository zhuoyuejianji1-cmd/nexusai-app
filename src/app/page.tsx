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

// 精品课程数据
const premiumCourses = [
  { id: 1, title: 'AI 全栈工程师实战班', desc: '从零打造企业级 AI 应用', students: 2847, rating: 4.9, price: 2999, gradient: 'from-violet-500 to-purple-500' },
  { id: 2, title: 'ChatGPT 与 Prompt Engineering', desc: '系统学习 Prompt 工程', students: 5623, rating: 4.8, price: 999, gradient: 'from-blue-500 to-cyan-500' },
  { id: 3, title: 'Midjourney 商业设计实战', desc: 'AI 生成视觉内容商业路径', students: 3412, rating: 4.7, price: 799, gradient: 'from-pink-500 to-rose-500' },
  { id: 4, title: 'Stable Diffusion 进阶指南', desc: 'ControlNet、Lora 训练核心技术', students: 2156, rating: 4.9, price: 1299, gradient: 'from-emerald-500 to-teal-500' },
  { id: 5, title: 'LangChain 与 Agent 开发', desc: '构建智能 Agent 系统', students: 1893, rating: 4.8, price: 1999, gradient: 'from-amber-500 to-orange-500' },
  { id: 6, title: '大模型微调实战 (LoRA)', desc: '掌握 LLM 微调核心技能', students: 1234, rating: 4.9, price: 2499, gradient: 'from-red-500 to-pink-500' },
];

// 今日任务
const todayTasks = [
  { id: 1, title: '完成 AI 基础课程第 3 章', desc: '学习机器学习核心概念', progress: 80, xp: 50 },
  { id: 2, title: '使用 ChatGPT 写一篇文章', desc: '练习 Prompt 技巧', progress: 100, xp: 30, completed: true },
  { id: 3, title: '阅读 AI 最新资讯', desc: '了解行业动态', progress: 60, xp: 20 },
];

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

// 用户数据
const mockUser = {
  nickname: 'AI探索者',
  points: 1250,
  level: 8,
  exp: 750,
  expToNext: 1000,
  is_vip: true,
  stats: { posts: 42, likes: 328, favorites: 15, comments: 89 }
};

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
          "relative overflow-hidden rounded-3xl",
          isDark ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-white/5" : "bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 border border-slate-200/80 shadow-xl"
        )}>
          <div className="absolute inset-0 overflow-hidden">
            <div className={cn("absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl", isDark ? "bg-indigo-500/10" : "bg-indigo-200/50")} />
            <div className={cn("absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl", isDark ? "bg-purple-500/10" : "bg-purple-200/50")} />
          </div>
          <div className="relative px-8 py-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("flex items-center justify-center h-16 w-16 rounded-xl", isDark ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl")}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={cn("font-heading text-4xl font-black", isDark ? "bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent")}>
                  NexusAI
                </h1>
                <p className={cn("text-xs font-medium tracking-wider uppercase", isDark ? "text-slate-500" : "text-slate-400")}>AI Learning Community</p>
              </div>
            </div>
            <h2 className={cn("text-xl font-semibold mb-3", isDark ? "text-white/90" : "text-slate-700")}>探索 AI · 分享知识 · 连接未来</h2>
            <div className={cn("flex items-center gap-6 p-4 rounded-xl", isDark ? "bg-white/5 border border-white/10" : "bg-white/80 border border-slate-200/50")}>
              {[{ value: '10,000+', label: '精品资源' }, { value: '500+', label: 'AI工具' }, { value: '1M+', label: '学习者' }].map((stat, i) => (
                <div key={i} className={cn("text-center px-6", i < 2 && (isDark ? "border-r border-white/10" : "border-r border-slate-200"))}>
                  <div className={cn("font-heading text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{stat.value}</div>
                  <div className={cn("text-xs mt-0.5 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 分类导航 */}
      <section>
        <h2 className={cn("font-heading text-lg font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-800")}>
          <Layers className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
          发现 AI 资源
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {resourceCategories.slice(0, 8).map((cat) => {
            const colors = colorMap[cat.id] || colorMap['default'];
            const Icon = iconMap[cat.icon] || Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setActiveTab('resources'); }}
                className={cn(
                  "p-4 rounded-xl transition-all duration-200 text-left",
                  isDark ? "bg-[#12121a] hover:bg-[#1a1a2e] border border-white/5 hover:border-indigo-500/30" : "bg-white hover:shadow-md border border-slate-200/50 hover:border-indigo-200"
                )}
              >
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg mb-3 bg-gradient-to-br " + colors.gradient)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className={cn("text-sm font-semibold mb-1", isDark ? "text-white" : "text-slate-800")}>{cat.name}</h3>
                <p className={cn("text-xs line-clamp-1", isDark ? "text-slate-500" : "text-slate-400")}>{cat.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 精品课程入口 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("font-heading text-lg font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-800")}>
            <Crown className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
            精品课程
          </h2>
          <button onClick={() => setActiveTab('premium')} className={cn("text-sm font-medium flex items-center gap-1", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-indigo-600")}>
            查看全部 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {premiumCourses.slice(0, 3).map((course) => (
            <div key={course.id} className={cn(
              "rounded-xl p-4 transition-all duration-200 cursor-pointer",
              isDark ? "bg-[#12121a] hover:bg-[#1a1a2e] border border-white/5 hover:border-indigo-500/30" : "bg-white hover:shadow-md border border-slate-200/50"
            )}>
              <div className={cn("h-10 w-10 rounded-lg mb-3 bg-gradient-to-br " + course.gradient)} />
              <h3 className={cn("text-sm font-bold mb-1", isDark ? "text-white" : "text-slate-800")}>{course.title}</h3>
              <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>{course.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className={cn("h-3 w-3", isDark ? "text-amber-400" : "text-amber-500")} />
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{course.rating}</span>
                </div>
                <span className={cn("text-sm font-bold", isDark ? "text-amber-400" : "text-amber-600")}>¥{course.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 热榜 + 动态 */}
      <section className="grid grid-cols-2 gap-6">
        <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
          <div className={cn("h-1", isDark ? "bg-gradient-to-r from-amber-500 to-red-500" : "bg-gradient-to-r from-amber-400 to-red-400")} />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-600")} />
              <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>AI 热榜</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotListItems.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/5 cursor-pointer">
                <span className={cn(
                  'flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold',
                  item.rank === 1 ? (isDark ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white')
                    : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                )}>{item.rank}</span>
                <span className={cn("flex-1 text-sm truncate", isDark ? "text-slate-300" : "text-slate-700")}>{item.title}</span>
                <span className={cn("text-xs", isDark ? "text-red-400" : "text-red-500")}>{Math.round(item.heat/1000)}k</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
          <div className={cn("h-1", isDark ? "bg-gradient-to-r from-indigo-500 to-pink-500" : "bg-gradient-to-r from-indigo-400 to-pink-400")} />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Hash className={cn("h-4 w-4", isDark ? "text-indigo-400" : "text-indigo-600")} />
              <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>最新动态</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestPosts.map((post, i) => (
              <div key={i} className="flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-white/5">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold", isDark ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" : "bg-gradient-to-br from-indigo-400 to-purple-400 text-white")}>
                  {post.name[0]}
                </div>
                <div className="flex-1">
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
  );

  // ==================== 资源页 ====================
  const renderResources = () => (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        isDark ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className={cn("font-heading text-2xl font-bold text-white mb-1")}>AI 资源库</h1>
            <p className={cn("text-white/70 text-sm")}>精选 {resources.length}+ 优质资源，持续更新</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4">
              <div className={cn("text-2xl font-bold text-white")}>{resources.length}+</div>
              <div className={cn("text-xs text-white/60")}>资源总数</div>
            </div>
            <div className="text-center px-4 border-l border-white/20">
              <div className={cn("text-2xl font-bold text-white")}>{resourceCategories.length}</div>
              <div className={cn("text-xs text-white/60")}>分类</div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
        <CardContent className="p-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索 AI 资源..."
                className={cn(
                  "w-full h-10 pl-10 pr-4 rounded-xl border text-sm",
                  isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                )}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory(null)} className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              !selectedCategory ? "bg-indigo-500 text-white" : isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"
            )}>全部</button>
            {resourceCategories.slice(0, 10).map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    selectedCategory === cat.id ? "bg-indigo-500 text-white" : isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"
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
              "rounded-xl p-4 transition-all duration-200 cursor-pointer group",
              isDark ? "bg-[#12121a] hover:bg-[#1a1a2e] border border-white/5 hover:border-indigo-500/30" : "bg-white hover:shadow-md border border-slate-200/50"
            )}>
              <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg mb-3 bg-gradient-to-br " + colors.gradient)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className={cn("text-sm font-semibold line-clamp-1 mb-1", isDark ? "text-white" : "text-slate-800")}>{resource.title}</h3>
              <p className={cn("text-xs line-clamp-1 mb-2", isDark ? "text-slate-500" : "text-slate-400")}>{resource.description}</p>
              <div className="flex items-center gap-2">
                <Star className={cn("h-3 w-3", isDark ? "text-amber-400" : "text-amber-500")} />
                <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{resource.rating}</span>
                {resource.hot && <Badge className={cn("px-1.5 py-0.5 rounded text-[10px]", isDark ? "bg-red-500/20 text-red-400 border-0" : "bg-red-100 text-red-500 border-0")}>热门</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ==================== 精品课程页 ====================
  const renderPremium = () => (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        isDark ? "bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5" : "bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-6 w-6 text-white" />
            <h1 className={cn("font-heading text-2xl font-bold text-white")}>精品课程</h1>
          </div>
          <p className={cn("text-white/70 text-sm mb-4")}>行业顶级讲师 · 实战驱动学习 · 系统化成长路径</p>
          <div className="flex items-center gap-6">
            {[{ value: '9', label: '精选课程' }, { value: '20,000+', label: '学员总数' }, { value: '98%', label: '好评率' }].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={cn("text-xl font-bold text-white")}>{stat.value}</div>
                <div className={cn("text-xs text-white/60")}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 会员权益 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Crown, title: '专属会员群', desc: '与讲师实时交流' },
          { icon: Shield, title: '永久更新', desc: '内容持续迭代' },
          { icon: Zap, title: '优先体验', desc: '最新功能抢先学' },
          { icon: CheckCircle2, title: '退款保障', desc: '7天无理由退款' },
        ].map((item, i) => (
          <div key={i} className={cn(
            "flex items-center gap-3 p-4 rounded-xl",
            isDark ? "bg-[#12121a] border border-white/5" : "bg-white border border-slate-200/50"
          )}>
            <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg", isDark ? "bg-amber-500/20" : "bg-amber-100")}>
              <item.icon className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
            </div>
            <div>
              <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-800")}>{item.title}</h3>
              <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-3 gap-4">
        {premiumCourses.map((course) => (
          <div key={course.id} className={cn(
            "rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group",
            isDark ? "bg-[#12121a] border border-white/5 hover:border-indigo-500/30" : "bg-white border border-slate-200/50 hover:shadow-lg"
          )}>
            <div className={cn("h-20 bg-gradient-to-br " + course.gradient + " relative")}>
              <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" />
            </div>
            <div className="p-4">
              <h3 className={cn("text-sm font-bold mb-1", isDark ? "text-white" : "text-slate-800")}>{course.title}</h3>
              <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>{course.desc}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className={cn("h-3 w-3", isDark ? "text-amber-400" : "text-amber-500")} />
                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className={cn("h-3 w-3", isDark ? "text-slate-400" : "text-slate-500")} />
                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{(course.students/1000).toFixed(1)}k</span>
                  </div>
                </div>
                <span className={cn("text-sm font-bold", isDark ? "text-amber-400" : "text-amber-600")}>¥{course.price}</span>
              </div>
              <Button className={cn("w-full h-8 rounded-lg text-xs font-medium", isDark ? "bg-indigo-500 text-white hover:bg-indigo-400" : "bg-indigo-500 text-white hover:bg-indigo-600")}>
                立即购买
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== 学习中心 ====================
  const renderLearn = () => (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        isDark ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600" : "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative px-6 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-6 w-6 text-white" />
              <h1 className={cn("font-heading text-2xl font-bold text-white")}>学习中心</h1>
            </div>
            <p className={cn("text-white/70 text-sm")}>系统化学习 AI 技能，完成每日任务获得积分</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center px-4">
              <div className={cn("text-2xl font-bold text-white")}>23</div>
              <div className={cn("text-xs text-white/60")}>学习天数</div>
            </div>
            <div className="text-center px-4 border-l border-white/20">
              <div className={cn("text-2xl font-bold text-white")}>1,250</div>
              <div className={cn("text-xs text-white/60")}>积分</div>
            </div>
          </div>
        </div>
      </div>

      {/* 今日任务 */}
      <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className={cn("h-4 w-4", isDark ? "text-emerald-400" : "text-emerald-600")} />
              <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>今日任务</span>
            </div>
            <Badge className={cn("text-xs", isDark ? "bg-emerald-500/20 text-emerald-400 border-0" : "bg-emerald-100 text-emerald-600 border-0")}>
              2/3 完成
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {todayTasks.map((task) => (
            <div key={task.id} className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-[#18181b]" : "bg-slate-50"
            )}>
              <div className={cn(
                "flex items-center justify-center h-10 w-10 rounded-lg mb-3",
                task.completed ? (isDark ? "bg-emerald-500/20" : "bg-emerald-100") : (isDark ? "bg-indigo-500/20" : "bg-indigo-100")
              )}>
                {task.completed ? <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-emerald-400" : "text-emerald-600")} /> : <BookOpen className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />}
              </div>
              <h3 className={cn("text-sm font-semibold mb-1", isDark ? "text-white" : "text-slate-800")}>{task.title}</h3>
              <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>{task.desc}</p>
              <Progress value={task.progress} className={cn("h-1.5 mb-2", isDark ? "[&>div]:bg-emerald-500" : "")} />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-medium", isDark ? "text-amber-400" : "text-amber-600")}>+{task.xp} XP</span>
                <Badge className={cn("text-xs", task.completed ? (isDark ? "bg-emerald-500/20 text-emerald-400 border-0" : "bg-emerald-100 text-emerald-600 border-0") : (isDark ? "bg-indigo-500/20 text-indigo-400 border-0" : "bg-indigo-100 text-indigo-600 border-0"))}>
                  {task.completed ? '已完成' : '进行中'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 学习路径 */}
      <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendUp className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-blue-600")} />
            <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>成长路径</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {learningPaths.map((path) => (
            <div key={path.id} className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-[#18181b]" : "bg-slate-50"
            )}>
              <div className={cn("h-10 w-10 rounded-lg mb-3 bg-gradient-to-br " + path.gradient)} />
              <h3 className={cn("text-sm font-semibold mb-1", isDark ? "text-white" : "text-slate-800")}>{path.title}</h3>
              <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>{path.desc}</p>
              <Progress value={path.progress} className={cn("h-1.5 mb-2", isDark ? "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" : "")} />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{path.completed}/{path.courses} 课程</span>
                <Badge className={cn("text-xs", isDark ? "bg-white/10 text-white border-0" : "bg-slate-200 text-slate-600 border-0")}>{path.progress}%</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 徽章墙 */}
      <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Award className={cn("h-4 w-4", isDark ? "text-amber-400" : "text-amber-600")} />
            <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>我的徽章</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className={cn(
                "flex flex-col items-center p-4 rounded-xl",
                isDark ? badge.earned ? "bg-[#18181b]" : "bg-[#0a0a0f] opacity-50" : badge.earned ? "bg-slate-50" : "bg-slate-100 opacity-50"
              )}>
                <div className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-xl mb-2",
                  badge.earned ? "bg-gradient-to-br " + badge.gradient : (isDark ? "bg-slate-800" : "bg-slate-200")
                )}>
                  <badge.icon className={cn("h-6 w-6", badge.earned ? "text-white" : (isDark ? "text-slate-600" : "text-slate-400"))} />
                </div>
                <span className={cn("text-xs font-medium", isDark ? "text-white" : "text-slate-700")}>{badge.name}</span>
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
        "overflow-hidden",
        isDark ? "bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5" : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
      )}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <CardContent className="relative px-6 py-6">
          <div className="flex items-center gap-6">
            <div className={cn("flex items-center justify-center h-20 w-20 rounded-2xl text-2xl font-bold", isDark ? "bg-gradient-to-br from-indigo-500 to-purple-500" : "bg-white/20")}>
              {mockUser.nickname[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className={cn("font-heading text-xl font-bold text-white")}>{mockUser.nickname}</h1>
                {mockUser.is_vip && <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">VIP</Badge>}
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className={cn("text-sm text-white/70")}>Lv.{mockUser.level}</span>
                <div className="flex items-center gap-2">
                  <div className={cn("w-24 h-2 rounded-full overflow-hidden", isDark ? "bg-white/20" : "bg-white/30")}>
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: `${(mockUser.exp/mockUser.expToNext)*100}%` }} />
                  </div>
                  <span className={cn("text-xs text-white/60")}>{mockUser.exp}/{mockUser.expToNext}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className={cn("text-sm font-semibold text-white")}>{mockUser.points}</span>
                </div>
              </div>
            </div>
            <Button className={cn("h-10 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white border-0")}>
              <Edit3 className="h-4 w-4 mr-2" />
              编辑资料
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 统计 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '动态', value: mockUser.stats.posts, icon: FileText, color: 'text-blue-500' },
          { label: '获赞', value: mockUser.stats.likes, icon: Heart, color: 'text-pink-500' },
          { label: '收藏', value: mockUser.stats.favorites, icon: Bookmark, color: 'text-amber-500' },
          { label: '评论', value: mockUser.stats.comments, icon: MessageCircle, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <Card key={i} className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg", isDark ? "bg-white/5" : "bg-slate-100")}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <div className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-800")}>{stat.value}</div>
                <div className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 我的动态 */}
      <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <FileText className={cn("h-4 w-4", isDark ? "text-indigo-400" : "text-indigo-600")} />
            <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>我的动态</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { content: '完成了今天的 AI 学习任务，感觉收获满满！特别是关于 Prompt Engineering 的部分。', time: '2小时前', likes: 42, comments: 8 },
            { content: '尝试用 Midjourney 生成了一套品牌视觉设计，效果超出预期！', time: '1天前', likes: 128, comments: 23 },
          ].map((post, i) => (
            <div key={i} className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-[#18181b]" : "bg-slate-50"
            )}>
              <p className={cn("text-sm mb-3", isDark ? "text-slate-200" : "text-slate-700")}>{post.content}</p>
              <div className="flex items-center gap-4">
                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{post.time}</span>
                <div className="flex items-center gap-1">
                  <Heart className={cn("h-3 w-3", isDark ? "text-slate-400" : "text-slate-500")} />
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className={cn("h-3 w-3", isDark ? "text-slate-400" : "text-slate-500")} />
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      )}
      
      <Navbar onTabChange={setActiveTab} />
      
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'resources' && renderResources()}
          {activeTab === 'premium' && renderPremium()}
          {activeTab === 'learn' && renderLearn()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </main>
    </div>
  );
}
