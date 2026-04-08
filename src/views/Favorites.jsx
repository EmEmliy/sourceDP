import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { merchants } from '../data/mockData'

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'food', label: '美食' },
  { id: 'hotel', label: '酒店' },
  { id: 'movie', label: '电影' },
  { id: 'beauty', label: '丽人' },
]

export default function Favorites() {
  const [activeTab, setActiveTab] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    } else {
      setFavorites(merchants.slice(0, 6).map(m => m.id))
    }
  }, [])

  const favoriteMerchants = merchants.filter(m => favorites.includes(m.id))

  const filteredMerchants = activeTab === 'all' 
    ? favoriteMerchants 
    : favoriteMerchants.filter(m => {
        const categoryMap = {
          'food': ['火锅', '烧烤', '川菜', '粤菜', '日料', '西餐', '小吃'],
          'hotel': ['豪华酒店', '商务酒店', '精品酒店', '快捷酒店'],
          'movie': ['电影院'],
          'beauty': ['美容SPA', '美发', '美甲']
        }
        return categoryMap[activeTab]?.includes(m.category)
      })

  const handleRemove = (merchantId) => {
    const newFavorites = favorites.filter(id => id !== merchantId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/profile" className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">我的收藏</h1>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-4 py-1 text-orange-500 font-medium"
          >
            {isEditMode ? '完成' : '编辑'}
          </button>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide px-4 pb-2 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {filteredMerchants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <p className="text-gray-500">还没有收藏哦</p>
            <p className="text-gray-400 text-sm mt-1">去发现心仪的商家吧</p>
            <Link 
              to="/category/food" 
              className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-full"
            >
              发现商家
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMerchants.map(merchant => (
              <div key={merchant.id} className="bg-white rounded-xl p-3 flex gap-3 shadow-sm">
                <Link to={`/merchant/${merchant.id}`} className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img 
                    src={merchant.images?.[0] || '/images/hotpot/hotpot_1.jpg'} 
                    alt={merchant.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/merchant/${merchant.id}`}>
                    <h3 className="font-medium text-gray-800 truncate">{merchant.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-orange-500 text-sm">⭐ {merchant.rating}</span>
                    <span className="text-gray-400 text-sm">{merchant.reviews} 条评价</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 truncate">{merchant.category} · {merchant.location}</p>
                </div>
                {isEditMode && (
                  <button 
                    onClick={() => handleRemove(merchant.id)}
                    className="self-center p-2 text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
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
