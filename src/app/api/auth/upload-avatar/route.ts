import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { updateUserAvatar } from '@/lib/user';

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
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = parseToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: '请选择头像文件' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只能上传图片文件' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过2MB' }, { status: 400 });
    }

    const ext = file.type.split('/')[1] || 'jpg';
    const fileName = `${tokenData.userId}_${Date.now()}.${ext}`;

    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
    if (!existsSync(avatarsDir)) {
      await mkdir(avatarsDir, { recursive: true });
    }

    const filePath = path.join(avatarsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const relativePath = `/avatars/${fileName}`;
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const avatarUrl = host ? `${protocol}://${host}${relativePath}` : relativePath;

    // 同步更新数据库中的头像
    if (tokenData.openid) {
      await updateUserAvatar(tokenData.openid, avatarUrl);
    }

    const newTokenData = {
      ...tokenData,
      avatar: avatarUrl,
    };

    const token = Buffer.from(JSON.stringify(newTokenData)).toString('base64');

    return NextResponse.json({
      success: true,
      avatarUrl,
      token,
      user: {
        openid: newTokenData.openid,
        nickname: newTokenData.nickname,
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.error('头像上传错误:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
