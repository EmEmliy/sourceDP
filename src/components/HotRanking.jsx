import { Link } from 'react-router-dom'
import { RankBadge } from './ui'

export default function HotRanking({ ranking, title = '热门榜单' }) {
  if (!ranking || ranking.length === 0) return null

  return (
    <section className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="text-orange-500">🔥</span>
          {title}
        </h3>
        <Link to="/category/food" className="text-orange-500 text-xs hover:underline">
          查看榜单
        </Link>
      </div>
      
      <div className="space-y-3">
        {ranking.slice(0, 5).map((item, index) => (
          <Link
            key={item.id}
            to={`/merchant/${item.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RankBadge rank={item.rank} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">{item.name}</p>
            </div>
            {item.trend === 'up' && (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
            {item.trend === 'down' && (
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
