import { NextRequest, NextResponse } from 'next/server';
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
    
    // TODO: 从数据库验证验证码
    // const record = await db.query.verification_codes.findFirst({
    //   where: eq(and(
    //     eq(verification_codes.email, email),
    //     eq(verification_codes.code, code),
    //     eq(verification_codes.used, false),
    //     gt(verification_codes.expires_at, new Date())
    //   )),
    // });
    // 
    // if (!record) {
    //   return NextResponse.json({ error: '验证码错误或已过期' }, { status: 400 });
    // }
    
    // 开发环境模拟验证（实际使用时删除）
    if (process.env.NODE_ENV === 'development') {
      // 模拟验证通过
      console.log(`验证码 ${code} 验证通过`);
    }
    
    // TODO: 标记验证码已使用
    // await db.update(verification_codes)
    //   .set({ used: true })
    //   .where(eq(verification_codes.id, record.id));
    
    // 查找或创建用户
    // const existingUser = await db.query.users.findFirst({
    //   where: eq(users.email, email),
    // });
    // 
    // let user;
    // if (existingUser) {
    //   user = existingUser;
    // } else {
    //   // 创建新用户
    //   const [newUser] = await db.insert(users).values({
    //     email,
    //     nickname: nickname || email.split('@')[0],
    //     login_type: 'email',
    //   }).returning();
    //   user = newUser;
    // }
    
    // 开发环境模拟返回
    const mockUser = {
      id: 'dev-user-' + Date.now(),
      email,
      nickname: nickname || email.split('@')[0],
      is_vip: false,
      points: 100,
    };
    
    // 创建 session/token（实际使用需要加密）
    // 这里简单返回用户信息，生产环境应该使用 JWT 或 session
    const token = Buffer.from(JSON.stringify({
      userId: mockUser.id,
      email: mockUser.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天有效期
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
