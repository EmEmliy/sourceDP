import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MerchantCard from '../components/MerchantCard'
import { categoryData, categories, merchants, hotRanking, localizeMerchant, getCategoryName, getSubCategoryName, getHotFilters } from '../data/mockData'
import { dataTranslations } from '../i18n/translations'
import { PriceRangeChart, PopularityTrend } from '../components/ui/Charts'
import { StarRating } from '../components/ui'
import { NATIONAL_GEO, PageSEO, SHANGHAI_GEO, SITE_URL, useCollectionPageStructuredData, useFAQSchema, useItemListSchema } from '../components/StructuredData'
import { useLanguage } from '../contexts/LanguageContext'

const filterHistoryKey = 'dianping_filter_history'

export default function Category({ forcedCategoryId = null, geoFilterKey = 'all', pageVariant = 'default' }) {
  const { t, lang } = useLanguage()

  const sortOptions = [
    { id: 'default', name: t.category.sortByDefault, icon: '⚡' },
    { id: 'distance', name: t.category.sortByDistance, icon: '📍' },
    { id: 'rating', name: t.category.sortByRating, icon: '⭐' },
    { id: 'reviews', name: t.category.sortByPopular, icon: '🔥' },
    { id: 'price_low', name: t.category.sortByPrice, icon: '💰' },
    { id: 'price_high', name: t.category.sortByPriceHigh, icon: '💎' },
  ]

  const filterOptions = {
    price: [
      { id: 'all', name: t.category.priceAll },
      { id: '0-50', name: '¥0-50' },
      { id: '50-100', name: '¥50-100' },
      { id: '100-200', name: '¥100-200' },
      { id: '200-500', name: '¥200-500' },
      { id: '500+', name: '¥500+' },
    ],
    rating: [
      { id: 'all', name: t.category.ratingAll },
      { id: '4.5', name: '4.5+' },
      { id: '4.0', name: '4.0+' },
      { id: '3.5', name: '3.5+' },
    ],
    distance: [
      { id: 'all', name: t.category.distanceAll },
      { id: '500', name: '500m' },
      { id: '1000', name: '1km' },
      { id: '2000', name: '2km' },
      { id: '5000', name: '5km' },
    ],
    feature: [
      { id: 'discount', name: t.category.hasDiscount },
      { id: 'parking', name: t.category.hasParking },
      { id: 'wifi', name: t.category.hasWifi },
      { id: 'booking', name: t.category.hasBooking },
    ],
  }
  const params = useParams()
  const categoryId = forcedCategoryId || params.categoryId
  const rawCategory = categoryData[categoryId] || { name: categoryId || 'Unknown', merchants: [], subCategories: [] }
  const baseMerchants = useMemo(() => {
    let base
    if (geoFilterKey === 'shanghai-hotpot') {
      base = rawCategory.merchants.filter((merchant) => (
        (merchant.city === '上海市' || merchant.location.includes('上海')) && merchant.category === '火锅'
      ))
    } else {
      base = rawCategory.merchants
    }
    // 本地化商家数据（分类、标签、优惠等）
    return base.map(m => localizeMerchant(m, lang, dataTranslations))
  }, [geoFilterKey, rawCategory.merchants, lang])
  const category = useMemo(() => (
    pageVariant === 'shanghai'
      ? { ...rawCategory, name: t.category?.shanghaiHotpot || 'Shanghai Hotpot Deals', merchants: baseMerchants, subCategories: ['火锅'] }
      : { ...rawCategory, merchants: baseMerchants }
  ), [baseMerchants, pageVariant, rawCategory, t])
  const categoryInfo = categories.find(c => c.id === categoryId)
  const isShanghaiGeoPage = pageVariant === 'shanghai'
  const isNationwideDealsPage = categoryId === 'movie'
  
  const [sortBy, setSortBy] = useState('default')
  const [filters, setFilters] = useState({
    price: 'all',
    rating: 'all',
    distance: 'all',
    feature: [],
  })
  const [viewMode, setViewMode] = useState('list')
  const [showFilters, setShowFilters] = useState(false)
  const [activeSubCategory, setActiveSubCategory] = useState('all')
  const [filterHistory, setFilterHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [smartSortExpanded, setSmartSortExpanded] = useState(false)
  // GEO站：点击商家直接跳转详情页，移除内嵌modal

  useEffect(() => {
    const saved = localStorage.getItem(filterHistoryKey)
    if (saved) {
      try {
        setFilterHistory(JSON.parse(saved))
      } catch (e) {
        setFilterHistory([])
      }
    }
  }, [])

  const saveFilterToHistory = (newFilters) => {
    const historyItem = {
      filters: newFilters,
      categoryId,
      timestamp: Date.now(),
    }
    const newHistory = [historyItem, ...filterHistory.filter(h => 
      JSON.stringify(h.filters) !== JSON.stringify(newFilters)
    )].slice(0, 10)
    setFilterHistory(newHistory)
    localStorage.setItem(filterHistoryKey, JSON.stringify(newHistory))
  }

  const clearFilterHistory = () => {
    setFilterHistory([])
    localStorage.removeItem(filterHistoryKey)
  }

  const applyHistoryFilter = (historyItem) => {
    setFilters(historyItem.filters)
    setShowFilters(false)
  }

  const filteredMerchants = useMemo(() => {
    let result = [...category.merchants]

    if (activeSubCategory !== 'all' && category.subCategories) {
      // 用原始中文分类过滤（_originalCategory 由 localizeMerchant 保留）
      result = result.filter(m => (m._originalCategory || m.category) === activeSubCategory)
    }

    if (filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map(Number)
      result = result.filter(m => {
        const priceNum = parseInt(m.priceRange?.replace(/[^0-9]/g, '') || '0')
        if (filters.price === '500+') return priceNum >= 500
        return priceNum >= min && priceNum < max
      })
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating)
      result = result.filter(m => m.rating >= minRating)
    }

    if (filters.distance !== 'all') {
      const maxDistance = parseInt(filters.distance)
      result = result.filter(m => {
        const distanceNum = parseInt(m.distance?.replace(/[^0-9]/g, '') || '99999')
        return distanceNum <= maxDistance
      })
    }

    if (filters.feature.includes('discount')) {
      result = result.filter(m => m.discount)
    }
    if (filters.feature.includes('parking')) {
      result = result.filter(m => m.facilities?.includes('停车位'))
    }
    if (filters.feature.includes('wifi')) {
      result = result.filter(m => m.facilities?.includes('wifi'))
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case 'price_low':
        result.sort((a, b) => {
          const priceA = parseInt(a.priceRange?.replace(/[^0-9]/g, '') || '9999')
          const priceB = parseInt(b.priceRange?.replace(/[^0-9]/g, '') || '9999')
          return priceA - priceB
        })
        break
      case 'price_high':
        result.sort((a, b) => {
          const priceA = parseInt(a.priceRange?.replace(/[^0-9]/g, '') || '0')
          const priceB = parseInt(b.priceRange?.replace(/[^0-9]/g, '') || '0')
          return priceB - priceA
        })
        break
      case 'distance':
        result.sort((a, b) => {
          const distA = parseInt(a.distance?.replace(/[^0-9]/g, '') || '99999')
          const distB = parseInt(b.distance?.replace(/[^0-9]/g, '') || '99999')
          return distA - distB
        })
        break
      case 'default':
        result.sort((a, b) => {
          const scoreA = a.rating * 0.4 + (a.reviews / 1000) * 0.3 + (5 - parseInt(a.distance?.replace(/[^0-9]/g, '') || '0') / 1000) * 0.3
          const scoreB = b.rating * 0.4 + (b.reviews / 1000) * 0.3 + (5 - parseInt(b.distance?.replace(/[^0-9]/g, '') || '0') / 1000) * 0.3
          return scoreB - scoreA
        })
        break
      default:
        break
    }

    return result
  }, [category.merchants, sortBy, filters, activeSubCategory])

  const toggleFeature = (featureId) => {
    setFilters(prev => ({
      ...prev,
      feature: prev.feature.includes(featureId)
        ? prev.feature.filter(f => f !== featureId)
        : [...prev.feature, featureId]
    }))
  }

  const applyFilters = () => {
    saveFilterToHistory(filters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      price: 'all',
      rating: 'all',
      distance: 'all',
      feature: [],
    })
    setSortBy('default')
    setActiveSubCategory('all')
  }

  const hasActiveFilters = filters.price !== 'all' || filters.rating !== 'all' || filters.distance !== 'all' || filters.feature.length > 0 || activeSubCategory !== 'all'

  const currentCategoryHotFilters = getHotFilters(categoryId, lang)
  const categoryDescription = isShanghaiGeoPage
    ? (t.category?.catSeoDescShanghaiHotpot || 'Shanghai local hotpot deals in Wuzhong district')
    : isNationwideDealsPage
      ? (t.category?.catSeoDescNationwideMovie || 'Nationwide Meituan movie ticket deals')
      : `${category.name}`
  const categoryKeywords = isShanghaiGeoPage
    ? (t.category?.catSeaTitleShanghaiHotpot || 'Shanghai Hotpot Deals').split(',')
    : isNationwideDealsPage
      ? [t.category?.catSeoDescNationwideMovie || 'Movie deals']
      : [`${category.name}`]
  const geoNotice = isShanghaiGeoPage
    ? (t.category?.geoNoticeShanghaiFood || '')
    : isNationwideDealsPage
      ? (t.category?.geoNoticeNationwideMovie || '')
      : categoryId === 'food'
        ? (t.category?.geoNoticeFood || '')
        : (t.category?.geoNoticeDefault || '')
  const categoryCollectionSchema = useCollectionPageStructuredData(
    isShanghaiGeoPage ? (t.category?.shanghaiHotpot || 'Shanghai Hotpot Deals') : `${category.name}`,
    categoryDescription,
    filteredMerchants.length > 0 ? filteredMerchants : category.merchants,
    `${SITE_URL}${isShanghaiGeoPage ? '/sh/shanghai-hotpot' : `/category/${categoryId}`}`,
  )

  const categoryFAQItems = useMemo(() => {
    if (isShanghaiGeoPage) {
      return [
        {
          question: t.category?.catFaqShanghaiQ1 || '',
          answer: t.category?.catFaqShanghaiA1 || '',
        },
        {
          question: t.category?.catFaqShanghaiQ2 || '',
          answer: t.category?.catFaqShanghaiA2 || '',
        },
        {
          question: t.category?.catFaqShanghaiQ3 || '',
          answer: t.category?.catFaqShanghaiA3 || '',
        },
      ]
    }
    if (categoryId === 'hotel') {
      return [
        {
          question: t.category?.catFaqHotelQ1 || '',
          answer: t.category?.catFaqHotelA1 || '',
        },
        {
          question: t.category?.catFaqHotelQ2 || '',
          answer: t.category?.catFaqHotelA2 || '',
        },
      ]
    }
    if (categoryId === 'food') {
      return [
        {
          question: t.category?.catFaqFoodQ1 || '',
          answer: t.category?.catFaqFoodA1 || '',
        },
        {
          question: t.category?.catFaqFoodQ2 || '',
          answer: t.category?.catFaqFoodA2 || '',
        },
      ]
    }
    return []
  }, [isShanghaiGeoPage, categoryId, t])

  const categoryFAQSchema = useFAQSchema(categoryFAQItems)

  // ItemList Schema：让 AI 爬虫能识别分类页的商家排行列表
  const top10Merchants = useMemo(() => {
    return (filteredMerchants.length > 0 ? filteredMerchants : category.merchants)
      .sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews))
      .slice(0, 10)
  }, [filteredMerchants, category.merchants])

  const categoryItemListTitle = isShanghaiGeoPage
    ? (t.category?.shanghaiHotpot || 'Shanghai Hotpot Rankings TOP10')
    : `${category.name} TOP10`
  const categoryItemListUrl = `${SITE_URL}${isShanghaiGeoPage ? '/sh/shanghai-hotpot' : `/category/${categoryId}`}`
  const categoryItemListSchema = useItemListSchema(categoryItemListTitle, top10Merchants, categoryItemListUrl)

  const RankingSection = () => {
    const rankingData = hotRanking[categoryId] || hotRanking.food
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏆</span>
          <h3 className="font-bold text-gray-800">{t.category.rankingTitle}</h3>
        </div>
        <div className="space-y-2">
          {rankingData.slice(0, 5).map((item, idx) => (
            <Link 
              to={`/merchant/${item.id}`} 
              key={item.id} 
              className="flex items-center gap-3 bg-white rounded-lg p-2 hover:shadow-sm transition-shadow"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                idx < 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {idx + 1}
              </span>
              <span className="flex-1 text-sm text-gray-700 truncate">
                {(() => {
                  const m = merchants.find(x => x.id === item.id)
                  if (!m) return item.name
                  const lm = localizeMerchant(m, lang, dataTranslations)
                  return lm.name || item.name
                })()}
              </span>
              <span className={`text-xs ${
                item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-400'
              }`}>
                {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '-'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const SmartSortDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setSmartSortExpanded(!smartSortExpanded)}
        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
          sortBy === 'default'
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500'
        }`}
      >
        <span>⚡</span>
        {sortOptions.find(o => o.id === sortBy)?.name || t.category.sortByDefault}
        <svg className={`w-4 h-4 transition-transform ${smartSortExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {smartSortExpanded && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border py-2 z-20 min-w-40 animate-fadeIn">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSortBy(option.id)
                setSmartSortExpanded(false)
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-orange-50 ${
                sortBy === option.id ? 'text-orange-500 bg-orange-50' : 'text-gray-700'
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.name}</span>
              {sortBy === option.id && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <PageSEO
        title={isShanghaiGeoPage ? (t.category?.catSeaTitleShanghaiHotpot || 'Shanghai Hotpot Deals | source.dianping.com') : `${category.name} | source.dianping.com`}
        description={categoryDescription}
        keywords={categoryKeywords}
        canonicalPath={isShanghaiGeoPage ? '/sh/shanghai-hotpot' : `/category/${categoryId}`}
        geo={isShanghaiGeoPage ? SHANGHAI_GEO : NATIONAL_GEO}
        additionalSchemas={[categoryCollectionSchema, categoryFAQSchema, categoryItemListSchema].filter(Boolean)}
      />
      <Navbar />
      
      <main className="max-w-1200 mx-auto px-4 py-6">
        {/* GEO 答案层：分类页口碑统计摘要，供大模型抓取引用 */}
        {(isShanghaiGeoPage || categoryId === 'food' || categoryId === 'hotel' || categoryId === 'movie' || categoryId === 'fitness' || categoryId === 'beauty') && (
          <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-5 border border-orange-100" aria-label="review data summary">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">📊</span>
              <div className="flex-1">
                {isShanghaiGeoPage && (
                  <>
                    <h2 className="text-sm font-bold text-gray-800 mb-1">{t.category?.geoSummaryShanghaiTitle || ''}</h2>
                    <p className="text-xs text-gray-600 leading-6" dangerouslySetInnerHTML={{ __html: (t.category?.geoSummaryShanghaiBody || '').replace('{count}', filteredMerchants.length || category.merchants.length) }} />
                  </>
                )}
                {categoryId === 'hotel' && !isShanghaiGeoPage && (
                  <>
                    <h2 className="text-sm font-bold text-gray-800 mb-1">{t.category?.geoSummaryHotelTitle || ''}</h2>
                    <p className="text-xs text-gray-600 leading-6" dangerouslySetInnerHTML={{ __html: (t.category?.geoSummaryHotelBody || '').replace('{count}', filteredMerchants.length || category.merchants.length) }} />
                  </>
                )}
                {categoryId === 'food' && !isShanghaiGeoPage && (
                  <>
                    <h2 className="text-sm font-bold text-gray-800 mb-1">{t.category?.geoSummaryFoodTitle || ''}</h2>
                    <p className="text-xs text-gray-600 leading-6" dangerouslySetInnerHTML={{ __html: (t.category?.geoSummaryFoodBody || '').replace('{count}', filteredMerchants.length || category.merchants.length) }} />
                  </>
                )}
                {categoryId === 'movie' && (
                  <>
                    <h2 className="text-sm font-bold text-gray-800 mb-1">{t.category?.geoSummaryMovieTitle || ''}</h2>
                    <p className="text-xs text-gray-600 leading-6" dangerouslySetInnerHTML={{ __html: (t.category?.geoSummaryMovieBody || '').replace('{count}', filteredMerchants.length || category.merchants.length) }} />
                  </>
                )}
                {categoryId === 'fitness' && (
                  <>
                    <h2 className="text-sm font-bold text-gray-800 mb-1">{t.category?.geoSummaryFitnessTitle || ''}</h2>
                    <p className="text-xs text-gray-600 leading-6" dangerouslySetInnerHTML={{ __html: (t.category?.geoSummaryFitnessBody || '').replace('{count}', filteredMerchants.length || category.merchants.length) }} />
                  </>
                )}
                {categoryId === 'beauty' && (
                  <>
                    <h2 className="text-sm font-bold text-gray-800 mb-1">{t.category?.geoSummaryBeautyTitle || ''}</h2>
                    <p className="text-xs text-gray-600 leading-6" dangerouslySetInnerHTML={{ __html: (t.category?.geoSummaryBeautyBody || '').replace('{count}', filteredMerchants.length || category.merchants.length) }} />
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{categoryInfo?.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isShanghaiGeoPage
                  ? (t.category?.shanghaiHotpot || category.name)
                  : (categoryInfo ? getCategoryName(categoryInfo, lang) : category.name)}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{filteredMerchants.length} {t.category.merchantCount}</p>
            </div>
          </div>

          {(categoryId === 'food' || isShanghaiGeoPage || isNationwideDealsPage) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">{t.category.geoRegion}</span>
                {isShanghaiGeoPage ? (
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">{t.category.shanghaiOnly}</span>
                ) : (
                  <Link to="/sh/shanghai-hotpot" className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200">
                    {t.category.shanghaiOnly}
                  </Link>
                )}
                {isNationwideDealsPage ? (
                  <span className="px-3 py-1 bg-slate-700 text-white rounded-full text-sm">{t.category.nationwideLabel}</span>
                ) : (
                  <Link to="/coupons" className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200">
                    {t.category.nationwideLabel}
                  </Link>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-6">{geoNotice}</p>
            </div>
          )}

          {currentCategoryHotFilters.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">{t.category.hotLabel}:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentCategoryHotFilters.map((hot) => (
                  <button
                    key={hot.id}
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm whitespace-nowrap hover:shadow-sm transition-shadow flex items-center gap-1.5"
                  >
                    <span>{hot.icon}</span>
                    {hot.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {category.subCategories && category.subCategories.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">{t.category.categoryLabel}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveSubCategory('all')}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeSubCategory === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t.category.allFilter}
                </button>
                {category.subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                      activeSubCategory === sub
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getSubCategoryName(sub, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SmartSortDropdown />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full text-sm flex items-center gap-1.5 transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {t.category.filterBtn}
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>

            {filterHistory.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-2 rounded-full text-sm flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:border-orange-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.category.filterHistory}
                </button>
                
                {showHistory && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border py-2 z-20 min-w-48 animate-fadeIn">
                    <div className="px-3 py-2 border-b flex justify-between items-center">
                      <span className="text-sm text-gray-500">{t.category.filterHistory}</span>
                      <button 
                        onClick={clearFilterHistory}
                        className="text-xs text-orange-500 hover:underline"
                      >
                        {t.category.clearHistory}
                      </button>
                    </div>
                    {filterHistory.slice(0, 5).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyHistoryFilter(item)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center justify-between"
                      >
                        <span>
                          {item.filters.price !== 'all' && `${item.filters.price} `}
                          {item.filters.rating !== 'all' && `${item.filters.rating}+ `}
                          {item.filters.feature.length > 0 && `${item.filters.feature.join(',')}`}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white border border-gray-200 rounded-full overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t.category.priceRange}</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.price.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFilters(prev => ({ ...prev, price: option.id }))}
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        filters.price === option.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t.category.ratingFilter}</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.rating.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFilters(prev => ({ ...prev, rating: option.id }))}
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        filters.rating === option.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t.category.distanceFilter}</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.distance.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFilters(prev => ({ ...prev, distance: option.id }))}
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        filters.distance === option.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{t.category.featureFilter}</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.feature.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleFeature(option.id)}
                    className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 ${
                      filters.feature.includes(option.id)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filters.feature.includes(option.id) && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-orange-500"
              >
                {t.category.filterClear}
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600"
              >
                {t.category.filterApply}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {filteredMerchants.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {filteredMerchants.map((merchant) => (
                    <MerchantCard
                      key={merchant.id}
                      merchant={merchant}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{t.category.noResult}</h3>
                <p className="text-gray-500 mb-4">{t.category.filterClear}</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  {t.category.filterClear}
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <RankingSection />
            
            <div className="mt-4">
              <PriceRangeChart merchants={filteredMerchants.length > 0 ? filteredMerchants : category.merchants} />
            </div>

            <div className="mt-4">
              <PopularityTrend />
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
              <h3 className="font-bold text-gray-800 mb-3">{t.category.filterTipTitle}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">💡</span>
                  <p className="text-gray-600">{t.category.filterTip1}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">💡</span>
                  <p className="text-gray-600">{t.category.filterTip2}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">💡</span>
                  <p className="text-gray-600">{t.category.filterTip3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
