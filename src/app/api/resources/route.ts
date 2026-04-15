import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/resources - 获取资源列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const client = getSupabaseClient();
    
    let query = client.from('resources').select('*');

    // 分类筛选
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // 排序
    if (sort === 'popular') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'recent') {
      query = query.order('views_count', { ascending: false });
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('获取资源列表失败:', error);
      return NextResponse.json({ error: '获取资源列表失败' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [], page, limit });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
