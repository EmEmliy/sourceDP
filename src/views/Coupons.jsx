import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { NATIONAL_GEO, PageSEO, useItemListSchema } from '../components/StructuredData'
import { useLanguage } from '../contexts/LanguageContext'

// 优惠券基础配置（文本通过翻译获取）
const couponConfigs = [
  {
    id: 'c1',
    merchantName: 'Haidilao Hot Pot (Wuzhong Road)',
    merchantNameKey: 'haidilao',
    merchantId: 'f1',
    titleKey: 'c1Title',
    regionKey: 'c1Region',
    value: 20,
    minSpend: 100,
    expiryDate: '2026-03-31',
    status: 'available',
    category: 'food',
    image: '/images/hotpot/haidilao_1.jpg'
  },
  {
    id: 'c2',
    merchantName: 'Yi Japanese Cuisine',
    merchantNameKey: 'yi',
    merchantId: 'f45',
    titleKey: 'c2Title',
    regionKey: null,
    value: 50,
    minSpend: 200,
    expiryDate: '2026-04-15',
    status: 'available',
    category: 'food',
    image: '/images/japanese/yi_1.jpg'
  },
  {
    id: 'c3',
    merchantName: 'Atour Hotel',
    merchantNameKey: 'atour',
    merchantId: 'h5',
    titleKey: 'c3Title',
    regionKey: null,
    value: 80,
    minSpend: 300,
    expiryDate: '2026-04-01',
    status: 'available',
    category: 'hotel',
    image: '/images/hotel/yaduo_1.jpg'
  },
  {
    id: 'c4',
    merchantName: 'Meituan Movie Tickets',
    merchantNameKey: 'meituanMovie',
    merchantId: 'm1',
    titleKey: 'c4Title',
    regionKey: 'c4Region',
    value: 15,
    minSpend: 60,
    expiryDate: '2026-03-25',
    status: 'available',
    category: 'movie',
    image: '/images/movie/movie_1.jpg'
  },
  {
    id: 'c5',
    merchantName: 'Henjiuyiqian Lamb Skewers',
    merchantNameKey: 'henjiuyiqian',
    merchantId: 'f13',
    titleKey: 'c5Title',
    regionKey: null,
    value: 15,
    minSpend: 80,
    expiryDate: '2026-03-20',
    status: 'expired',
    category: 'food',
    image: '/images/bbq/henjiuyiqian_1.jpg'
  },
]

export default function Coupons() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('all')
  const [showUsed, setShowUsed] = useState(false)

  // 根据当前语言构建优惠券列表
  const coupons = couponConfigs.map(c => ({
    ...c,
    title: t.couponsData[c.titleKey],
    usageRegion: c.regionKey ? t.couponsData[c.regionKey] : null,
  }))

  const couponCategories = [
    { id: 'all', label: t.coupons.all, count: 5 },
    { id: 'food', label: t.coupons.food, count: 3 },
    { id: 'hotel', label: t.coupons.hotel, count: 1 },
    { id: 'movie', label: t.coupons.movie, count: 1 },
  ]

  // 优惠券 ItemList Schema（用于 AI 引用）
  const couponItemListSchema = useItemListSchema(
    t.couponsData.itemListTitle,
    coupons.map(c => ({
      id: c.id,
      name: c.title,
      category: c.category,
      rating: null,
      reviews: null,
      priceRange: t.couponsData.priceRange.replace('{min}', c.minSpend).replace('{value}', c.value),
      location: c.usageRegion || t.couponsData.regionDefault,
    })),
    'https://source.dianping.com/coupons'
  )

  const getCouponRegionText = (coupon) => {
    if (coupon.usageRegion) return coupon.usageRegion
    if (coupon.category === 'movie') {
      return t.couponsData.c4Region
    }
    return t.couponsData.regionByMerchant.replace('{merchant}', coupon.merchantName)
  }

  const filteredCoupons = coupons.filter(c => {
    if (showUsed) return c.status === 'expired'
    if (activeTab === 'all') return c.status === 'available'
    return c.status === 'available' && c.category === activeTab
  })

  const handleCollect = () => {
    alert(t.couponsData.collected)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageSEO
        title={t.couponsData.seoTitle}
        description={t.couponsData.seoDesc}
        keywords={t.couponsData.seoKeywords.split(', ')}
        canonicalPath="/coupons"
        geo={NATIONAL_GEO}
        additionalSchemas={[couponItemListSchema]}
      />
      <div className="bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/profile" className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">{t.coupons.title}</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex px-4 pb-2 gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => { setShowUsed(false); setActiveTab('all'); }}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              !showUsed ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t.coupons.available} ({coupons.filter(c => c.status === 'available').length})
          </button>
          <button
            onClick={() => setShowUsed(true)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              showUsed ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t.coupons.used}/{t.coupons.expired} ({coupons.filter(c => c.status === 'expired').length})
          </button>
        </div>
      </div>

      {!showUsed && (
        <div className="flex px-4 py-2 gap-2 overflow-x-auto scrollbar-hide">
          {couponCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === cat.id
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-white text-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* GEO 答案层：优惠券摘要，供 AI 引用 */}
        <section className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-4 mb-5 border border-orange-100" aria-label="优惠数据摘要">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🎫</span>
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-1">{t.coupons.geoTitle}</h2>
              <p className="text-xs text-gray-600 leading-6">
                {t.coupons.geoDesc.replace('{count}', coupons.filter(c => c.status === 'available').length)}
              </p>
            </div>
          </div>
        </section>
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎫</div>
            <p className="text-gray-500">{t.coupons.emptyTitle}</p>
            <p className="text-gray-400 text-sm mt-1">{t.coupons.emptyHint}</p>
          </div>
        ) : (
          filteredCoupons.map(coupon => (
            <div
              key={coupon.id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm ${
                coupon.status === 'expired' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex">
                <div className="w-24 bg-gradient-to-br from-orange-500 to-red-500 text-white flex flex-col items-center justify-center p-3">
                  <span className="text-3xl font-bold">¥{coupon.value}</span>
                  <span className="text-xs mt-1">{t.coupons.minSpend}{coupon.minSpend}{t.coupons.discount}</span>
                </div>
                <div className="flex-1 p-3">
                  <h3 className="font-medium text-gray-800">{coupon.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{coupon.merchantName}</p>
                  <p className="text-gray-400 text-xs mt-1">{t.coupons.expiry} {coupon.expiryDate}</p>
                </div>
                {coupon.status === 'available' ? (
                  <button
                    onClick={() => handleCollect()}
                    className="self-center mx-3 px-4 py-2 bg-orange-500 text-white rounded-full text-sm"
                  >
                    {t.coupons.use}
                  </button>
                ) : (
                  <div className="self-center mx-3 px-4 py-2 bg-gray-200 text-gray-500 rounded-full text-sm">
                    {t.coupons.expired}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-3 py-1.5 text-xs text-gray-500 leading-5">
                {getCouponRegionText(coupon)}
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex justify-around items-center safe-area-bottom">
        <Link to="/" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">{t.mobileNav.home}</span>
        </Link>
        <Link to="/category/food" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-xs mt-1">{t.mobileNav.category}</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">{t.search.title}</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">{t.mobileNav.orders}</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2 text-orange-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">{t.mobileNav.profile}</span>
        </Link>
      </nav>
    </div>
  )
}
