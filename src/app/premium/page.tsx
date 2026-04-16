'use client';

import { useState } from 'react';
import { Search, Clock, Eye, Heart, Crown, Zap, Star, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  isMemberFree: boolean;
  publishTime: string;
  views: number;
  likes: number;
  tags: string[];
  author: string;
}

// 虚拟课程数据 - 更多示例课程
const courses: Course[] = [
  {
    id: '1',
    title: 'AI大模型应用开发实战',
    description: '从零开始学习如何使用GPT、Claude等大模型构建应用',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    price: 99,
    isMemberFree: true,
    publishTime: '2024-01-15',
    views: 12580,
    likes: 892,
    tags: ['AI', 'Python', '实战'],
    author: '张老师',
  },
  {
    id: '2',
    title: 'Midjourney商业设计从入门到精通',
    description: '掌握AI绘画技巧，接单变现的全流程指南',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop',
    price: 69,
    isMemberFree: true,
    publishTime: '2024-01-12',
    views: 9870,
    likes: 654,
    tags: ['设计', 'AI绘画', '变现'],
    author: '李设计师',
  },
  {
    id: '3',
    title: '小红书IP打造变现课',
    description: '从0到1打造百万粉账号，实现内容变现',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop',
    price: 199,
    isMemberFree: true,
    publishTime: '2024-01-10',
    views: 15620,
    likes: 1203,
    tags: ['自媒体', '变现', '小红书'],
    author: '小红老师',
  },
  {
    id: '4',
    title: '独立开发者产品设计与营销',
    description: '如何从0开始做产品、获客、月入过万',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    price: 149,
    isMemberFree: false,
    publishTime: '2024-01-08',
    views: 7650,
    likes: 421,
    tags: ['独立开发', '产品', '营销'],
    author: '王老板',
  },
  {
    id: '5',
    title: '短视频剪辑与账号运营',
    description: '剪映/PR教程，抖音快手运营技巧大公开',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=250&fit=crop',
    price: 79,
    isMemberFree: true,
    publishTime: '2024-01-05',
    views: 18930,
    likes: 1567,
    tags: ['视频剪辑', '抖音', '运营'],
    author: '剪辑师小王',
  },
  {
    id: '6',
    title: 'ChatGPT提示词工程大师课',
    description: '成为AI时代最值钱的人，学会写出高效提示词',
    image: 'https://images.unsplash.com/photo-1684391729462-63ef8c3f7f5e?w=400&h=250&fit=crop',
    price: 59,
    isMemberFree: true,
    publishTime: '2024-01-03',
    views: 23450,
    likes: 2156,
    tags: ['AI', '提示词', '效率'],
    author: 'AI学院',
  },
  {
    id: '7',
    title: '知识付费项目实战营',
    description: '30天搭建你的知识付费副业，月入5000+',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
    price: 299,
    isMemberFree: false,
    publishTime: '2024-01-01',
    views: 6780,
    likes: 389,
    tags: ['知识付费', '副业', '变现'],
    author: '创业导师',
  },
  {
    id: '8',
    title: '跨境电商选品与运营',
    description: '亚马逊/TikTok Shop从0到1完整攻略',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    price: 159,
    isMemberFree: true,
    publishTime: '2023-12-28',
    views: 11200,
    likes: 876,
    tags: ['跨境电商', '亚马逊', '选品'],
    author: '跨境老王',
  },
  {
    id: '9',
    title: 'Notion打造个人知识管理系统',
    description: '用Notion管理知识、项目、生活的完整方案',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=250&fit=crop',
    price: 39,
    isMemberFree: true,
    publishTime: '2023-12-25',
    views: 15680,
    likes: 1432,
    tags: ['Notion', '知识管理', '效率'],
    author: '效率达人',
  },
  {
    id: '10',
    title: 'Python爬虫与数据采集实战',
    description: '学会爬虫技术，轻松获取全网数据',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
    price: 89,
    isMemberFree: true,
    publishTime: '2023-12-22',
    views: 9870,
    likes: 567,
    tags: ['Python', '爬虫', '数据'],
    author: '数据老张',
  },
  {
    id: '11',
    title: 'Stable Diffusion零基础到接单',
    description: 'AI绘画商业变现，从入门到月入过万',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop',
    price: 129,
    isMemberFree: true,
    publishTime: '2023-12-20',
    views: 14560,
    likes: 1089,
    tags: ['AI绘画', 'SD', '变现'],
    author: 'AI画师',
  },
  {
    id: '12',
    title: 'Affiliate营销月入过万指南',
    description: '通过联盟营销实现被动收入的全流程',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=250&fit=crop',
    price: 199,
    isMemberFree: false,
    publishTime: '2023-12-18',
    views: 7890,
    likes: 432,
    tags: ['营销', 'Affiliate', '被动收入'],
    author: '营销达人',
  },
];

export default function PremiumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 获取所有标签
  const allTags = [...new Set(courses.flatMap(c => c.tags))];

  // 过滤课程
  const filteredCourses = courses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = !selectedTag || course.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* 背景光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 顶部Banner - 更醒目 */}
        <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 p-6 shadow-xl shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                <Crown className="w-9 h-9 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">精品课程</h1>
                <p className="text-sm text-white/80">高质量付费课程，助你快速成长</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm backdrop-blur">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="font-medium">365天持续更新</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/90 text-purple-900 text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>会员免费学习</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 py-5 rounded-xl bg-slate-900/80 border-slate-700/50 text-white text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                !selectedTag
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              )}
            >
              全部
            </button>
            {allTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  tag === selectedTag
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 课程统计 */}
        <div className="mb-4 flex items-center gap-4 text-xs text-slate-400">
          <span>共 {filteredCourses.length} 个课程</span>
          <span className="text-amber-400">{courses.filter(c => !c.isMemberFree).length} 个付费</span>
          <span className="text-emerald-400">{courses.filter(c => c.isMemberFree).length} 个会员免费</span>
        </div>

        {/* 课程网格 - 3-4列 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-all hover:shadow-lg hover:shadow-rose-500/10"
            >
              {/* 封面图 - 横向宽图 */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                
                {/* 价格标签 */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-bold shadow-lg">
                    云币 {course.price}
                  </span>
                  {course.isMemberFree && (
                    <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-0.5 shadow-lg">
                      <Crown className="w-3 h-3" />
                      会员
                    </span>
                  )}
                </div>
              </div>

              {/* 内容区 */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-rose-400 transition-colors">
                  {course.title}
                </h3>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {course.publishTime}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" />
                      {formatNumber(course.views)}
                    </span>
                    <span className="flex items-center gap-0.5 text-rose-400">
                      <Heart className="w-2.5 h-2.5" />
                      {formatNumber(course.likes)}
                    </span>
                  </div>
                </div>

                {/* 作者 */}
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center text-white text-[8px] font-bold">
                    {course.author[0]}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate">{course.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">未找到相关课程</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* 加载更多 */}
        {filteredCourses.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all text-sm">
              加载更多
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
