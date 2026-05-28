import { NextRequest, NextResponse } from 'next/server';
import { getVipStatus } from '@/lib/redis';
import { getUserByOpenid, updateUserAvatar, updateUserNickname } from '@/lib/user';
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

export async function POST(request: NextRequest) {
  try {
    const tokenData = parseToken(request);
    if (!tokenData?.openid) {
      return NextResponse.json({ error: '请先登录微信小程序账号' }, { status: 401 });
    }

    const { nickname, avatarUrl } = await request.json();
    const openid = tokenData.openid;

    if (nickname && nickname !== '微信用户') {
      await updateUserNickname(openid, nickname);
    }
    if (avatarUrl) {
      await updateUserAvatar(openid, avatarUrl);
    }

    const [storedUser, vip] = await Promise.all([
      getUserByOpenid(openid),
      getVipStatus(openid),
    ]);

    const payload = buildWxUserPayload({
      tokenData: {
        ...tokenData,
        nickname: nickname || tokenData.nickname,
        avatar: avatarUrl || tokenData.avatar,
      },
      storedUser: storedUser
        ? { ...storedUser, nickname: nickname || storedUser.nickname, avatar: avatarUrl || storedUser.avatar }
        : null,
      vip,
    });
    const token = Buffer.from(JSON.stringify(payload.tokenData)).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      user: payload.user,
    });
  } catch (error) {
    console.error('更新资料错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
