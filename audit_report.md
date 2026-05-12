# NexusAI 全站代码审计报告

- 扫描时间: 2026-05-12
- 扫描文件数: 97
- 发现总问题数: 23

| 类别 | 数量 | 严重程度 |
|------|------|---------|
| console_log | 8 | 低 |
| todos | 3 | 低 |
| mock_data | 3 | 中 |
| potential_bugs | 5 | 高 |
| security_issues | 4 | 严重 |

---
## console_log (8处)

- **src\components\home\create-post.tsx:32** - 
  ```
  console.log('发布动态:', content);
  ```
- **src\server.ts:29** - 
  ```
  console.log(
  ```
- **src\app\api\auth\send-code\route.ts:37** - 
  ```
  console.log(`【开发环境】验证码 ${code} 已发送至 ${email}`);
  ```
- **src\app\api\auth\send-code\route.ts:106** - 
  ```
  console.log(`验证码 ${code} 已发送至 ${email}`);
  ```
- **src\app\api\auth\verify-code\route.ts:23** - 
  ```
  console.log(`【开发模式】验证码 ${code} 绕过验证（文件存储不可用）`);
  ```
- **src\app\api\payment\status\route.ts:69** - 
  ```
  console.log(`[Mock] 订单 ${out_trade_no} 模拟支付成功`);
  ```
- **src\app\api\payment\wxpay\notify\route.ts:42** - 
  ```
  console.log(`订单 ${outTradeNo} 支付成功，微信交易号: ${transactionId}, 金额: ${totalFee}分`);
  ```
- **src\lib\payment.ts:242** - 
  ```
  console.log(`[Mock支付] 订单 ${order.outTradeNo} 金额 ¥${(order.totalFee / 100).toFixed(2)}`)
  ```

---
## todos (3处)

- **src\app\api\auth\me\route.ts:20** - TODO
  ```
  // TODO: 从数据库获取用户信息
  ```
- **src\app\api\auth\verify-code\route.ts:31** - TODO
  ```
  // TODO: 从数据库查找或创建用户
  ```
- **src\app\api\payment\status\route.ts:4** - XXX
  ```
  // GET /api/payment/status?id=xxx - 查询订单支付状态
  ```

---
## mock_data (3处)

- **src\app\profile\page.tsx:37** - 
  ```
  const mockUser = {
  ```
- **src\app\api\auth\me\route.ts:26** - 
  ```
  const mockUser = {
  ```
- **src\app\api\auth\verify-code\route.ts:48** - 
  ```
  const mockUser = {
  ```

---
## potential_bugs (5处)

> 严重程度: **高**，需要尽快处理

- **src\app\login\page.tsx:58** - fetch未检查响应状态
  ```
  const res = await fetch('/api/auth/send-code', {
  ```
- **src\app\login\page.tsx:86** - fetch未检查响应状态
  ```
  const res = await fetch('/api/auth/verify-code', {
  ```
- **src\app\payment\page.tsx:136** - fetch未检查响应状态
  ```
  const res = await fetch('/api/payment/status', {
  ```
- **src\components\layout\navbar.tsx:233** - fetch未检查响应状态
  ```
  await fetch('/api/auth/logout', { method: 'POST' });
  ```
- **src\lib\payment.ts:205** - fetch未检查响应状态
  ```
  const response = await fetch(url, {
  ```

---
## security_issues (4处)

> 严重程度: **严重**，需要尽快处理

- **src\proxy.ts:37** - Base64伪加密作为认证Token
  ```
  const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
  ```
- **src\app\api\auth\me\route.ts:13** - Base64伪加密作为认证Token
  ```
  const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
  ```
- **src\app\api\auth\verify-code\route.ts:62** - Base64伪加密作为认证Token
  ```
  })).toString('base64');
  ```
- **src\app\api\orders\create\route.ts:31** - Base64伪加密作为认证Token
  ```
  const tokenData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
  ```