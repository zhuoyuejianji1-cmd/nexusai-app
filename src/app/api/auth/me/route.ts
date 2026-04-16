import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken) {
      return NextResponse.json({ user: null });
    }
    
    // 解析 token
    try {
      const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
      
      // 检查是否过期
      if (tokenData.exp < Date.now()) {
        return NextResponse.json({ user: null });
      }
      
      // TODO: 从数据库获取用户信息
      // const user = await db.query.users.findFirst({
      //   where: eq(users.id, tokenData.userId),
      // });
      
      // 开发环境模拟返回
      const mockUser = {
        id: tokenData.userId,
        email: tokenData.email,
        nickname: tokenData.email?.split('@')[0] || '用户',
        avatar: null,
        is_vip: false,
        points: 100,
      };
      
      return NextResponse.json({ user: mockUser });
      
    } catch {
      return NextResponse.json({ user: null });
    }
    
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json({ user: null });
  }
}
