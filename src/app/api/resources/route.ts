import { NextRequest, NextResponse } from 'next/server';
import { resources, resourceCategories, getResourcesByCategory, searchResources } from '@/lib/resources';

// GET /api/resources - 获取资源列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    let result = resources;

    // 分类筛选
    if (category && category !== 'all') {
      result = getResourcesByCategory(category);
    }

    // 搜索
    if (search) {
      result = searchResources(search);
    }

    // 排序
    if (sort === 'popular') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sort === 'recent') {
      result = [...result].sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0));
    }

    // 分页
    const total = result.length;
    const offset = (page - 1) * limit;
    const paginatedData = result.slice(offset, offset + limit);

    return NextResponse.json({ 
      data: paginatedData,
      categories: resourceCategories,
      total,
      page,
      limit 
    });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
