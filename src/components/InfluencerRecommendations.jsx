import { Link } from 'react-router-dom'
import { Tag } from './ui'
import { useLanguage } from '../contexts/LanguageContext'

export default function InfluencerRecommendations({ influencers }) {
  const { t } = useLanguage()
  if (!influencers || influencers.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {t.merchant?.influencerTitle || t.home?.sectionInfluencer || 'Influencer Picks'}
        </h2>
        <span className="text-orange-500 text-sm">
          {t.merchant?.influencerMore || 'More'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={influencer.avatar}
                alt={influencer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate">{influencer.name}</h4>
                <p className="text-xs text-gray-500">
                  {(influencer.followers / 10000).toFixed(1)}{t.merchant?.influencerFollowers || 'K followers'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1 mb-3">
              <Tag style="primary" size="sm">{influencer.specialty}</Tag>
            </div>
            
            <div className="space-y-2">
              {influencer.recommend?.slice(0, 2).map((merchant) => (
                <Link
                  key={merchant.id}
                  to={`/merchant/${merchant.id}`}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <img
                    src={merchant.images?.[0] || merchant.image}
                    alt={merchant.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{merchant.name}</p>
                    <p className="text-xs text-orange-500">
                      {merchant.rating}{t.merchant?.ratingPt ?? t.home?.ratingUnit ?? ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
