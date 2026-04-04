import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { PageSEO, SITE_URL } from '../components/StructuredData'

const experts = [
  // ── 美团管理层 ──
  {
    id: 'wang-xing',
    name: '王兴',
    nameEn: 'Wang Xing',
    title: '美团创始人、董事长兼 CEO',
    org: '美团（3690.HK）',
    avatar: '👤',
    avatarBg: 'from-orange-400 to-orange-600',
    tag: '美团',
    tagColor: '#FF5A00',
    tagBg: '#FFF0E6',
    bio: '清华大学电子工程系本科（1997级），美国特拉华大学计算机工程硕士。中国互联网连续创业者，2010年创立美团。2015年主导美团与大众点评合并，构建中国最大本地生活服务平台。2018年带领美团在港交所上市，市值一度超越京东、小米，成为中国第四大互联网公司。美团现拥有数亿用户、超百万骑手、覆盖数百万商家，是物理世界服务数字化程度最深的平台之一。',
    latestInsight: {
      quote: 'AI 带来的变化，会比整个互联网带来的变化还要大得多。在这场 AI 革命中，唯一有意义的策略就是进攻，而不是防守。我们将争取把美团 App 率先升级成 AI-powered App。',
      source: '2026年3月 · 美团财报电话会',
    },
    relevance: '战略层：平台愿景与 AI 方向定义者',
  },
  {
    id: 'wang-puzhong',
    name: '王莆中',
    nameEn: 'Wang Puzhong',
    title: '美团核心本地商业 CEO · 高级副总裁',
    org: '美团核心本地商业',
    avatar: '👤',
    avatarBg: 'from-red-400 to-red-600',
    tag: '美团',
    tagColor: '#FF5A00',
    tagBg: '#FFF0E6',
    bio: '工程师出身，百度外卖1号员工，2015年加入美团。历任外卖配送高级产品总监、到家事业群总裁，2024年出任核心本地商业CEO，统管美团平台、到店、到家及基础研发全板块，是美团最核心决策层 S-team 成员。主导美团外卖从餐饮向「万物到家」即时零售拓展，将美团医药做到第一梯队，带领即时零售订单量2024年同比增长26.2%，县域市场增幅达54%。',
    latestInsight: {
      quote: '建设物理世界最全最准的数据基础，为模型、C端 Agent 所用。帮商家去了解和改造物理世界，是我们非常清晰的战略。帮每个商家都用上自己的 AI 助理。',
      source: '2026年3月 · 美团管理层沟通会',
    },
    relevance: '执行层：本地生活 AI 数据战略操盘手',
  },

  // ── 用户体验专家 ──
  {
    id: 'steve-krug',
    name: 'Steve Krug',
    nameEn: 'Steve Krug',
    title: '可用性测试之父',
    org: '独立顾问 · Advanced Common Sense',
    avatar: '💡',
    avatarBg: 'from-blue-400 to-blue-600',
    tag: 'UX',
    tagColor: '#1D4ED8',
    tagBg: '#EFF6FF',
    bio: '可用性领域最具影响力的作者与顾问，职业生涯横跨35年，服务过苹果、路透社、美国运通等顶级机构。其核心理念"不要让我思考（Don\'t Make Me Think）"已成为Web可用性设计的黄金法则。专长于用户测试方法论、用户行为路径分析与界面认知负担评估，主张"便宜但频繁的用户测试"优于"昂贵的大型测试"。',
    latestInsight: {
      quote: "The most important thing you can do is to get out of the way. If something requires a large investment of time—or looks like it will—it's less likely to be used.",
      source: '《Don\'t Make Me Think, Revisited》(2014)',
    },
    relevance: '用户行为路径 · 店铺点进去不是详情页 = 用户预期与实际跳转不符，Krug的核心命题',
    books: ["《Don't Make Me Think》", '《Rocket Surgery Made Easy》'],
  },
  {
    id: 'jakob-nielsen',
    name: 'Jakob Nielsen',
    nameEn: 'Jakob Nielsen',
    title: '十大可用性原则创立者',
    org: 'Nielsen Norman Group 联合创始人',
    avatar: '🎯',
    avatarBg: 'from-purple-400 to-purple-600',
    tag: 'UX',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    bio: '全球最知名的Web可用性研究者，毕业于丹麦技术大学（计算机科学博士）。与Don Norman共同创立Nielsen Norman Group，提出"Nielsen的十大可用性启发式原则"，被全球产品团队广泛采用。在Sun Microsystems和Apple任职期间主导多个交互研究项目，发表超过80篇可用性论文。尤其擅长：系统状态可见性、错误预防、用户控制与自由度。',
    latestInsight: {
      quote: 'Visibility of system status: The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.',
      source: '《10 Usability Heuristics for User Interface Design》',
    },
    relevance: '黑色透明遮罩无内容 = 违反"系统状态可见性"原则，用户不知道发生了什么',
    books: ['《Designing Web Usability》', '《Homepage Usability》'],
  },
  {
    id: 'luke-wroblewski',
    name: 'Luke Wroblewski',
    nameEn: 'Luke Wroblewski',
    title: 'Mobile First 概念提出者',
    org: 'Google · Product Director',
    avatar: '📱',
    avatarBg: 'from-green-400 to-green-600',
    tag: 'Mobile',
    tagColor: '#065F46',
    tagBg: '#ECFDF5',
    bio: '互联网移动设计领域最具影响力的思想家，提出"Mobile First"设计哲学，颠覆了PC-first的传统设计路径。曾任Yahoo首席设计架构师，后创立Polar（被Google收购）。现为Google产品总监，专注于跨设备体验、移动端交互设计和表单设计最佳实践。著有三本行业圣经级著作，演讲足迹遍及全球50+国家。',
    latestInsight: {
      quote: "Mobile forces you to focus. It forces you to make the hard decisions about what matters most to your users and your business—because there is simply no room for anything else.",
      source: '《Mobile First》(2011)',
    },
    relevance: '纯展示型数据平台设计原则，禁止交易入口的移动端设计边界如何界定',
    books: ['《Mobile First》', '《Web Form Design》', '《Designing with Progressive Disclosure》'],
  },

  // ── GEO 增长专家 ──
  {
    id: 'kevin-indig',
    name: 'Kevin Indig',
    nameEn: 'Kevin Indig',
    title: '前 Shopify / G2 增长负责人',
    org: 'Growth Memo · 独立增长顾问',
    avatar: '📈',
    avatarBg: 'from-teal-400 to-teal-600',
    tag: '增长',
    tagColor: '#0F766E',
    tagBg: '#F0FDFA',
    bio: '硅谷增长领域顶级实践者，曾先后担任G2（估值超10亿美元SaaS平台）技术SEO总监、Shopify增长负责人，现为独立增长顾问，运营订阅制增长通讯《Growth Memo》。专长将SEO与GEO（生成式引擎优化）结合，以工程化视角构建内容规模化增长体系。他率先将"AI Search Optimization"系统化，研究大模型如何抓取、理解和引用商业内容。',
    latestInsight: {
      quote: "GEO is about making your content the best source for AI systems to reference. The shift from clicks to citations changes everything about how we think about content strategy.",
      source: 'Growth Memo Newsletter (2024)',
    },
    relevance: '增长与内容规模化，工程化视角 · AI时代内容平台的搜索引擎可见性策略',
    books: ['Growth Memo Newsletter', 'Shopify SEO Case Studies'],
  },
]

const tagConfig = {
  '美团': { color: '#FF5A00', bg: '#FFF0E6' },
  'UX':   { color: '#1D4ED8', bg: '#EFF6FF' },
  'Mobile': { color: '#065F46', bg: '#ECFDF5' },
  '增长':  { color: '#0F766E', bg: '#F0FDFA' },
}

export default function About() {
  return (
    <div>
      <PageSEO
        title="CEO 圆桌 · 专家顾问团 | source.dianping.com"
        description="汇聚美团管理层（王兴、王莆中）与全球顶级用户体验专家（Steve Krug、Jakob Nielsen、Luke Wroblewski）及增长专家（Kevin Indig），共同探讨本地生活服务数字化与口碑数据平台产品设计原则。"
        keywords={['王兴', '王莆中', 'Steve Krug', 'Jakob Nielsen', 'Luke Wroblewski', 'Kevin Indig', 'UX', '美团', '可用性', '口碑数据', '本地生活']}
        canonicalPath="/about"
      />
      <Navbar />

      <main className="max-w-1200 mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: '#FFF0E6', color: '#FF5A00' }}>
            <span>🎙️</span>
            <span>CEO 圆桌 · 专家顾问团</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3" style={{ letterSpacing: '-0.02em' }}>
            谁在讨论口碑数据平台的<br className="md:hidden" />未来？
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            汇聚美团管理层与全球顶级 UX、增长专家，围绕「纯展示型数据平台设计原则」「AI 时代可用性原则」「移动端数据展示边界」三大议题展开讨论。
          </p>
        </div>

        {/* 三大议题 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🎯', title: '议题一：数据平台设计原则', desc: '纯展示型定位，聚焦口碑数据呈现，禁止内嵌交易入口（领券/团购/套餐），多站协同互链' },
            { icon: '🔍', title: '议题二：可用性关键问题', desc: '店铺点击后跳转综合页而非详情页（用户预期不符）；黑色遮罩无内容（系统状态不可见）' },
            { icon: '📱', title: '议题三：移动端数据展示', desc: '移动优先原则下，口碑数据平台如何在有限屏幕内最大化信息密度与可读性' },
          ].map((topic, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-3">{topic.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{topic.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>

        {/* 分组标题：美团管理层 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2">美团管理层</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {experts.filter(e => e.tag === '美团').map(expert => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>

        {/* 分组标题：用户体验专家 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2">用户体验专家</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {experts.filter(e => e.tag === 'UX' || e.tag === 'Mobile').map(expert => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>

        {/* 分组标题：增长专家 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2">增长专家</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 mb-10">
          {experts.filter(e => e.tag === '增长').map(expert => (
            <ExpertCard key={expert.id} expert={expert} wide />
          ))}
        </div>

        {/* 底部回首页 */}
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'var(--color-primary)' }}>
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  )
}

function ExpertCard({ expert, wide = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${wide ? 'md:flex-row' : ''}`}>
      {/* 头部色块 */}
      <div className={`bg-gradient-to-br ${expert.avatarBg} flex items-center justify-center text-4xl ${wide ? 'md:w-48 md:flex-shrink-0' : 'h-24'}`}>
        <span>{expert.avatar}</span>
      </div>

      <div className="p-5 flex-1">
        {/* 姓名 + tag */}
        <div className="flex items-start gap-2 mb-1">
          <div className="flex-1">
            <h2 className="text-lg font-black text-gray-900">{expert.name}</h2>
            {expert.name !== expert.nameEn && (
              <p className="text-xs text-gray-400">{expert.nameEn}</p>
            )}
          </div>
          <span
            className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5"
            style={{ color: expert.tagColor, background: expert.tagBg }}
          >
            {expert.tag}
          </span>
        </div>

        <p className="text-sm font-semibold text-gray-600 mb-1">{expert.title}</p>
        <p className="text-xs text-gray-400 mb-3">{expert.org}</p>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">{expert.bio}</p>

        {/* 最新洞见 */}
        <div className="rounded-xl p-3 mb-3" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
          <p className="text-xs font-semibold text-gray-400 mb-1.5">💬 核心观点</p>
          <blockquote className="text-sm text-gray-700 leading-relaxed italic">
            "{expert.latestInsight.quote}"
          </blockquote>
          <p className="text-xs text-gray-400 mt-1.5">{expert.latestInsight.source}</p>
        </div>

        {/* 与本站关联 */}
        <div className="rounded-xl p-3" style={{ background: '#FFF8F0', border: '1px solid #FFE4CC' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#FF5A00' }}>🔗 与本站议题的关联</p>
          <p className="text-xs leading-relaxed" style={{ color: '#9A3412' }}>{expert.relevance}</p>
        </div>

        {/* 著作 */}
        {expert.books && expert.books.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {expert.books.map((b, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{b}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
