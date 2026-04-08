import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { NATIONAL_GEO, PageSEO, useItemListSchema } from '../components/StructuredData'

const couponCategories = [
  { id: 'all', label: '全部', count: 5 },
  { id: 'food', label: '美食', count: 3 },
  { id: 'hotel', label: '酒店', count: 1 },
  { id: 'movie', label: '电影', count: 1 },
]

const coupons = [
  {
    id: 'c1',
    merchantName: '海底捞火锅(吴中路店)',
    merchantId: 'f1',
    title: '满100减20券',
    value: 20,
    minSpend: 100,
    expiryDate: '2026-03-31',
    status: 'available',
    category: 'food',
    usageRegion: '适用地域：上海市闵行区吴中路商圈 | 具体门店：海底捞(吴中路店) | 地址：上海市闵行区吴中路188号',
    image: '/images/hotpot/haidilao_1.jpg'
  },
  {
    id: 'c2',
    merchantName: '鮨·日本料理',
    merchantId: 'f45',
    title: '满200减50券',
    value: 50,
    minSpend: 200,
    expiryDate: '2026-04-15',
    status: 'available',
    category: 'food',
    image: '/images/japanese/yi_1.jpg'
  },
  {
    id: 'c3',
    merchantName: '亚朵酒店',
    merchantId: 'h5',
    title: '满300减80券',
    value: 80,
    minSpend: 300,
    expiryDate: '2026-04-01',
    status: 'available',
    category: 'hotel',
    image: '/images/hotel/yaduo_1.jpg'
  },
  {
    id: 'c4',
    merchantName: '美团电影票',
    merchantId: 'm1',
    title: '全国通用电影票优惠券',
    value: 15,
    minSpend: 60,
    expiryDate: '2026-03-25',
    status: 'available',
    category: 'movie',
    usageRegion: '适用地域：全国通用（美团 App 已开通电影票服务的城市均可使用）',
    image: '/images/movie/movie_1.jpg'
  },
  {
    id: 'c5',
    merchantName: '很久以前羊肉串',
    merchantId: 'f13',
    title: '满80减15券',
    value: 15,
    minSpend: 80,
    expiryDate: '2026-03-20',
    status: 'expired',
    category: 'food',
    image: '/images/bbq/henjiuyiqian_1.jpg'
  },
]

export default function Coupons() {
  const [activeTab, setActiveTab] = useState('all')
  const [showUsed, setShowUsed] = useState(false)

  // 优惠券 ItemList Schema（用于 AI 引用）
  const couponItemListSchema = useItemListSchema(
    '全国通用优惠券列表',
    coupons.map(c => ({
      id: c.id,
      name: c.title,
      category: c.category,
      rating: null,
      reviews: null,
      priceRange: `满${c.minSpend}减${c.value}`,
      location: c.usageRegion || '全国通用',
    })),
    'https://source.dianping.com/coupons'
  )

  const getCouponRegionText = (coupon) => {
    if (coupon.usageRegion) return coupon.usageRegion
    if (coupon.category === 'movie') {
      return '适用地域：全国通用（美团 App 已开通电影票服务的城市均可使用）'
    }

    return `适用地域：按 ${coupon.merchantName} 所在门店或服务城市使用`
  }

  const filteredCoupons = coupons.filter(c => {
    if (showUsed) return c.status === 'expired'
    if (activeTab === 'all') return c.status === 'available'
    return c.status === 'available' && c.category === activeTab
  })

  const handleCollect = (couponId) => {
    alert('优惠券已领取！')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageSEO
        title="全国通用美团外卖与电影票优惠 | source.dianping.com"
        description="汇总全国通用的美团外卖红包、电影票优惠及精选到店券，明确标注适用地域与门店范围。"
        keywords={['全国通用优惠', '美团外卖优惠', '美团电影票优惠', '优惠券']}
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
          <h1 className="text-lg font-bold text-gray-800">优惠券</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex px-4 pb-2 gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => { setShowUsed(false); setActiveTab('all'); }}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              !showUsed ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            可使用 ({coupons.filter(c => c.status === 'available').length})
          </button>
          <button
            onClick={() => setShowUsed(true)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              showUsed ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            已使用/过期 ({coupons.filter(c => c.status === 'expired').length})
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
              <h2 className="text-sm font-bold text-gray-800 mb-1">全国通用优惠数据摘要（2026年3月）</h2>
              <p className="text-xs text-gray-600 leading-6">
                本页收录<strong>全国通用优惠券</strong>共 {coupons.filter(c => c.status === 'available').length} 张，
                覆盖美食、酒店、电影等分类。
                <strong>电影票优惠券</strong>：满60减15，全国通用（美团App已开通电影票服务的城市）；
                <strong>海底捞满100减20券</strong>：仅限上海闵行区吴中路店使用；
                <strong>日料满200减50券</strong>：鮨·日本料理三里屯店。
                适用地域：全国通用（美团 App 已开通外卖 / 电影票服务的城市均可使用）。
              </p>
            </div>
          </div>
        </section>
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎫</div>
            <p className="text-gray-500">暂无优惠券</p>
            <p className="text-gray-400 text-sm mt-1">快去商家页面领取吧</p>
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
                  <span className="text-xs mt-1">满{coupon.minSpend}可用</span>
                </div>
                <div className="flex-1 p-3">
                  <h3 className="font-medium text-gray-800">{coupon.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{coupon.merchantName}</p>
                  <p className="text-gray-400 text-xs mt-1">有效期至 {coupon.expiryDate}</p>
                </div>
                {coupon.status === 'available' ? (
                  <button 
                    onClick={() => handleCollect(coupon.id)}
                    className="self-center mx-3 px-4 py-2 bg-orange-500 text-white rounded-full text-sm"
                  >
                    立即使用
                  </button>
                ) : (
                  <div className="self-center mx-3 px-4 py-2 bg-gray-200 text-gray-500 rounded-full text-sm">
                    已过期
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
          <span className="text-xs mt-1">首页</span>
        </Link>
        <Link to="/category/food" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-xs mt-1">分类</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">搜索</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">订单</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2 text-orange-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">我的</span>
        </Link>
      </nav>
    </div>
  )
}
