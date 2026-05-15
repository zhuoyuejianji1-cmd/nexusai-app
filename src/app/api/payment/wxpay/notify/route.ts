import { NextRequest, NextResponse } from 'next/server';
import { getOrderByOutTradeNo, updateOrderStatus, verifyWechatNotify } from '@/lib/payment';
import { setVip } from '@/lib/redis';

// POST /api/payment/wxpay/notify - 微信支付回调通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const result = await verifyWechatNotify(body, headers);

    if (!result.valid || !result.data) {
      console.error('微信支付回调验证失败');
      return NextResponse.json(
        { code: 'FAIL', message: '签名验证失败' },
        { status: 200 }
      );
    }

    const { outTradeNo, transactionId, totalFee } = result.data;

    const order = getOrderByOutTradeNo(outTradeNo);
    if (!order) {
      console.error(`订单 ${outTradeNo} 不存在`);
      return NextResponse.json(
        { code: 'FAIL', message: '订单不存在' },
        { status: 200 }
      );
    }

    updateOrderStatus(order.id, 'paid', { paidAt: Date.now() });

    console.log(`订单 ${outTradeNo} 支付成功，微信交易号: ${transactionId}, 金额: ${totalFee}分`);

    // 如果是VIP会员商品，激活VIP
    const vipProductIds = ['vip_monthly', 'vip_yearly', 'vip_forever'];
    if (vipProductIds.includes(order.productId) && order.userId) {
      const now = new Date();
      if (order.productId === 'vip_monthly') now.setMonth(now.getMonth() + 1);
      else if (order.productId === 'vip_yearly') now.setFullYear(now.getFullYear() + 1);
      else now.setFullYear(now.getFullYear() + 50);
      const expireDate = now.toISOString().split('T')[0];
      await setVip(order.userId, expireDate);
      console.log(`VIP已激活: userId=${order.userId}, 产品=${order.productId}, 到期=${expireDate}`);
    }

    return NextResponse.json(
      { code: 'SUCCESS', message: '成功' },
      { status: 200 }
    );
  } catch (err) {
    console.error('支付回调处理失败:', err);
    return NextResponse.json(
      { code: 'FAIL', message: '处理失败' },
      { status: 200 }
    );
  }
}
