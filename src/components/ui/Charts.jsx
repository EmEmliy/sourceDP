import { useState, useMemo } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function RatingChart({ rating = 4.5, totalReviews = 8562 }) {
  const { t } = useLanguage()
  const distribution = [
    { starsKey: 'fiveStars',  count: Math.floor(totalReviews * 0.75), percentage: 75 },
    { starsKey: 'fourStars',  count: Math.floor(totalReviews * 0.15), percentage: 15 },
    { starsKey: 'threeStars', count: Math.floor(totalReviews * 0.06), percentage: 6 },
    { starsKey: 'twoStars',   count: Math.floor(totalReviews * 0.03), percentage: 3 },
    { starsKey: 'oneStar',    count: Math.floor(totalReviews * 0.01), percentage: 1 },
  ]

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-500">{rating}</div>
          <div className="text-sm text-gray-500">{totalReviews.toLocaleString()}{t.detail?.reviewsUnit || ' reviews'}</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map((item) => (
            <div key={item.starsKey} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{t.detail?.[item.starsKey] || item.starsKey}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-10 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PriceRangeChart({ merchants }) {
  const { t } = useLanguage()
  const priceRanges = useMemo(() => {
    const ranges = [
      { name: '¥0-50', min: 0, max: 50, count: 0, color: '#FF6B00' },
      { name: '¥50-100', min: 50, max: 100, count: 0, color: '#FF9F45' },
      { name: '¥100-200', min: 100, max: 200, count: 0, color: '#FFB366' },
      { name: '¥200-500', min: 200, max: 500, count: 0, color: '#FFD08A' },
      { name: '¥500+', min: 500, max: 9999, count: 0, color: '#FFE4BD' },
    ]

    merchants.forEach(m => {
      const price = parseInt(m.priceRange?.replace(/[^0-9]/g, '') || '0')
      const range = ranges.find(r => price >= r.min && price < r.max)
      if (range) range.count++
    })

    const total = merchants.length
    return ranges.map(r => ({
      ...r,
      percentage: total > 0 ? Math.round(r.count / total * 100) : 0
    }))
  }, [merchants])

  const maxCount = Math.max(...priceRanges.map(r => r.count))
  const priceDistLabel = t.category?.priceRange || 'Price Range'
  const unitLabel = t.detail?.perPersonUnit || '/person'

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">{priceDistLabel}</h3>
      <div className="space-y-3">
        {priceRanges.map((range) => (
          <div key={range.name} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-20">{range.name}{unitLabel}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{ 
                  width: `${(range.count / maxCount) * 100}%`,
                  backgroundColor: range.color 
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-700 font-medium">
                {range.count}
              </span>
            </div>
            <span className="text-xs text-gray-500 w-12 text-right">{range.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PopularityTrend({ data }) {
  const [days] = useState(7)
  const { t } = useLanguage()
  const trendData = useMemo(() => {
    const today = new Date()
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        day: date.getDate(),
        views: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 500) + 100,
      }
    })
  }, [days])

  const maxViews = Math.max(...trendData.map(d => d.views))
  const trendLabel = t.detail?.popularityTrend || 'Popularity Trend (7 days)'
  const viewsLabel = t.detail?.views || 'Views'

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">{trendLabel}</h3>
      <div className="h-32 flex items-end justify-between gap-1">
        {trendData.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t transition-all duration-500 hover:from-orange-600 hover:to-orange-500"
              style={{ height: `${(item.views / maxViews) * 100}%` }}
              title={`${viewsLabel}: ${item.views}`}
            />
            <span className="text-xs text-gray-400">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded" />
          <span className="text-xs text-gray-500">{viewsLabel}</span>
        </div>
      </div>
    </div>
  )
}
