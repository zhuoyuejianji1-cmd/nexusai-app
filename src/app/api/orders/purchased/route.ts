import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/payment';
import { getProduct } from '@/lib/payment';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// 加载课程数据
function loadCourses(): any[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
    if (!existsSync(filePath)) return [];
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// GET /api/orders/purchased - 获取已购课程列表
// 需要认证: 从 token 中提取 openid/userId
export async function GET(request: NextRequest) {
  try {
    // 解析 token
    const authHeader = request.headers.get('Authorization');
    let userId: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        userId = tokenData.openid || tokenData.userId;
      } catch {
        // token 解析失败
      }
    }

    // 也尝试从 cookie 读取（兼容 Web 端）
    if (!userId) {
      try {
        const authToken = request.cookies.get('auth_token');
        if (authToken) {
          const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString('utf-8'));
          userId = tokenData.userId;
        }
      } catch {
        // 忽略
      }
    }

    if (!userId) {
      return NextResponse.json({ data: [], total: 0 });
    }

    // 获取所有已支付订单
    const allOrders = getAllOrders().filter(
      (o) => o.status === 'paid' && (o.userId === userId || o.email === userId)
    );

    // 加载课程数据获取缩略图等信息
    const courses = loadCourses();

    // 丰富订单数据
    const purchased = allOrders.map((order) => {
      const course = courses.find((c: any) => String(c.id) === order.productId);
      return {
        orderId: order.id,
        outTradeNo: order.outTradeNo,
        productId: order.productId,
        productName: order.productName,
        status: order.status,
        paidAt: order.paidAt,
        totalFee: order.totalFee,
        thumbnail: course?.thumbnail || '',
        title: course?.title || order.productName,
      };
    });

    return NextResponse.json({
      success: true,
      data: purchased,
      total: purchased.length,
    });

  } catch (error) {
    console.error('获取已购课程失败:', error);
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    );
  }
}
