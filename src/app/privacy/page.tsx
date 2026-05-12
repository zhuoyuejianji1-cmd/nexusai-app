'use client'

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: '0 20px 80px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', color: '#333', lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>隐私政策</h1>
      <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginBottom: 32 }}>更新日期：2026年5月12日</p>

      <p style={{ marginBottom: 20, color: '#666', fontSize: 14, lineHeight: 1.6 }}>欢迎使用「资料库Pro」小程序（以下简称"本小程序"）。本小程序由广州天河星轨互联网商品销售工作室（以下简称"我们"）运营。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。本隐私政策将向您说明我们如何收集、使用、存储和保护您的个人信息。</p>

      <Section title="一、我们如何收集和使用您的个人信息">
        <p>在您使用本小程序的过程中，我们可能会收集和使用您的以下个人信息：</p>
        <List items={[
          "微信头像、昵称：当您使用微信登录时，我们会获取您的微信公开信息（头像、昵称），用于展示您的个人资料。",
          "微信OpenID：当您使用微信登录时，我们会获取您的OpenID作为您在系统中的唯一标识，用于关联订单记录和已购课程。",
          "订单信息：当您购买课程时，我们会记录您的订单信息（商品名称、金额、交易时间等），用于提供购买服务。",
          "已购课程：我们记录您已购买的课程信息，用于为您提供课程内容访问服务。",
          "浏览记录：我们记录您访问的课程页面信息，用于为您推荐更合适的内容。",
        ]} />
      </Section>

      <Section title="二、我们如何使用您的个人信息">
        <List items={[
          "为您提供登录服务和用户身份识别。",
          "处理您的购买请求并完成交易。",
          "为您提供已购课程的访问权限。",
          "改善和优化我们的服务体验。",
          "响应您的客服请求和投诉。",
        ]} />
      </Section>

      <Section title="三、我们如何存储和保护您的个人信息">
        <p>您的个人信息存储在中国境内的服务器上。我们采取符合业界标准的安全防护措施保护您的个人信息，包括但不限于SSL/TLS加密传输、数据脱敏处理、访问权限控制等。我们将仅在实现本政策所述目的所必需的期限内保留您的个人信息，超出期限后将进行删除或匿名化处理。</p>
      </Section>

      <Section title="四、支付服务说明">
        <p>本小程序中的课程购买通过微信支付完成。支付过程中涉及的支付信息（如银行卡号、支付密码等）由微信支付直接处理，我们不会收集或存储您的敏感支付信息。微信支付的具体隐私政策请参见其官方说明。</p>
      </Section>

      <Section title="五、我们如何使用Cookie和本地存储">
        <p>我们的小程序可能会使用本地存储（LocalStorage）技术来保存您的登录状态和浏览偏好，以提升您的使用体验。这些数据仅存储于您的设备本地，我们不会主动收集这些数据。</p>
      </Section>

      <Section title="六、用户协议">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>1. 服务内容</h3>
        <p>本小程序提供精品课程资料的搜索、浏览和付费下载服务。课程资料包括但不限于图文教程、视频教程、工具软件等，具体以页面展示为准。</p>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>2. 用户行为规范</h3>
        <List items={[
          "用户不得利用本小程序从事违法违规活动。",
          "用户不得对本小程序进行反向工程、破解或攻击。",
          "用户不得将购买的课程资料进行翻录、转售或公开发布。",
          "用户不得利用本小程序传播病毒、木马等恶意程序。",
        ]} />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>3. 知识产权</h3>
        <p>本小程序上提供的课程资料的知识产权归各自权利人所有。用户仅获得个人学习用途的有限使用权，不得以任何形式进行商业性使用或传播。</p>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>4. 退款政策</h3>
        <p>课程为数字化商品，一经购买成功，不支持退款。请在购买前仔细确认课程信息。如因课程内容质量问题无法使用，请联系客服处理。</p>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>5. 免责声明</h3>
        <List items={[
          "本小程序上的课程内容由第三方提供，我们不对其准确性、完整性做任何保证。",
          "因不可抗力因素导致服务中断的，我们不承担责任。",
          "用户因使用课程资料而产生的任何直接或间接损失，我们不承担责任。",
        ]} />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>6. 协议修改</h3>
        <p>我们有权根据需要修改本用户协议。修改后的协议一经发布即生效。如您不同意修改后的协议，应停止使用本小程序服务。</p>
      </Section>

      <Section title="七、您对个人信息的权利">
        <p>您可以通过以下方式行使您对个人信息的权利：</p>
        <List items={[
          "查阅您的个人信息：您可以在小程序个人中心查看您的头像、昵称和已购课程。",
          "删除您的个人信息：您可以通过联系客服要求删除您的账户信息。",
          "撤回授权：您可以通过微信设置撤回对本小程序的授权，但可能影响部分功能的正常使用。",
        ]} />
      </Section>

      <Section title="八、我们如何共享、转让和公开披露您的个人信息">
        <p>我们不会将您的个人信息共享给第三方，以下情况除外：</p>
        <List items={[
          "在法律、法规或行政、司法机关要求的情况下。",
          "为保护我们、其他用户或公众的合法权益所必需。",
          "获得您的明确同意或授权。",
        ]} />
      </Section>

      <Section title="九、隐私政策的更新">
        <p>我们可能会根据需要更新本隐私政策。更新后的政策将以小程序公告或弹窗的形式通知您。如果您继续使用本小程序，即视为您同意更新后的隐私政策。</p>
      </Section>

      <Section title="十、联系我们">
        <p>如果您对本隐私政策有任何疑问或建议，或者需要处理您的个人信息相关事务，请通过以下方式联系我们：</p>
        <p style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, margin: '8px 0' }}>邮箱：zhenjie@eastpavilion.cn</p>
      </Section>

      <div style={{
        marginTop: 48, padding: '16px 0', textAlign: 'center',
        borderTop: '1px solid #eee', color: '#999', fontSize: 12,
      }}>
        <p>广州天河星轨互联网商品销售工作室</p>
        <p>Copyright &copy; 2026 资料库Pro. All rights reserved.</p>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #5B6FFF' }}>{title}</h2>
      <div style={{ fontSize: 14, color: '#555' }}>{children}</div>
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  )
}
