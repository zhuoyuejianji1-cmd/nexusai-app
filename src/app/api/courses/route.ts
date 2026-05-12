import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export interface Course {
  id: string;
  title: string;
  description: string;
  detail: string;
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
  baiduLinks: string[];
  detailImages: string[];
  sourceUrl: string;
}

// 模块级缓存，避免每次请求都读磁盘
let coursesCache: Course[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1分钟

function loadCourses(): Course[] {
  const now = Date.now();
  if (coursesCache && now - cacheTime < CACHE_TTL) {
    return coursesCache;
  }
  const filePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
  if (!existsSync(filePath)) {
    return [];
  }
  const raw = readFileSync(filePath, 'utf-8');
  coursesCache = JSON.parse(raw);
  cacheTime = now;
  return coursesCache!;
}

// 清理课程数据（按需返回安全字段）
function cleanCourse(c: Course) {
  let content = c.content || c.detail || '';
  // 爬虫数据内容可能含富文本标记，适当截断
  if (content.length > 10000) content = content.slice(0, 10000) + '...';

  return {
    id: c.id,
    title: c.title || '未命名课程',
    description: c.description || c.detail?.slice(0, 200) || '',
    detail: c.detail || '',
    instructor: c.instructor || '精品课程',
    thumbnail: c.thumbnail || '',
    duration: c.duration || '待定',
    students: c.students || 0,
    rating: c.rating || 4.5,
    level: c.level || '入门',
    tags: c.tags || [],
    isPremium: true,
    price: c.price || 0,
    originalPrice: c.originalPrice || 0,
    updatedAt: c.updatedAt || '',
    chapters: c.chapters || 1,
    highlights: c.highlights || [],
    content: content,
    baiduLinks: c.baiduLinks || [],
    detailImages: c.detailImages || [],
    sourceUrl: c.sourceUrl || '',
  };
}

// GET /api/courses - 获取课程列表
export async function GET(request: NextRequest) {
  try {
    const allCourses = loadCourses();

    const { searchParams } = new URL(request.url);
    
    // 支持按 id 精确查询（用于课程详情页）
    const id = searchParams.get('id');
    if (id) {
      const course = allCourses.find(c => c.id === id);
      if (!course) {
        return NextResponse.json({ data: [], pagination: { page: 1, limit: 1, total: 0, totalPages: 0 } });
      }
      return NextResponse.json({
        data: [cleanCourse(course)],
        pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
      });
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    let filtered = allCourses;

    // 搜索过滤
    if (search) {
      const kw = search.toLowerCase();
      filtered = allCourses.filter(c =>
        c.title.toLowerCase().includes(kw) ||
        c.description?.toLowerCase().includes(kw) ||
        c.tags?.some(t => t.toLowerCase().includes(kw))
      );
    }

    // 分页
    const total = filtered.length;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    const courses = paged.map(cleanCourse);

    return NextResponse.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to load courses:', error);
    return NextResponse.json(
      { error: 'Failed to load courses' },
      { status: 500 }
    );
  }
}
