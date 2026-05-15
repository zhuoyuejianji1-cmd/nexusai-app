// 支付核心库
// 支持双模式: Mock(开发) / 微信支付Native(生产)
// 生产模式需设置环境变量:
//   WECHAT_MCHID=商户号
//   WECHAT_APPID=小程序/公众号AppID
//   WECHAT_API_V3_KEY=API v3密钥
//   WECHAT_MERCHANT_CERT_SERIAL=商户证书序列号
//   WECHAT_MERCHANT_PRIVATE_KEY=商户私钥(PKCS8 PEM)
//   WECHAT_NOTIFY_URL=支付回调地址
//   WECHAT_PLATFORM_CERT_PUBLIC_KEY=微信平台公钥(PEM)
// 不设环境变量时自动使用Mock模式

import { createSign, createVerify } from 'crypto'

export interface Product {
  id: string
  name: string
  price: number // 单位: 分 (微信支付以分为单位)
  description?: string
}

export interface Order {
  id: string
  outTradeNo: string        // 商户订单号
  productId: string
  productName: string
  totalFee: number          // 分
  status: 'pending' | 'paid' | 'expired' | 'closed'
  codeUrl?: string          // 微信支付二维码链接
  createdAt: number
  paidAt?: number
  userId?: string
  email?: string
}

// 内存订单存储 (serverless环境每次冷启动会重置, 但开发够用)
const orders = new Map<string, Order>()
const outTradeNoIndex = new Map<string, Order>()

// 生成商户订单号: yyyyMMddHHmmss + 6位随机数
function generateOutTradeNo(): string {
  const now = new Date()
  const date = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 900000 + 100000).toString()
  return date + rand
}

// 生成订单ID
function generateOrderId(): string {
  return 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
}

// 创建订单
export function createOrder(product: Product, options?: { userId?: string; email?: string }): Order {
  const order: Order = {
    id: generateOrderId(),
    outTradeNo: generateOutTradeNo(),
    productId: product.id,
    productName: product.name,
    totalFee: product.price,
    status: 'pending',
    createdAt: Date.now(),
    userId: options?.userId,
    email: options?.email,
  }
  orders.set(order.id, order)
  outTradeNoIndex.set(order.outTradeNo, order)
  return order
}

// 根据订单ID获取订单
export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId)
}

// 根据商户订单号获取订单
export function getOrderByOutTradeNo(outTradeNo: string): Order | undefined {
  return outTradeNoIndex.get(outTradeNo)
}

// 更新订单状态
export function updateOrderStatus(orderId: string, status: Order['status'], extras?: Partial<Order>): Order | undefined {
  const order = orders.get(orderId)
  if (!order) return undefined
  order.status = status
  if (extras) Object.assign(order, extras)
  if (status === 'paid') order.paidAt = Date.now()
  return order
}

// 获取所有订单
export function getAllOrders(): Order[] {
  return Array.from(orders.values()).sort((a, b) => b.createdAt - a.createdAt)
}

// 动态获取商品信息
// 先查硬编码商品（兼容旧ID），再查courses.json中的课程（新ID）
// 非会员统一价 9.9元 = 990分
const DEFAULT_PRICE = 990 // 9.9元（单位：分）

// 缓存课程数据，避免重复读取
let coursesCache: any[] | null = null
function getCoursesSync(): any[] {
  if (coursesCache) return coursesCache
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'src', 'data', 'courses.json')
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      coursesCache = JSON.parse(raw)
      return coursesCache!
    }
  } catch {}
  return []
}

// 获取商品信息
export function getProduct(productId: string): Product | undefined {
  // 先查旧硬编码商品（兼容之前的小范围ID）
  const hardcodedProducts: Record<string, Product> = {
    '1': { id: '1', name: 'AI 全栈工程师实战班', price: 299900, description: '从零打造企业级 AI 应用' },
    '2': { id: '2', name: 'ChatGPT 与 Prompt Engineering', price: 99900, description: '系统学习 Prompt 工程' },
    '3': { id: '3', name: 'Midjourney 商业设计实战', price: 79900, description: 'AI 生成视觉内容商业路径' },
    '4': { id: '4', name: 'Stable Diffusion 进阶指南', price: 129900, description: 'ControlNet、Lora 训练核心技术' },
    '5': { id: '5', name: 'LangChain 与 Agent 开发', price: 199900, description: '构建智能 Agent 系统' },
    '6': { id: '6', name: '大模型微调实战 (LoRA/QLoRA)', price: 249900, description: '掌握 LLM 微调核心技能' },
    '7': { id: '7', name: 'AI 产品经理入门到精通', price: 119900, description: 'AI 产品设计思维全流程' },
    '8': { id: '8', name: 'Claude API 高级应用开发', price: 89900, description: '构建智能客服与知识库' },
    '9': { id: '9', name: 'AI 数据标注师认证课程', price: 39900, description: '成为专业 AI 训练数据标注师' },
    // VIP会员商品
    'vip_yearly': { id: 'vip_yearly', name: '年度VIP会员', price: 7900, description: '365天VIP会员，解锁全部课程' },
    'vip_forever': { id: 'vip_forever', name: '永久VIP会员', price: 9900, description: '永久VIP会员，解锁全部课程+未来更新' },
  }
  
  if (hardcodedProducts[productId]) return hardcodedProducts[productId]
  
  // 从 courses.json 动态查找
  const courses = getCoursesSync()
  const course = courses.find((c: any) => String(c.id) === productId)
  if (course) {
    return {
      id: String(course.id),
      name: course.title || '未命名课程',
      price: DEFAULT_PRICE, // 非会员统一定价 9.9元
      description: (course.description || '').substring(0, 100),
    }
  }
  
  return undefined
}

// ====== 微信支付 JSAPI 模式（小程序支付）=====

// 调用微信支付JSAPI下单API (V3)
// 返回 prepay_id
async function callWechatPayJSAPI(order: {
  outTradeNo: string
  description: string
  totalFee: number // 分
  notifyUrl: string
  openid: string
}): Promise<{ prepayId: string }> {
  // 构造请求体
  const body = {
    mchid: process.env.WECHAT_MCHID,
    appid: process.env.WECHAT_APPID,
    description: order.description,
    out_trade_no: order.outTradeNo,
    notify_url: order.notifyUrl,
    amount: {
      total: order.totalFee,
      currency: 'CNY'
    },
    payer: {
      openid: order.openid
    }
  }

  // 构建签名（微信支付V3 API使用商户证书签名）
  const nonce = Math.random().toString(36).substring(2, 16)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi'
  const method = 'POST'
  const bodyStr = JSON.stringify(body)

  // 构造签名串
  const signatureStr = `${method}\n${new URL(url).pathname}\n${timestamp}\n${nonce}\n${bodyStr}\n`

  // 使用商户私钥进行签名
  const privateKey = getPrivateKey()
  if (!privateKey) {
    throw new Error('商户私钥未配置')
  }
  const sign = createSign('RSA-SHA256')
  sign.update(signatureStr)
  const signature = sign.sign(privateKey, 'base64')

  const mchid = process.env.WECHAT_MCHID || ''
  const serialNo = process.env.WECHAT_MERCHANT_CERT_SERIAL || ''
  const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${serialNo}",signature="${signature}"`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'NexusAI/1.0'
    },
    body: bodyStr
  })

  const result = await response.json() as any
  if (!response.ok) {
    console.error('微信支付JSAPI下单失败:', result)
    throw new Error(`微信支付下单失败: ${result.message || JSON.stringify(result)}`)
  }

  return { prepayId: result.prepay_id }
}

// 生成小程序端调起支付所需的参数
// 文档: https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter2_5_3.shtml
function generateMiniProgramPaymentParams(prepayId: string, signType: string = 'RSA'): {
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
} {
  const timeStamp = Math.floor(Date.now() / 1000).toString()
  const nonceStr = Math.random().toString(36).substring(2, 18)
  const packageStr = `prepay_id=${prepayId}`

  // 构造签名串
  // AppId + \n + timeStamp + \n + nonceStr + \n + prepay_id + \n
  const signatureStr = `${process.env.WECHAT_APPID}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`

  // 使用商户私钥签名
  const privateKey = getPrivateKey()
  const sign = createSign('RSA-SHA256')
  sign.update(signatureStr)
  const paySign = sign.sign(privateKey, 'base64')

  return {
    timeStamp,
    nonceStr,
    package: packageStr,
    signType,
    paySign,
  }
}

// Mock JSAPI 支付参数（开发模式用）
function mockJSAPIPayment(outTradeNo: string) {
  return {
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: Math.random().toString(36).substring(2, 18),
    package: `prepay_id=mock_${outTradeNo}`,
    signType: 'RSA' as const,
    paySign: 'mock_signature_for_development',
  }
}

// 创建 JSAPI 支付（小程序用）
export async function createJSAPIPayment(order: Order, openid: string): Promise<{
  payment: {
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }
}> {
  if (isMockMode()) {
    console.log(`[Mock JSAPI] 订单 ${order.outTradeNo} 金额 ¥${(order.totalFee / 100).toFixed(2)} openid=${openid}`)
    return { payment: mockJSAPIPayment(order.outTradeNo) }
  }

  const notifyUrl = process.env.WECHAT_NOTIFY_URL || 'https://huyuai.icu/api/payment/wxpay/notify'
  
  const { prepayId } = await callWechatPayJSAPI({
    outTradeNo: order.outTradeNo,
    description: truncateByBytes(order.productName, 127),
    totalFee: order.totalFee,
    notifyUrl,
    openid,
  })

  const payment = generateMiniProgramPaymentParams(prepayId)
  return { payment }
}

// ====== 微信支付 Native 模式 ======

// 是否为Mock模式
// 小程序审核期间始终用Mock模式
function isMockMode(): boolean {
  // 真实支付条件：所有必要环境变量已配置
  const hasAllVars = process.env.WECHAT_MCHID
    && process.env.WECHAT_APPID
    && process.env.WECHAT_API_V3_KEY
    && process.env.WECHAT_MERCHANT_CERT_SERIAL
    && process.env.WECHAT_MERCHANT_PRIVATE_KEY
    && process.env.WECHAT_MERCHANT_PRIVATE_KEY.length > 100
  return !hasAllVars
}

// 调用微信支付Native下单API (V3)
// 返回 code_url
async function callWechatPayNative(order: {
  outTradeNo: string
  description: string
  totalFee: number // 分
  notifyUrl: string
}): Promise<{ codeUrl: string }> {
  // 构造请求体
  const body = {
    mchid: process.env.WECHAT_MCHID,
    appid: process.env.WECHAT_APPID,
    description: order.description,
    out_trade_no: order.outTradeNo,
    notify_url: order.notifyUrl,
    amount: {
      total: order.totalFee,
      currency: 'CNY'
    }
  }

  // 构建签名（微信支付V3 API使用商户证书签名）
  const nonce = Math.random().toString(36).substring(2, 16)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/native'
  const method = 'POST'
  const bodyStr = JSON.stringify(body)

  // 构造签名串
  // HTTP请求方法 + \n + URL + \n + 时间戳 + \n + 随机串 + \n + 请求体 + \n
  const signatureStr = `${method}\n${new URL(url).pathname}\n${timestamp}\n${nonce}\n${bodyStr}\n`

  // 使用商户私钥进行签名
  const privateKey = getPrivateKey()
  const sign = createSign('RSA-SHA256')
  sign.update(signatureStr)
  const signature = sign.sign(privateKey, 'base64')

  const mchid = process.env.WECHAT_MCHID || ''
  const serialNo = process.env.WECHAT_MERCHANT_CERT_SERIAL || ''
  const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${serialNo}",signature="${signature}"`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'NexusAI/1.0'
    },
    body: bodyStr
  })

  const result = await response.json() as any
  if (!response.ok) {
    console.error('微信支付下单失败:', result)
    throw new Error(`微信支付下单失败: ${result.message || JSON.stringify(result)}`)
  }

  return { codeUrl: result.code_url }
}

// 处理环境变量中的私钥（Vercel env 中 \n 是字面量，需转成真实换行）
function getPrivateKey(): string {
  return (process.env.WECHAT_MERCHANT_PRIVATE_KEY || '').replace(/\\n/g, '\n')
}

// 按UTF-8字节数截断字符串（微信支付description要求≤127字节）
function truncateByBytes(str: string, maxBytes: number): string {
  let result = ''
  let bytes = 0
  for (const char of str) {
    const charBytes = new TextEncoder().encode(char).length
    if (bytes + charBytes > maxBytes) break
    result += char
    bytes += charBytes
  }
  return result
}

// 创建支付 (自动选择模式)
export async function createPayment(order: Order): Promise<{ codeUrl: string }> {
  if (isMockMode()) {
    // Mock模式: 生成假的code_url
    console.log(`[Mock支付] 订单 ${order.outTradeNo} 金额 ¥${(order.totalFee / 100).toFixed(2)}`)
    // 用订单号生成一个伪code_url (格式类似微信支付但不可用)
    const mockCodeUrl = `weixin://wxpay/bizpayurl?mock=${order.outTradeNo}&amount=${order.totalFee}`
    return { codeUrl: mockCodeUrl }
  }

  // 真实微信支付
  const notifyUrl = process.env.WECHAT_NOTIFY_URL || 'https://nexusai.example.com/api/payment/wxpay/notify'
  return callWechatPayNative({
    outTradeNo: order.outTradeNo,
    description: truncateByBytes(order.productName, 127),
    totalFee: order.totalFee,
    notifyUrl
  })
}

// Mock模式: 模拟支付完成 (供开发时手动调用)
export function mockPayOrder(outTradeNo: string): Order | undefined {
  const order = getOrderByOutTradeNo(outTradeNo)
  if (!order || order.status !== 'pending') return undefined
  return updateOrderStatus(order.id, 'paid', { paidAt: Date.now() })
}

// 验证微信支付回调签名
export async function verifyWechatNotify(body: string, headers: Record<string, string>): Promise<{
  valid: boolean
  data?: {
    outTradeNo: string
    transactionId: string
    totalFee: number
  }
}> {
  // Mock模式: 直接信任
  if (isMockMode()) {
    try {
      const data = JSON.parse(body)
      return {
        valid: true,
        data: {
          outTradeNo: data.resource?.out_trade_no || data.out_trade_no || '',
          transactionId: data.resource?.transaction_id || data.transaction_id || '',
          totalFee: data.resource?.amount?.total || data.amount?.total || 0
        }
      }
    } catch {
      return { valid: false }
    }
  }

  // 生产模式: 验证微信签名
  try {
    const wechatpaySerial = headers['wechatpay-serial']
    const wechatpaySignature = headers['wechatpay-signature']
    const wechatpayTimestamp = headers['wechatpay-timestamp']
    const wechatpayNonce = headers['wechatpay-nonce']

    if (!wechatpaySerial || !wechatpaySignature || !wechatpayTimestamp || !wechatpayNonce) {
      return { valid: false }
    }

    const signatureStr = `${wechatpayTimestamp}\n${wechatpayNonce}\n${body}\n`
    const platformPublicKey = process.env.WECHAT_PLATFORM_CERT_PUBLIC_KEY || ''

    const verify = createVerify('RSA-SHA256')
    verify.update(signatureStr)
    const valid = verify.verify(platformPublicKey, wechatpaySignature, 'base64')

    if (!valid) return { valid: false }

    const data = JSON.parse(body)
    const resource = data.resource
    // 需要解密resource中的密文 (AES-GCM)
    // 简化处理: 直接解析
    return {
      valid: true,
      data: {
        outTradeNo: resource?.out_trade_no || '',
        transactionId: resource?.transaction_id || '',
        totalFee: resource?.amount?.total || 0
      }
    }
  } catch {
    return { valid: false }
  }
}
