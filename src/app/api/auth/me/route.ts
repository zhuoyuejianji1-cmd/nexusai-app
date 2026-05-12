import { NextRequest, NextResponse } from 'next/server';

// 解析 token，支持 Cookie 和 Bearer 两种方式
function parseToken(request: NextRequest): any {
  // 1. 尝试 Bearer token (小程序)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const data = JSON.parse(Buffer.from(token, 'base64').toString());
      if (data.exp < Date.now()) return null;
      return data;
    } catch {
      return null;
    }
  }

  // 2. 尝试 Cookie (网页)
  const authToken = request.cookies.get('auth_token');
  if (authToken) {
    try {
      const data = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
      if (data.exp < Date.now()) return null;
      return data;
    } catch {
      return null;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const tokenData = parseToken(request);

    if (!tokenData) {
      return NextResponse.json({ user: null });
    }

    // 微信小程序用户
    if (tokenData.openid) {
      return NextResponse.json({
        user: {
          id: tokenData.openid,
          openid: tokenData.openid,
          nickname: tokenData.nickname || '微信用户',
          avatar: null,
          is_vip: false,
          points: 0,
        },
      });
    }

    // Web 端邮箱用户
    return NextResponse.json({
      user: {
        id: tokenData.userId,
        email: tokenData.email,
        nickname: tokenData.email?.split('@')[0] || '用户',
        avatar: null,
        is_vip: false,
        points: 100,
      },
    });

  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json({ user: null });
  }
}
