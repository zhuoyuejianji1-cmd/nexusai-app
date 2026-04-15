import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/news - 获取新闻列表
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    
    // 获取本周的新闻
    const currentWeek = getWeekNumber(new Date());
    
    const { data, error } = await client
      .from('news')
      .select('*')
      .eq('week_number', currentWeek)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取新闻失败:', error);
      return NextResponse.json({ error: '获取新闻失败' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 获取当前周数
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
