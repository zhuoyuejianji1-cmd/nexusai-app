import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/tasks - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('path_id');

    const client = getSupabaseClient();
    
    let query = client.from('tasks').select('*');

    if (pathId) {
      query = query.eq('path_id', parseInt(pathId));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('获取任务列表失败:', error);
      return NextResponse.json({ error: '获取任务列表失败' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
