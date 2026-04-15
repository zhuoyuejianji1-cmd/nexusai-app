import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/hot-list - 获取热榜
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('hot_list')
      .select('*')
      .order('heat_score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('获取热榜失败:', error);
      return NextResponse.json({ error: '获取热榜失败' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
