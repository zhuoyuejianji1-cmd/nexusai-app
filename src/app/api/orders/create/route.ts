import { NextRequest, NextResponse } from 'next/server';
import { getProduct, createOrder, createPayment, createJSAPIPayment } from '@/lib/payment';

// POST /api/orders/create - 创建订单
// 支持两种支付方式:
//   - JSAPI (小程序): 需要提供 openid
//   - Native (网页): 不需要 openid, 返回二维码
export async function POST(request: NextRequest) {
  try {
    const { productId, openid } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: '请提供商品ID' },
        { status: 400 }
      );
    }

    // 获取商品信息
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    // 获取当前用户信息
    let userId: string | undefined;
    let email: string | undefined;

    // 小程序: 从 Bearer token 解析
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
        userId = tokenData.openid || tokenData.userId;
        email = tokenData.email;
      } catch { /* 忽略 */ }
    }

    // Web: 从 cookie 解析
    if (!userId) {
      try {
        const authToken = request.cookies.get('auth_token');
        if (authToken) {
          const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
          userId = tokenData.userId;
          email = tokenData.email;
        }
      } catch { /* 忽略 */ }
    }

    // 创建订单
    const order = createOrder(product, { userId, email });

    // 如果总价为0（免费），直接标记为已支付
    if (order.totalFee === 0) {
      order.status = 'paid';
      order.paidAt = Date.now();
      return NextResponse.json({
        success: true,
        freeOrder: true,
        order: {
          id: order.id,
          outTradeNo: order.outTradeNo,
          productName: order.productName,
          totalFee: order.totalFee,
          status: 'paid',
          createdAt: order.createdAt,
          paidAt: order.paidAt,
        },
      });
    }

    // JSAPI 支付（小程序）
    if (openid) {
      const { payment } = await createJSAPIPayment(order, openid);
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          outTradeNo: order.outTradeNo,
          productName: order.productName,
          totalFee: order.totalFee,
          status: order.status,
          createdAt: order.createdAt,
        },
        payment,
      });
    }

    // Native 支付（网页）
    const { codeUrl } = await createPayment(order);
    order.codeUrl = codeUrl;

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        outTradeNo: order.outTradeNo,
        productName: order.productName,
        totalFee: order.totalFee,
        status: order.status,
        codeUrl: order.codeUrl,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    console.error('创建订单失败:', err);
    return NextResponse.json(
      { error: '创建订单失败: ' + (err instanceof Error ? err.message : '服务器错误') },
      { status: 500 }
    );
  }
}
