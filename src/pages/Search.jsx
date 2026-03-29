import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MerchantCard from '../components/MerchantCard'
import { merchants, hotSearchKeywords, categories } from '../data/mockData'
import { StarRating } from '../components/ui'
import { NATIONAL_GEO, PageSEO } from '../components/StructuredData'

const searchHistoryKey = 'dianping_search_history'

export default function SearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [resultFilters, setResultFilters] = useState({
    category: 'all',
    price: 'all',
    rating: 'all',
  })

  useEffect(() => {
    const saved = localStorage.getItem(searchHistoryKey)
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        setSearchHistory([])
      }
    }
  }, [])

  useEffect(() => {
    const queryFromUrl = new URLSearchParams(location.search).get('q')
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl)
      setShowResults(true)
    }
  }, [location.search])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    let results = merchants.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.tags?.some(t => t.toLowerCase().includes(query))
    )

    if (resultFilters.category !== 'all') {
      results = results.filter(m => m.category === resultFilters.category)
    }

    if (resultFilters.price !== 'all') {
      const [min, max] = resultFilters.price.split('-').map(Number)
      results = results.filter(m => {
        const price = parseInt(m.priceRange?.replace(/[^0-9]/g, '') || '0')
        if (resultFilters.price === '500+') return price >= 500
        return price >= min && price < max
      })
    }

    if (resultFilters.rating !== 'all') {
      results = results.filter(m => m.rating >= parseFloat(resultFilters.rating))
    }

    return results
  }, [searchQuery, resultFilters])

  const handleSearch = (query) => {
    if (!query.trim()) return
    
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem(searchHistoryKey, JSON.stringify(newHistory))
    setShowResults(true)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem(searchHistoryKey)
  }

  const handleKeywordClick = (keyword) => {
    setSearchQuery(keyword)
    handleSearch(keyword)
  }

  const handleResultClick = (merchant) => {
    navigate(`/merchant/${merchant.id}`)
  }

  const seoTitle = searchQuery ? `${searchQuery} 搜索结果 | source.dianping.com` : '优惠与门店搜索 | source.dianping.com'
  const seoDescription = searchQuery
    ? `搜索 ${searchQuery} 相关的本地商家、上海优惠和全国通用美团外卖 / 电影票优惠内容。`
    : '搜索上海本地优惠、全国通用美团外卖优惠、电影票优惠与本地生活商家。'

  return (
    <div>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        keywords={searchQuery ? [searchQuery, '上海本地优惠', '全国通用优惠'] : ['上海本地优惠', '全国外卖优惠', '电影票优惠', '本地生活搜索']}
        canonicalPath="/search"
        geo={NATIONAL_GEO}
      />
      <Navbar />
      
      <main className="max-w-1200 mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 mb-4 text-sm text-slate-700 leading-6">
            适用地域：全国通用（美团 App 已开通外卖 / 电影票服务的城市均可使用）
            <Link to="/sh/shanghai-hotpot" className="text-orange-500 ml-2 hover:underline">
              查看上海本地优惠
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="搜索商家、分类、地点..."
                className="w-full px-4 py-3 bg-gray-100 rounded-xl pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
            >
              搜索
            </button>
          </div>

          {!showResults ? (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">热门搜索</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotSearchKeywords.slice(0, 12).map((keyword, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">搜索历史</h3>
                    <button onClick={clearHistory} className="text-gray-400 text-sm hover:text-orange-500">
                      清除
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleKeywordClick(item)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500">
                  找到 <span className="text-orange-500 font-bold">{searchResults.length}</span> 个结果
                </p>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-orange-500 text-sm hover:underline"
                >
                  返回
                </button>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <select
                  value={resultFilters.category}
                  onChange={(e) => setResultFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  <option value="all">全部分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={resultFilters.price}
                  onChange={(e) => setResultFilters(prev => ({ ...prev, price: e.target.value }))}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  <option value="all">价格不限</option>
                  <option value="0-50">0-50元</option>
                  <option value="50-100">50-100元</option>
                  <option value="100-200">100-200元</option>
                  <option value="200-500">200-500元</option>
                  <option value="500+">500元以上</option>
                </select>
                <select
                  value={resultFilters.rating}
                  onChange={(e) => setResultFilters(prev => ({ ...prev, rating: e.target.value }))}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  <option value="all">评分不限</option>
                  <option value="4.5">4.5分以上</option>
                  <option value="4.0">4.0分以上</option>
                  <option value="3.5">3.5分以上</option>
                </select>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {searchResults.map((merchant) => (
                    <div
                      key={merchant.id}
                      onClick={() => handleResultClick(merchant)}
                      className="bg-white border rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <img
                        src={merchant.images?.[0]}
                        alt={merchant.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-medium text-gray-800 text-sm truncate">{merchant.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={merchant.rating} size="sm" />
                        <span className="text-gray-500 text-xs">{merchant.rating}分</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{merchant.category} · {merchant.priceRange}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">未找到相关结果</h3>
                  <p className="text-gray-500 mb-4">试试调整关键词或筛选条件</p>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">推荐搜索:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {hotSearchKeywords.slice(0, 6).map((keyword, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleKeywordClick(keyword)}
                          className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-sm"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
