import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { tasksFallback } from '@/data/tasks';

// GET /api/tasks - 获取任务列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathId = searchParams.get('path_id');

  // 尝试从 Supabase 获取
  try {
    const client = getSupabaseClient();
    let query = client.from('tasks').select('*');

    if (pathId) {
      query = query.eq('path_id', parseInt(pathId));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ data });
    }
  } catch {
    // Supabase 不可用，使用静态 fallback
  }

  // Fallback: 返回静态数据
  return NextResponse.json({ data: tasksFallback });
}
