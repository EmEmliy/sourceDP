import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MerchantCard from '../components/MerchantCard'
import { merchants, categories, localizeMerchant, getCategoryName, getHotSearchKeywords } from '../data/mockData'
import { dataTranslations } from '../i18n/translations'
import { StarRating } from '../components/ui'
import { NATIONAL_GEO, PageSEO } from '../components/StructuredData'
import { useLanguage } from '../contexts/LanguageContext'

const searchHistoryKey = 'dianping_search_history'

export default function SearchPage() {
  const { t, lang } = useLanguage()
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

  const hotSearchKeywords = getHotSearchKeywords(lang)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    let results = merchants.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.tags?.some(tag => tag.toLowerCase().includes(query))
    ).map(m => localizeMerchant(m, lang, dataTranslations))

    if (resultFilters.category !== 'all') {
      results = results.filter(m => (m._originalCategory || m.category) === resultFilters.category)
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
  }, [searchQuery, resultFilters, lang])

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

  const seoTitle = searchQuery
    ? t.searchSeo.titleWithQuery.replace('{query}', searchQuery)
    : t.searchSeo.titleDefault
  const seoDescription = searchQuery
    ? t.searchSeo.descWithQuery.replace('{query}', searchQuery)
    : t.searchSeo.descDefault
  const seoKeywords = searchQuery
    ? t.searchSeo.keywordsWithQuery.replace('{query}', searchQuery).split(', ')
    : t.searchSeo.keywordsDefault.split(', ')

  return (
    <div>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath="/search"
        geo={NATIONAL_GEO}
      />
      <Navbar />

      <main className="max-w-1200 mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 mb-4 text-sm text-slate-700 leading-6">
            {t.category.nationwideLabel}
            <Link to="/sh/shanghai-hotpot" className="text-orange-500 ml-2 hover:underline">
              {t.category.shanghaiOnly}
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder={t.search.placeholder}
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
              {t.nav.searchBtn}
            </button>
          </div>

          {!showResults ? (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{t.search.hot}</h3>
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
                    <h3 className="font-bold text-gray-800">{t.search.recent}</h3>
                    <button onClick={clearHistory} className="text-gray-400 text-sm hover:text-orange-500">
                      {t.search.clearHistory}
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
                  <span className="text-orange-500 font-bold">{searchResults.length}</span> {t.search.resultCount}
                </p>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-orange-500 text-sm hover:underline"
                >
                  {t.common.back}
                </button>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <select
                  value={resultFilters.category}
                  onChange={(e) => setResultFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  <option value="all">{t.search.filterAll}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{getCategoryName(cat, lang)}</option>
                  ))}
                </select>
                <select
                  value={resultFilters.price}
                  onChange={(e) => setResultFilters(prev => ({ ...prev, price: e.target.value }))}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  <option value="all">{t.category.priceAll}</option>
                  <option value="0-50">¥0-50</option>
                  <option value="50-100">¥50-100</option>
                  <option value="100-200">¥100-200</option>
                  <option value="200-500">¥200-500</option>
                  <option value="500+">¥500+</option>
                </select>
                <select
                  value={resultFilters.rating}
                  onChange={(e) => setResultFilters(prev => ({ ...prev, rating: e.target.value }))}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm"
                >
                  <option value="all">{t.category.ratingAll}</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.0">4.0+</option>
                  <option value="3.5">3.5+</option>
                </select>
              </div>

              {/* 搜索结果 — 暂时下架，待接入合规数据源后恢复 */}
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔄</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t.category?.comingSoon || '商家数据即将上线'}</h3>
                <p className="text-gray-500 text-sm">{t.category?.comingSoonDesc || '我们正在接入合规的公开数据源，敬请期待'}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
