import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路由
const protectedRoutes = ['/learn', '/profile', '/resources/premium'];
// 付费资源的前缀
const premiumPrefix = '/api/resources/premium';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是需要登录的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPremiumApi = pathname.startsWith(premiumPrefix);
  
  if (isProtectedRoute || isPremiumApi) {
    // 获取 auth token
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken) {
      // 未登录，重定向到登录页
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // API 返回 401
      return NextResponse.json(
        { error: '请先登录', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    
    // 验证 token（实际应该解密验证）
    try {
      const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
      
      // 检查 token 是否过期
      if (tokenData.exp < Date.now()) {
        throw new Error('Token expired');
      }
      
      // 将用户信息传递给后续处理
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', tokenData.userId);
      requestHeaders.set('x-user-email', tokenData.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      // Token 无效，清除并重定向
      const response = isProtectedRoute 
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.json({ error: '登录已过期', code: 'TOKEN_INVALID' }, { status: 401 });
      
      response.cookies.delete('auth_token');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/learn/:path*',
    '/profile/:path*',
    '/resources/premium/:path*',
    '/api/resources/premium/:path*',
  ],
};
