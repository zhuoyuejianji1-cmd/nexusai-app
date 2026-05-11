import { NextRequest, NextResponse } from 'next/server';
import { getOrderByOutTradeNo, updateOrderStatus, verifyWechatNotify } from '@/lib/payment';

// POST /api/payment/wxpay/notify - 微信支付回调通知
// 微信支付系统会以POST方式回调此地址
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // 构造headers对象
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // 验证签名
    const result = await verifyWechatNotify(body, headers);

    if (!result.valid || !result.data) {
      console.error('微信支付回调验证失败');
      return NextResponse.json(
        { code: 'FAIL', message: '签名验证失败' },
        { status: 200 } // 微信要求返回200，即使是失败
      );
    }

    const { outTradeNo, transactionId, totalFee } = result.data;

    // 查找订单
    const order = getOrderByOutTradeNo(outTradeNo);
    if (!order) {
      console.error(`订单 ${outTradeNo} 不存在`);
      return NextResponse.json(
        { code: 'FAIL', message: '订单不存在' },
        { status: 200 }
      );
    }

    // 更新订单状态
    updateOrderStatus(order.id, 'paid', { paidAt: Date.now() });

    console.log(`订单 ${outTradeNo} 支付成功，微信交易号: ${transactionId}, 金额: ${totalFee}分`);

    // 返回成功响应 (微信要求返回特定格式)
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
