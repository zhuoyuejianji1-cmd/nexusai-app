'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, ArrowLeft, Crown, Star, Clock, Users, BookOpen, 
  Sun, Moon, Tag, ExternalLink, Download, ChevronRight,
  AlertCircle, Loader2, CheckCircle2, Shield, Zap,
  Layers, Play, GraduationCap, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CourseDetail {
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
  content: string;
  baiduLinks: { link: string; password: string }[];
  detailImages: string[];
  sourceUrl: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    // 获取课程详情
    fetch(`/api/courses?id=${courseId}`)
      .then(r => r.json())
      .then(data => {
        if (data.data?.length > 0) {
          setCourse(data.data[0]);
        } else {
          setError('课程不存在');
        }
      })
      .catch(() => setError('加载失败'))
      .finally(() => setLoading(false));

    // 获取用户信息
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [isLoaded, courseId]);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, isLoaded]);

  const isDark = theme === 'dark';

  if (!isLoaded || loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
          <h2 className="text-xl font-bold">{error || '课程不存在'}</h2>
          <Link href="/premium">
            <Button>返回课程列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVip = user?.is_vip === true;
  const isFreeCourse = course.price === 0;
  const displayPrice = isFreeCourse ? 0 : 9.9;
  const showPayButton = !isVip;

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 via-orange-500/8 to-transparent rounded-full blur-[120px]" />
        </div>
      )}

      {/* 导航 */}
      <header className={cn("sticky top-0 z-50 w-full backdrop-blur-xl border-b", isDark ? "bg-[#0a0a0f]/80 border-white/5" : "bg-white/80 border-slate-200/80")}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/premium" className="flex items-center gap-2 group">
            <ArrowLeft className={cn("h-5 w-5", isDark ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-indigo-600")} />
            <span className={cn("text-sm font-medium", isDark ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-indigo-600")}>返回课程</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
            <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>NexusAI</span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8">
        {/* 课程头部 */}
        <div className="grid grid-cols-5 gap-8 mb-10">
          {/* 封面 */}
          <div className="col-span-2">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src={course.thumbnail || '/placeholder-course.jpg'}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" fill="%236366f1"><rect width="400" height="600"/><text x="200" y="300" text-anchor="middle" fill="white" font-size="20">无封面</text></svg>';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* 信息 */}
          <div className="col-span-3">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={cn(isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600", "border-0 font-medium")}>
                {course.level || '入门'}
              </Badge>
              {course.price === 0 && (
                <Badge className="bg-emerald-500 text-white border-0 font-medium">免费</Badge>
              )}
            </div>

            <h1 className={cn("text-2xl font-black mb-4 leading-tight", isDark ? "text-white" : "text-slate-900")}>
              {course.title}
            </h1>

            <p className={cn("text-base mb-6 leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
              {course.description}
            </p>

            {/* 讲师 & 统计 */}
            <div className={cn("flex items-center gap-6 mb-6 p-4 rounded-xl", isDark ? "bg-white/5" : "bg-slate-50")}>
              <div className="flex items-center gap-2">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", isDark ? "bg-gradient-to-br from-indigo-500 to-purple-500" : "bg-gradient-to-br from-indigo-500 to-purple-500")}>
                  <span className="text-white font-bold text-sm">{(course.instructor && course.instructor !== '精品课程') ? course.instructor[0] : 'N'}</span>
                </div>
                <div>
                  <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-800")}>{course.instructor || '精品课程'}</p>
                  <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>讲师</p>
                </div>
              </div>
              <div className={cn("text-center px-4 border-l", isDark ? "border-white/10" : "border-slate-200")}>
                <div className="flex items-center gap-1">
                  <Star className={cn("h-4 w-4 fill-current", isDark ? "text-amber-400" : "text-amber-500")} />
                  <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>{course.rating || '4.8'}</span>
                </div>
                <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>评分</p>
              </div>
              <div className={cn("text-center px-4 border-l", isDark ? "border-white/10" : "border-slate-200")}>
                <div className="flex items-center gap-1">
                  <Users className={cn("h-4 w-4", isDark ? "text-slate-400" : "text-slate-500")} />
                  <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>{course.students || '1.2k'}</span>
                </div>
                <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>学员</p>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {course.tags?.map((tag, i) => (
                <Badge key={i} className={cn("px-3 py-1 rounded-lg text-xs font-medium border-0", isDark ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-600")}>
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {course.duration !== '待定' && (
                <Badge className={cn("px-3 py-1 rounded-lg text-xs font-medium border-0", isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600")}>
                  <Clock className="h-3 w-3 mr-1" />
                  {course.duration}
                </Badge>
              )}
              <Badge className={cn("px-3 py-1 rounded-lg text-xs font-medium border-0", isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600")}>
                <BookOpen className="h-3 w-3 mr-1" />
                {course.chapters || 1} 章节
              </Badge>
            </div>

            {/* 价格 & 购买 */}
            <div className={cn("p-6 rounded-2xl", isDark ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20" : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                    {isVip ? '会员专属' : '课程价格'}
                  </p>
                  {isVip ? (
                    <div className="flex items-center gap-2">
                      <span className={cn("text-3xl font-black", isDark ? "text-emerald-400" : "text-emerald-600")}>免费</span>
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">VIP 免费</Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {displayPrice > 0 ? (
                        <>
                          <span className={cn("text-3xl font-black", isDark ? "text-amber-400" : "text-amber-600")}>¥{displayPrice}</span>
                          {course.originalPrice > displayPrice && (
                            <span className={cn("text-sm line-through", isDark ? "text-slate-500" : "text-slate-400")}>¥{course.originalPrice}</span>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={cn("text-3xl font-black", isDark ? "text-emerald-400" : "text-emerald-600")}>免费</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => router.push(`/payment?course_id=${course.id}`)}
                  className={cn(
                    "h-12 px-8 rounded-xl text-base font-bold",
                    isVip
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20"
                  )}
                >
                  {isVip ? '立即学习' : '立即购买'}
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 课程内容 */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            {/* 课程详情 */}
            <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
              <CardContent className="p-6">
                <h2 className={cn("text-lg font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-800")}>
                  <BookOpen className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
                  课程详情
                </h2>
                <div className={cn("prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap", isDark ? "text-slate-300 prose-invert" : "text-slate-700")}>
                  {course.content || '暂无课程详情'}
                </div>
              </CardContent>
            </Card>

            {/* 详情图片 */}
            {course.detailImages?.length > 0 && (
              <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
                <CardContent className="p-6">
                  <h2 className={cn("text-lg font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-800")}>
                    <Layers className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
                    课程预览
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {course.detailImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`课程预览 ${i+1}`}
                        className="rounded-xl w-full object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 百度网盘链接 - 仅会员可见 */}
            {course.baiduLinks?.length > 0 && isVip && (
              <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
                <CardContent className="p-6">
                  <h2 className={cn("text-lg font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-800")}>
                    <Download className={cn("h-5 w-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
                    资源下载
                  </h2>
                  <div className="space-y-3">
                    {course.baiduLinks.map((item, i) => (
                      <div key={i} className={cn("p-4 rounded-xl flex items-center justify-between", isDark ? "bg-white/5" : "bg-slate-50")}>
                        <div className="flex items-center gap-3">
                          <ExternalLink className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
                          <div>
                            <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-800")}>百度网盘资源</p>
                            <p className={cn("text-xs mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>提取码: {item.password}</p>
                          </div>
                        </div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">下载</Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 非会员：资源锁定提示 */}
            {course.baiduLinks?.length > 0 && !isVip && (
              <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
                <CardContent className="p-6 text-center">
                  <div className={cn("inline-flex items-center justify-center h-14 w-14 rounded-full mb-4", isDark ? "bg-slate-800" : "bg-slate-100")}>
                    <Crown className={cn("h-7 w-7", isDark ? "text-amber-400" : "text-amber-600")} />
                  </div>
                  <h3 className={cn("font-bold text-base mb-2", isDark ? "text-white" : "text-slate-800")}>
                    会员专属资源
                  </h3>
                  <p className={cn("text-sm mb-5 leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                    开通会员即可下载本课程全部资源<br />
                    （百度网盘链接 + 提取码）
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-amber-500/20"
                    onClick={() => router.push('/profile')}
                  >
                    开通会员
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 课程信息卡片 */}
            <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
              <CardContent className="p-6">
                <h3 className={cn("text-sm font-semibold mb-4", isDark ? "text-white" : "text-slate-800")}>课程信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>更新日期</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-slate-800")}>{course.updatedAt || '未知'}</span>
                  </div>
                  <div className={cn("h-px", isDark ? "bg-white/5" : "bg-slate-100")} />
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>章节数</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-slate-800")}>{course.chapters || 1} 章</span>
                  </div>
                  <div className={cn("h-px", isDark ? "bg-white/5" : "bg-slate-100")} />
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>难度</span>
                    <Badge className={cn("text-xs font-medium border-0", isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600")}>{course.level || '入门'}</Badge>
                  </div>
                  {course.highlights?.length > 0 && (
                    <>
                      <div className={cn("h-px", isDark ? "bg-white/5" : "bg-slate-100")} />
                      <div>
                        <p className={cn("text-xs mb-2", isDark ? "text-slate-400" : "text-slate-500")}>课程亮点</p>
                        <div className="space-y-1.5">
                          {course.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className={cn("h-3 w-3", isDark ? "text-emerald-400" : "text-emerald-500")} />
                              <span className={cn("text-xs", isDark ? "text-slate-300" : "text-slate-600")}>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* VIP 提示 */}
            {!isVip && (
              <Card className={cn(isDark ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20" : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50")}>
                <CardContent className="p-6 text-center">
                  <Crown className={cn("h-10 w-10 mx-auto mb-3", isDark ? "text-amber-400" : "text-amber-600")} />
                  <h3 className={cn("font-bold mb-2", isDark ? "text-white" : "text-slate-800")}>开通会员</h3>
                  <p className={cn("text-xs mb-4", isDark ? "text-slate-400" : "text-slate-500")}>全部课程免费学，专属会员群优先体验</p>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold h-10 rounded-xl shadow-lg shadow-amber-500/20">
                    成为会员
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 来源链接 */}
            {course.sourceUrl && (
              <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
                <CardContent className="p-4 text-center">
                  <p className={cn("text-xs mb-2", isDark ? "text-slate-500" : "text-slate-400")}>本课程来源</p>
                  <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer" className={cn("text-xs flex items-center justify-center gap-1", isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500")}>
                    <ExternalLink className="h-3 w-3" />
                    查看原文
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
