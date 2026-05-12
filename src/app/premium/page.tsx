'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Play, 
  Users, 
  Star, 
  Clock, 
  ArrowLeft,
  Crown,
  Shield,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  Sun,
  Moon,
  GraduationCap,
  Layers,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  tags: string[];
  isPremium: boolean;
  price: number;
  originalPrice: number;
  updatedAt: string;
  chapters: number;
  highlights: string[];
  sourceUrl?: string;
}

const levelColors: Record<string, { light: string; dark: string }> = {
  '入门': { light: 'bg-emerald-50 text-emerald-600 border-emerald-200', dark: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  '进阶': { light: 'bg-amber-50 text-amber-600 border-amber-200', dark: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  '高级': { light: 'bg-red-50 text-red-600 border-red-200', dark: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const benefits = [
  { icon: Crown, title: '专属会员群', desc: '与讲师和同学实时交流' },
  { icon: Shield, title: '永久更新', desc: '课程内容持续迭代升级' },
  { icon: Zap, title: '优先体验', desc: '最新 AI 功能第一时间学' },
  { icon: CheckCircle2, title: '退款保障', desc: '7天无理由退款承诺' },
];

export default function PremiumPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // 从API加载课程数据
  const fetchCourses = async (pageNum: number) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses?page=${pageNum}&limit=12`);
      if (!res.ok) throw new Error('加载失败');
      const result = await res.json();
      setCourses(result.data);
      setTotalCourses(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError('课程加载失败，请刷新重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';

  const stats = [
    { icon: GraduationCap, value: `${Math.min(totalCourses, 9999)}`, label: '精品课程' },
    { icon: Clock, value: `${Math.min(Math.ceil(totalCourses * 1.5), 9999)}`, label: '总课时' },
    { icon: Star, value: '4.8', label: '平均评分' },
    { icon: Layers, value: `${Math.min(Math.ceil(totalCourses / 5), 999)}`, label: '分类' },
  ];

  const handlePrevPage = () => { if (page > 1) { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handleNextPage = () => { if (page < totalPages) { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

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
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 via-orange-500/8 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-pink-500/10 via-rose-500/8 to-transparent rounded-full blur-[120px]" />
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
              ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1f1f3a] border border-white/5" 
              : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-indigo-200/50"
          )}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-10 py-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-black text-white tracking-tight">
                    精品课程
                  </h1>
                  <p className="text-white/70 text-sm font-medium">
                    Premium Courses · 实战驱动 · 持续更新
                  </p>
                </div>
              </div>
              
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed mb-8">
                精选全网最新 AI 与副业课程，由行业实战者倾力打造。<br />
                从入门到精通，系统化学习路径助你快速提升。
              </p>

              {/* 数据统计 */}
              <div className="flex items-center gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm">
                      <stat.icon className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 会员权益 */}
        <section className="mb-10">
          <div className="grid grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <div 
                key={i}
                className={cn(
                  "relative flex items-center gap-4 p-5 rounded-2xl transition-all duration-300",
                  isDark
                    ? "bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm"
                    : "bg-white hover:shadow-lg border border-slate-200/50 hover:border-indigo-200/50"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-xl shrink-0",
                  isDark 
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" 
                    : "bg-gradient-to-br from-amber-50 to-orange-50"
                )}>
                  <benefit.icon className={cn(
                    "h-6 w-6",
                    isDark ? "text-amber-400" : "text-amber-600"
                  )} />
                </div>
                <div>
                  <h3 className={cn(
                    "text-sm font-semibold mb-0.5",
                    isDark ? "text-white" : "text-slate-800"
                  )}>
                    {benefit.title}
                  </h3>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 课程列表 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "font-heading text-xl font-bold flex items-center gap-2",
              isDark ? "text-white" : "text-slate-900"
            )}>
              <Layers className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
              全部课程
            </h2>
            <Badge className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium",
              isDark 
                ? "bg-indigo-500/20 text-indigo-400 border-0" 
                : "bg-indigo-100 text-indigo-600 border-0"
            )}>
              共 {totalCourses} 门课程
            </Badge>
          </div>

          {/* 骨架屏加载态 */}
          {isLoading && (
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={cn(
                  "rounded-2xl overflow-hidden animate-pulse",
                  isDark ? "bg-[#12121a]" : "bg-white"
                )}>
                  <div className={cn(
                    "aspect-[16/10]",
                    isDark ? "bg-white/5" : "bg-slate-100"
                  )} />
                  <div className="p-5 space-y-3">
                    <div className={cn("h-5 rounded w-3/4", isDark ? "bg-white/5" : "bg-slate-100")} />
                    <div className={cn("h-4 rounded w-full", isDark ? "bg-white/5" : "bg-slate-100")} />
                    <div className={cn("h-4 rounded w-1/2", isDark ? "bg-white/5" : "bg-slate-100")} />
                    <div className={cn("h-10 rounded-lg w-full mt-4", isDark ? "bg-white/5" : "bg-slate-100")} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 错误状态 */}
          {error && !isLoading && (
            <div className={cn(
              "text-center py-20 rounded-2xl",
              isDark ? "bg-white/5" : "bg-white"
            )}>
              <p className={cn(
                "text-lg mb-4",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>{error}</p>
              <Button onClick={() => fetchCourses(page)}>
                重新加载
              </Button>
            </div>
          )}

          {/* 课程列表 */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredCourse(course.id)}
                    onMouseLeave={() => setHoveredCourse(null)}
                    onClick={() => router.push(`/course/${course.id}`)}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-300 h-full",
                      isDark
                        ? hoveredCourse === course.id
                          ? "bg-[#1a1a2e] border-indigo-500/30 shadow-xl shadow-indigo-500/5"
                          : "bg-[#12121a] border-white/5"
                        : hoveredCourse === course.id
                          ? "bg-white border-indigo-200 shadow-xl shadow-slate-200/50 -translate-y-1"
                          : "bg-white border-slate-200/80"
                    )}>
                      {/* 封面图 */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className={cn(
                            "w-full h-full object-cover transition-transform duration-500",
                            hoveredCourse === course.id ? "scale-105" : "scale-100"
                          )}
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* 价格标签 */}
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm",
                              isDark ? "bg-white/20 text-white" : "bg-white/90 text-slate-800"
                            )}>
                              {course.price > 0 ? `¥${course.price}` : '免费'}
                            </span>
                            {course.originalPrice > course.price && course.price > 0 && (
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                isDark ? "bg-red-500/80 text-white" : "bg-red-500 text-white"
                              )}>
                                {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 播放按钮 */}
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                          hoveredCourse === course.id ? "opacity-100" : "opacity-0"
                        )}>
                          <div className={cn(
                            "flex items-center justify-center h-14 w-14 rounded-full backdrop-blur-sm transition-transform duration-300",
                            hoveredCourse === course.id ? "scale-100" : "scale-75",
                            isDark ? "bg-white/20" : "bg-white/80"
                          )}>
                            <Play className={cn(
                              "h-6 w-6 ml-1",
                              isDark ? "text-white" : "text-indigo-600"
                            )} />
                          </div>
                        </div>

                        {/* 底部信息 */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "text-xs font-medium border-0 backdrop-blur-sm",
                              isDark 
                                ? "bg-black/40 text-white" 
                                : "bg-white/80 text-slate-700"
                            )}>
                              {course.duration}
                            </Badge>
                            <Badge className={cn(
                              "text-xs font-medium border-0 backdrop-blur-sm",
                              isDark 
                                ? "bg-black/40 text-white" 
                                : "bg-white/80 text-slate-700"
                            )}>
                              {course.chapters || 1} 章节
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        {/* 标题 */}
                        <h3 className={cn(
                          "font-heading text-lg font-bold mb-2 line-clamp-2 transition-colors leading-snug",
                          isDark 
                            ? "text-white group-hover:text-white" 
                            : "text-slate-800 group-hover:text-indigo-600"
                        )}>
                          {course.title}
                        </h3>

                        {/* 描述 */}
                        <p className={cn(
                          "text-sm line-clamp-2 mb-4 leading-relaxed",
                          isDark ? "text-slate-400" : "text-slate-500"
                        )}>
                          {course.description}
                        </p>

                        {/* 讲师 */}
                        <p className={cn(
                          "text-xs mb-3 font-medium",
                          isDark ? "text-slate-500" : "text-slate-400"
                        )}>
                          讲师: {course.instructor || '精品课程'}
                        </p>

                        {/* 标签 */}
                        {course.tags && course.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {course.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-xs font-medium",
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
                        <div className="flex items-center justify-between pt-4 border-t mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className={cn(
                                "h-4 w-4 fill-current",
                                isDark ? "text-amber-400" : "text-amber-500"
                              )} />
                              <span className={cn(
                                "text-sm font-semibold",
                                isDark ? "text-white" : "text-slate-800"
                              )}>
                                {course.rating}
                              </span>
                            </div>
                          </div>
                          
                          <Badge className={cn(
                            "text-xs font-medium border",
                            (levelColors[course.level] || levelColors['入门'])[isDark ? 'dark' : 'light']
                          )}>
                            {course.level}
                          </Badge>
                        </div>

                        {/* 查看详情按钮 */}
                        <Button
                          onClick={() => router.push(`/course/${course.id}`)}
                          className={cn(
                            "w-full h-10 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer",
                            isDark
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/20"
                              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/10"
                          )}>
                          查看详情
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    className={cn(
                      "px-6 rounded-xl",
                      isDark ? "border-white/10 text-slate-300" : ""
                    )}
                  >
                    上一页
                  </Button>
                  <span className={cn(
                    "text-sm font-medium",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    第 {page} / {totalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className={cn(
                      "px-6 rounded-xl",
                      isDark ? "border-white/10 text-slate-300" : ""
                    )}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

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
