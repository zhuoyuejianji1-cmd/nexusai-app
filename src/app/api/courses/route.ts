import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
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

// GET /api/courses - 获取课程列表
export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
    const raw = readFileSync(filePath, 'utf-8');
    const allCourses: Course[] = JSON.parse(raw);

    const { searchParams } = new URL(request.url);
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

    // 清理返回数据
    const courses = paged.map(c => ({
      id: c.id,
      title: c.title || '未命名课程',
      description: c.description || c.detail?.slice(0, 200) || '',
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
      sourceUrl: c.sourceUrl || '',
    }));

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
