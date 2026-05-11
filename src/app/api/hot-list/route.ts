import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { hotListFallback } from '@/data/hot-list';

// GET /api/hot-list - 获取热榜
export async function GET(request: NextRequest) {
  // 尝试从 Supabase 获取
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('hot_list')
      .select('*')
      .order('heat_score', { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      return NextResponse.json({ data });
    }
  } catch {
    // Supabase 不可用，使用静态 fallback
  }

  // Fallback: 返回静态数据
  return NextResponse.json({ data: hotListFallback });
}
