import { NextRequest, NextResponse } from 'next/server';
import { getProduct, createOrder, createPayment } from '@/lib/payment';

// POST /api/orders/create - 创建订单并获取支付二维码
export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

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

    // 获取当前用户信息 (从cookie)
    let userId: string | undefined;
    let email: string | undefined;
    try {
      const authToken = request.cookies.get('auth_token');
      if (authToken) {
        const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
        userId = tokenData.userId;
        email = tokenData.email;
      }
    } catch {
      // 未登录也可以创建订单
    }

    // 创建订单
    const order = createOrder(product, { userId, email });

    // 如果总价为0（VIP免费），直接标记为已支付
    if (order.totalFee === 0) {
      order.status = 'paid';
      order.paidAt = Date.now();
      // 直接返回成功，不需要生成二维码
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

    // 获取支付二维码
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
