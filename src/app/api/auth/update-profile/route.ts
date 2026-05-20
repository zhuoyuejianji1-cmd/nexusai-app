import { NextRequest, NextResponse } from 'next/server';
import { updateUserNickname, updateUserAvatar } from '@/lib/user';

export const runtime = 'nodejs';

function parseToken(request: NextRequest): any {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const data = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (data.exp < Date.now()) return null;
      return data;
    } catch { return null; }
  }
  const authToken = request.cookies.get('auth_token');
  if (authToken) {
    try {
      const data = JSON.parse(Buffer.from(authToken.value, 'base64').toString('utf-8'));
      if (data.exp < Date.now()) return null;
      return data;
    } catch { return null; }
  }
  return null;
}

// POST /api/auth/update-profile - 更新用户昵称和头像
export async function POST(request: NextRequest) {
  try {
    const tokenData = parseToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { nickname, avatarUrl } = await request.json();
    const openid = tokenData.openid;

    // 同步更新数据库
    if (nickname && nickname !== '微信用户') {
      await updateUserNickname(openid, nickname);
    }
    if (avatarUrl) {
      await updateUserAvatar(openid, avatarUrl);
    }

    // 生成新 token（包含更新的信息）
    const newTokenData = {
      ...tokenData,
      nickname: nickname || tokenData.nickname || '微信用户',
      avatar: avatarUrl || tokenData.avatar || null,
    };

    const token = Buffer.from(JSON.stringify(newTokenData)).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      user: {
        openid: newTokenData.openid,
        nickname: newTokenData.nickname,
        avatar: newTokenData.avatar,
      },
    });
  } catch (error) {
    console.error('更新资料错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
