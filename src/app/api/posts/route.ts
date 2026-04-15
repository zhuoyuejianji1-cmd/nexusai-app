import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Post, User } from '@/lib/types';

// GET /api/posts - 获取动态列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('posts')
      .select(`
        *,
        user:users(id, nickname, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取动态列表失败:', error);
      return NextResponse.json({ error: '获取动态列表失败' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [], page, limit });
  } catch (err) {
    console.error('API 错误:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
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
