'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Star, 
  Eye,
  Sun,
  Moon,
  ArrowLeft,
  Crown,
  Flame,
  FileText,
  Globe,
  Layers,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { resourceCategories, resources, iconMap as resourceIconMap } from '@/lib/resources';

// 分类颜色映射
const colorMap: Record<string, { gradient: string; text: string; bg: string }> = {
  'ai-tools': { gradient: 'from-violet-500 to-purple-500', text: 'text-violet-500', bg: 'bg-violet-500/10' },
  'ai-chat': { gradient: 'from-blue-500 to-cyan-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
  'ai-image': { gradient: 'from-pink-500 to-rose-500', text: 'text-pink-500', bg: 'bg-pink-500/10' },
  'ai-video': { gradient: 'from-red-500 to-orange-500', text: 'text-red-500', bg: 'bg-red-500/10' },
  'ai-music': { gradient: 'from-purple-500 to-fuchsia-500', text: 'text-purple-500', bg: 'bg-purple-500/10' },
  'ai-coding': { gradient: 'from-emerald-500 to-green-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'ai-prompts': { gradient: 'from-amber-500 to-yellow-500', text: 'text-amber-500', bg: 'bg-amber-500/10' },
  'video-streaming': { gradient: 'from-red-500 to-pink-500', text: 'text-red-500', bg: 'bg-red-500/10' },
  'default': { gradient: 'from-indigo-500 to-purple-500', text: 'text-indigo-500', bg: 'bg-indigo-500/10' },
};

export default function ResourcesPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

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
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedCategoryData = selectedCategory 
    ? resourceCategories.find(c => c.id === selectedCategory)
    : null;

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
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[150px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-violet-500/10 via-pink-500/8 to-transparent rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>
      )}

      {/* 导航栏 */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isDark 
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-white/80 backdrop-blur-xl border-b border-slate-200/80"
      )}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
              isDark 
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20" 
                : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/10"
            )}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              "font-heading text-xl font-bold tracking-tight",
              isDark 
                ? "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent" 
                : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            )}>
              NexusAI
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-200",
                isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
              )}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className={cn(
                "gap-2 h-10 px-4 rounded-xl font-medium",
                isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              )}>
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Banner */}
        <section className="mb-10">
          <div className={cn(
            "relative overflow-hidden rounded-3xl",
            isDark 
              ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-white/5" 
              : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-indigo-200/50"
          )}>
            {/* 装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-10 py-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-black text-white tracking-tight">
                    AI 资源库
                  </h1>
                  <p className="text-white/70 text-sm font-medium">
                    Resources · 精选 {resources.length}+ 优质资源
                  </p>
                </div>
              </div>
              
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed mb-8">
                汇聚全网最优质的 AI 工具、教程、论文和开源项目。<br />
                持续更新，助力你的 AI 学习之旅。
              </p>

              {/* 搜索框 */}
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索 AI 资源..."
                  className={cn(
                    "h-12 pl-12 pr-4 rounded-xl border-0 text-white placeholder:text-white/50 bg-white/10 backdrop-blur-sm",
                    isDark 
                      ? "focus:bg-white/15" 
                      : ""
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-8">
          {/* 侧边栏 - 分类 */}
          <aside className="w-64 shrink-0">
            <Card className={cn(
              "sticky top-24 overflow-hidden",
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
              <CardContent className="p-4">
                <h3 className={cn(
                  "font-heading text-sm font-bold mb-3 flex items-center gap-2",
                  isDark ? "text-white" : "text-slate-800"
                )}>
                  <Filter className="h-4 w-4" />
                  分类筛选
                </h3>
                
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      !selectedCategory
                        ? isDark
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-indigo-50 text-indigo-600"
                        : isDark
                          ? "text-slate-400 hover:bg-white/5 hover:text-white"
                          : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    全部资源
                    <Badge className={cn(
                      "ml-auto text-xs",
                      isDark ? "bg-white/10 text-white" : "bg-slate-100"
                    )}>
                      {resources.length}
                    </Badge>
                  </button>

                  {resourceCategories.slice(0, 12).map((cat) => {
                    const count = resources.filter(r => r.category === cat.id).length;
                    const colors = colorMap[cat.id] || colorMap['default'];
                    const Icon = resourceIconMap[cat.icon] || Sparkles;
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                          selectedCategory === cat.id
                            ? isDark
                              ? `bg-gradient-to-r ${colors.gradient} text-white`
                              : `bg-gradient-to-r ${colors.gradient} text-white`
                            : isDark
                              ? "text-slate-400 hover:bg-white/5 hover:text-white"
                              : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {cat.name}
                        <Badge className={cn(
                          "ml-auto text-xs",
                          selectedCategory === cat.id
                            ? isDark ? "bg-white/20 text-white" : "bg-white/30 text-white"
                            : isDark ? "bg-white/10 text-white" : "bg-slate-100"
                        )}>
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 主内容 */}
          <div className="flex-1 min-w-0">
            {/* 当前分类 */}
            {selectedCategoryData && (
              <div className="mb-6 flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-xl",
                  colorMap[selectedCategoryData.id] 
                    ? `bg-gradient-to-br ${colorMap[selectedCategoryData.id].gradient}`
                    : "bg-gradient-to-br from-indigo-500 to-purple-500"
                )}>
                  {(() => {
                    const Icon = resourceIconMap[selectedCategoryData.icon] || Sparkles;
                    return <Icon className="h-5 w-5 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className={cn(
                    "font-heading text-lg font-bold",
                    isDark ? "text-white" : "text-slate-800"
                  )}>
                    {selectedCategoryData.name}
                  </h2>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {selectedCategoryData.description}
                  </p>
                </div>
              </div>
            )}

            {/* 资源列表 */}
            <div className="grid grid-cols-3 gap-5">
              {filteredResources.slice(0, 24).map((resource) => {
                const category = resourceCategories.find(c => c.id === resource.category);
                const colors = colorMap[resource.category] || colorMap['default'];
                const Icon = category ? (resourceIconMap[category.icon] || Sparkles) : Sparkles;
                
                return (
                  <div
                    key={resource.id}
                    className="group"
                    onMouseEnter={() => setHoveredResource(resource.id)}
                    onMouseLeave={() => setHoveredResource(null)}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-300 h-full cursor-pointer",
                      isDark
                        ? hoveredResource === resource.id
                          ? "bg-[#1a1a2e] border-indigo-500/30 shadow-xl shadow-indigo-500/5"
                          : "bg-[#12121a] border-white/5"
                        : hoveredResource === resource.id
                          ? "bg-white border-indigo-200 shadow-xl shadow-slate-200/50 -translate-y-1"
                          : "bg-white border-slate-200/80"
                    )}>
                      {/* 封面 */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <div className={cn(
                          "w-full h-full flex items-center justify-center",
                          isDark 
                            ? "bg-gradient-to-br from-slate-800 to-slate-900" 
                            : "bg-gradient-to-br from-slate-100 to-slate-200"
                        )}>
                          <Icon className={cn(
                            "h-12 w-12 transition-transform duration-300",
                            colors.text,
                            hoveredResource === resource.id && "scale-110"
                          )} />
                        </div>
                        
                        {/* 分类标签 */}
                        <div className="absolute top-3 left-3">
                          <Badge className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm border-0",
                            isDark ? "bg-black/50 text-white" : "bg-white/90 text-slate-700"
                          )}>
                            {category?.name || 'AI 工具'}
                          </Badge>
                        </div>

                        {/* Premium 标签 */}
                        {resource.type === 'premium' && (
                          <div className="absolute top-3 right-3">
                            <Badge className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm border-0",
                              isDark 
                                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" 
                                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                            )}>
                              <Crown className="h-3 w-3 mr-1" />
                              精品
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className={cn(
                          "font-heading text-sm font-bold mb-2 line-clamp-2 leading-snug transition-colors",
                          isDark 
                            ? "text-white group-hover:text-white" 
                            : "text-slate-800 group-hover:text-indigo-600"
                        )}>
                          {resource.title}
                        </h3>

                        {resource.description && (
                          <p className={cn(
                            "text-xs line-clamp-2 mb-3 leading-relaxed",
                            isDark ? "text-slate-400" : "text-slate-500"
                          )}>
                            {resource.description}
                          </p>
                        )}

                        {/* 标签 */}
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {resource.tags.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-[10px] font-medium",
                                  isDark 
                                    ? "bg-indigo-500/10 text-indigo-400" 
                                    : "bg-indigo-50 text-indigo-600"
                                )}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 底部信息 */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex items-center gap-1 text-xs",
                              isDark ? "text-slate-400" : "text-slate-500"
                            )}>
                              <Star className="h-3.5 w-3.5" />
                              <span>{resource.rating}</span>
                            </div>
                            {resource.hot && (
                              <Badge className={cn(
                                "px-2 py-0.5 rounded-md text-[10px] font-medium",
                                isDark ? "bg-red-500/20 text-red-400 border-0" : "bg-red-100 text-red-500 border-0"
                              )}>
                                <Flame className="h-3 w-3 mr-1" />
                                热门
                              </Badge>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            className={cn(
                              "h-7 px-3 rounded-lg text-xs font-medium transition-all duration-200",
                              isDark
                                ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            )}
                          >
                            访问
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* 加载更多 */}
            {filteredResources.length > 24 && (
              <div className="mt-10 text-center">
                <Button 
                  size="lg" 
                  className={cn(
                    "h-12 px-8 rounded-xl font-medium",
                    isDark
                      ? "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                  )}
                >
                  加载更多资源
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className={cn(
          "mt-20 pt-8 border-t text-center",
          isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-400"
        )}>
          <p className="text-sm">
            © 2024 NexusAI. Built with passion for AI learning.
          </p>
        </footer>
      </main>
    </div>
  );
}
