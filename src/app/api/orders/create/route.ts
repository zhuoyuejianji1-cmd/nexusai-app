import { NextRequest, NextResponse } from 'next/server';
import { getProduct, createOrder, createPayment, createJSAPIPayment } from '@/lib/payment';
import { setVip } from '@/lib/redis';

// 显式声明 Node.js runtime（避免 Vercel 默认走 Edge）
export const runtime = 'nodejs';

// POST /api/orders/create - 创建订单
export async function POST(request: NextRequest) {
  let step = 'parse_body';
  try {
    const { productId, openid } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: '请提供商品ID' }, { status: 400 });
    }

    step = 'get_product';
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: '商品不存在' }, { status: 404 });
    }

    // 获取当前用户信息
    let userId: string | undefined;
    let email: string | undefined;

    step = 'parse_auth';
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const tokenData = JSON.parse(atob(token));
        userId = tokenData.openid || tokenData.userId;
        email = tokenData.email;
      } catch { /* ignore */ }
    }

    if (!userId) {
      try {
        const authToken = request.cookies.get('auth_token');
        if (authToken) {
          const tokenData = JSON.parse(atob(authToken.value));
          userId = tokenData.userId;
          email = tokenData.email;
        }
      } catch { /* ignore */ }
    }

    step = 'create_order';
    const order = createOrder(product, { userId, email });

    // VIP会员商品
    const vipId = (openid || userId) as string
    if (vipId && (productId === 'vip_monthly' || productId === 'vip_yearly' || productId === 'vip_forever')) {
      step = 'set_vip';
      let expireDate = ''
      const now = new Date()
      if (productId === 'vip_monthly') now.setMonth(now.getMonth() + 1)
      else if (productId === 'vip_yearly') now.setFullYear(now.getFullYear() + 1)
      else now.setFullYear(now.getFullYear() + 50)
      expireDate = now.toISOString().split('T')[0]
      await setVip(vipId, expireDate)
      order.status = 'paid'
      order.paidAt = Date.now()
      step = 'return_vip';
      return NextResponse.json({
        success: true, vipActivated: true,
        order: { id: order.id, outTradeNo: order.outTradeNo, productName: order.productName, totalFee: order.totalFee, status: 'paid', createdAt: order.createdAt, paidAt: order.paidAt },
        expireDate,
      })
    }

    // 免费订单
    if (order.totalFee === 0) {
      order.status = 'paid'; order.paidAt = Date.now();
      step = 'return_free';
      return NextResponse.json({
        success: true, freeOrder: true,
        order: { id: order.id, outTradeNo: order.outTradeNo, productName: order.productName, totalFee: order.totalFee, status: 'paid', createdAt: order.createdAt, paidAt: order.paidAt },
      })
    }

    // JSAPI 支付
    if (openid) {
      step = 'create_jsapi_payment';
      const { payment } = await createJSAPIPayment(order, openid);
      step = 'return_jsapi';
      return NextResponse.json({
        success: true,
        order: { id: order.id, outTradeNo: order.outTradeNo, productName: order.productName, totalFee: order.totalFee, status: order.status, createdAt: order.createdAt },
        payment,
      })
    }

    // Native 支付
    step = 'create_native_payment';
    const { codeUrl } = await createPayment(order);
    order.codeUrl = codeUrl;
    step = 'return_native';
    return NextResponse.json({
      success: true,
      order: { id: order.id, outTradeNo: order.outTradeNo, productName: order.productName, totalFee: order.totalFee, status: order.status, codeUrl: order.codeUrl, createdAt: order.createdAt },
    })
  } catch (err) {
    console.error(`创建订单失败 [step=${step}]:`, err);
    return NextResponse.json(
      { error: `创建订单失败 [${step}]: ` + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
