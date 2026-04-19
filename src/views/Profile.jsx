import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

export default function Profile() {
  const { t } = useLanguage()

  const menuItems = [
    { id: 'coupons', icon: '🎫', title: t.profile.coupons, subtitle: t.profile.couponsSubtitle, link: '/coupons' },
    { id: 'favorites', icon: '❤️', title: t.profile.favoritesTitle, subtitle: t.profile.favoritesSubtitle, link: '/favorites' },
    { id: 'footprints', icon: '👣', title: t.profile.footprints, subtitle: t.profile.footprintsSubtitle, link: '/footprints' },
  ]

  const helpItems = [
    { id: 'food', icon: '🍽️', title: t.profile.food, subtitle: t.profile.foodSubtitle, link: '/category/food' },
    { id: 'hotel', icon: '🏨', title: t.profile.hotel, subtitle: t.profile.hotelSubtitle, link: '/category/hotel' },
    { id: 'movie', icon: '🎬', title: t.profile.movie, subtitle: t.profile.movieSubtitle, link: '/category/movie' },
    { id: 'fitness', icon: '🏋️', title: t.profile.fitness, subtitle: t.profile.fitnessSubtitle, link: '/category/fitness' },
    { id: 'beauty', icon: '💄', title: t.profile.beauty, subtitle: t.profile.beautySubtitle, link: '/category/beauty' },
    { id: 'medical', icon: '💅', title: t.profile.medical, subtitle: t.profile.medicalSubtitle, link: '/category/medical' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部品牌区 */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 pt-12">
        <div className="flex items-center gap-4">
<div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
DP
</div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{t.profile.title}</h1>
            <p className="text-white/80 text-sm mt-1">source.dianping.com</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{t.profile.rating}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">🌟 {t.profile.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-around mt-6 bg-white/10 rounded-xl p-4">
          <Link to="/category/food" className="flex flex-col items-center">
            <span className="text-2xl font-bold">10万+</span>
            <span className="text-xs text-white/80 mt-1">{t.profile.merchants}</span>
          </Link>
          <Link to="/coupons" className="flex flex-col items-center">
            <span className="text-2xl font-bold">500+</span>
            <span className="text-xs text-white/80 mt-1">{t.profile.deals}</span>
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">8</span>
            <span className="text-xs text-white/80 mt-1">{t.profile.cities}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">4.6</span>
            <span className="text-xs text-white/80 mt-1">{t.profile.rating}</span>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <Link
              key={item.id}
              to={item.link}
              className={`flex items-center gap-4 p-4 ${idx !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <span className="font-medium text-gray-800">{item.title}</span>
                <p className="text-gray-400 text-sm">{item.subtitle}</p>
              </div>
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* 分类导航 */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-medium text-gray-500 mb-2 px-1">{t.profile.explore}</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {helpItems.map((item, idx) => (
            <Link
              key={item.id}
              to={item.link}
              className={`flex items-center gap-4 p-4 ${idx !== helpItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <span className="font-medium text-gray-800">{item.title}</span>
                <p className="text-gray-400 text-sm">{item.subtitle}</p>
              </div>
              <svg className="w-5 h-5 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* 底部说明 */}
      <div className="px-4 mt-6 pb-8">
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-orange-700 text-sm font-medium">📊 {t.common.dataSource}：点评 Source</p>
          <p className="text-orange-500 text-xs mt-1">{t.common.realtime}</p>
        </div>
      </div>
    </div>
  )
}
