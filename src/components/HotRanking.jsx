import { Link } from 'react-router-dom'
import { RankBadge } from './ui'

const TREND_MAP = {
  up:   { icon: '↑', color: '#16A34A' },
  down: { icon: '↓', color: '#DC2626' },
  same: { icon: '→', color: '#9A9A9A' },
}

export default function HotRanking({ ranking, title = '热门榜单' }) {
  if (!ranking || ranking.length === 0) return null

  return (
    <section
      className="bg-white p-4"
      style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="font-bold flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <span>🔥</span>
          {title}
        </h3>
        <Link
          to="/category/food"
          className="text-xs font-medium transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          查看榜单 →
        </Link>
      </div>

      <div className="space-y-0.5">
        {ranking.slice(0, 5).map((item, index) => {
          const trend = TREND_MAP[item.trend] || TREND_MAP.same
          return (
            <Link
              key={item.id}
              to={`/merchant/${item.id}`}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors hover:bg-orange-50 active:bg-orange-100 active:scale-[0.98]"
            >
              <RankBadge rank={index + 1} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.name}
                </p>
                {(item.rating || item.priceRange) && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {item.rating && <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{item.rating}分</span>}
                    {item.rating && item.priceRange && <span className="mx-1">·</span>}
                    {item.priceRange && <span>¥{item.priceRange}/人</span>}
                  </p>
                )}
              </div>
              <span className="text-sm font-bold flex-shrink-0" style={{ color: trend.color }}>
                {trend.icon}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
