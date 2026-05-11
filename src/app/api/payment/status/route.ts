import { NextRequest, NextResponse } from 'next/server';
import { getOrder, mockPayOrder } from '@/lib/payment';

// GET /api/payment/status?id=xxx - 查询订单支付状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const outTradeNo = searchParams.get('out_trade_no');

    if (!orderId && !outTradeNo) {
      return NextResponse.json(
        { error: '请提供订单ID或商户订单号' },
        { status: 400 }
      );
    }

    const order = orderId ? getOrder(orderId) : null;

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        outTradeNo: order.outTradeNo,
        productName: order.productName,
        totalFee: order.totalFee,
        status: order.status,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
      },
    });
  } catch (err) {
    console.error('查询订单失败:', err);
    return NextResponse.json(
      { error: '查询失败' },
      { status: 500 }
    );
  }
}

// POST /api/payment/status - Mock模拟支付完成 (开发模式)
// 生产环境请删除此方法或加权限校验
export async function POST(request: NextRequest) {
  try {
    const { out_trade_no } = await request.json();

    if (!out_trade_no) {
      return NextResponse.json(
        { error: '请提供商户订单号' },
        { status: 400 }
      );
    }

    const order = mockPayOrder(out_trade_no);
    if (!order) {
      return NextResponse.json(
        { error: '订单不存在或状态不允许' },
        { status: 400 }
      );
    }

    console.log(`[Mock] 订单 ${out_trade_no} 模拟支付成功`);

    return NextResponse.json({
      success: true,
      message: '支付成功（模拟）',
      order: {
        id: order.id,
        outTradeNo: order.outTradeNo,
        status: order.status,
        paidAt: order.paidAt,
      },
    });
  } catch (err) {
    console.error('模拟支付失败:', err);
    return NextResponse.json(
      { error: '模拟支付失败' },
      { status: 500 }
    );
  }
}
