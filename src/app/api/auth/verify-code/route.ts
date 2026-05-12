import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/code-store';
// import { db } from '@/storage/database';
// import { users, verification_codes } from '@/storage/database/shared/schema';

export async function POST(request: NextRequest) {
  try {
    const { email, code, nickname } = await request.json();

    // 验证参数
    if (!email || !code) {
      return NextResponse.json(
        { error: '请提供邮箱和验证码' },
        { status: 400 }
      );
    }

    // 验证验证码（文件存储方式）
    const valid = verifyCode(email, code);
    
    // 开发环境：即使文件存储找不到也放行（方便无 /tmp 的环境）
    if (!valid && process.env.NODE_ENV === 'development') {
      console.log(`【开发模式】验证码 ${code} 绕过验证（文件存储不可用）`);
    } else if (!valid) {
      return NextResponse.json(
        { error: '验证码错误或已过期' },
        { status: 400 }
      );
    }

    // TODO: 从数据库查找或创建用户
    // const existingUser = await db.query.users.findFirst({
    //   where: eq(users.email, email),
    // });
    // let user;
    // if (existingUser) {
    //   user = existingUser;
    // } else {
    //   const [newUser] = await db.insert(users).values({
    //     email,
    //     nickname: nickname || email.split('@')[0],
    //     login_type: 'email',
    //   }).returning();
    //   user = newUser;
    // }

    // 当前返回模拟用户（后续接入数据库后改为真实数据）
    const mockUser = {
      id: 'dev-user-' + Date.now(),
      email,
      nickname: nickname || email.split('@')[0],
      avatar: null,
      is_vip: false,
      points: 100,
    };

    // 创建 session token（后续应使用 JWT 签名）
    const token = Buffer.from(JSON.stringify({
      userId: mockUser.id,
      email: mockUser.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天有效期
    })).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: mockUser,
    });

    // 设置 cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('验证错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
