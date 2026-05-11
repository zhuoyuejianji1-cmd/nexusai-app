import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { postsFallback } from '@/data/posts';
import type { Post, User } from '@/lib/types';

// GET /api/posts - 获取动态列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  // 尝试从 Supabase 获取
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('posts')
      .select(`
        *,
        user:users(id, nickname, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!error && data && data.length > 0) {
      return NextResponse.json({ data, page, limit });
    }
  } catch {
    // Supabase 不可用，使用静态 fallback
  }

  // Fallback: 返回静态数据
  const paged = postsFallback.slice(offset, offset + limit);
  return NextResponse.json({ data: paged, page, limit, total: postsFallback.length });
}

// POST /api/posts - 发布动态
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, images = [] } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: '内容不能超过500字' }, { status: 400 });
    }

    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('posts')
      .insert({
        content: content.trim(),
        images,
        user_id: 'demo-user-id', // 实际应从认证获取
      })
      .select(`
        *,
        user:users(id, nickname, avatar_url)
      `)
      .single();

    if (error) {
      console.error('发布动态失败:', error);
      return NextResponse.json({ error: '发布动态失败' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
