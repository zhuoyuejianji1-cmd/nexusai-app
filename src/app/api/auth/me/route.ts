import { NextRequest, NextResponse } from 'next/server';
import { getVipStatus } from '@/lib/redis';
import { getUserByOpenid } from '@/lib/user';
import { buildWxUserPayload } from '@/lib/wx-user-payload';

export const runtime = 'nodejs';

function parseToken(request: NextRequest): any {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const data = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (data.exp < Date.now()) return null;
      return data;
    } catch {
      return null;
    }
  }

  const authToken = request.cookies.get('auth_token');
  if (authToken) {
    try {
      const data = JSON.parse(Buffer.from(authToken.value, 'base64').toString('utf-8'));
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

    if (tokenData.openid) {
      const [storedUser, vip] = await Promise.all([
        getUserByOpenid(tokenData.openid),
        getVipStatus(tokenData.openid),
      ]);
      const payload = buildWxUserPayload({ tokenData, storedUser, vip });

      return NextResponse.json({
        user: {
          id: payload.user.openid,
          points: 0,
          ...payload.user,
        },
      });
    }

    return NextResponse.json({
      user: {
        id: tokenData.userId,
        email: tokenData.email,
        nickname: tokenData.email?.split('@')[0] || '用户',
        avatar: null,
        is_vip: false,
        vip_expire: null,
        points: 100,
      },
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json({ user: null });
  }
}
