import { Link } from 'react-router-dom'
import { DiscountTag } from './ui'

export default function QualitySelection({ topics }) {
  if (!topics || topics.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">品质优选</h2>
        <Link to="/category/food" className="text-orange-500 text-sm hover:underline">
          查看更多
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
            <div className="relative h-32 overflow-hidden">
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="text-xl font-bold">{topic.title}</h3>
                <p className="text-white/80 text-sm">{topic.subtitle}</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {topic.merchants?.slice(0, 4).map((merchant) => (
                  <Link
                    key={merchant.id}
                    to={`/merchant/${merchant.id}`}
                    className="flex-shrink-0 w-20"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden mb-1">
                      <img
                        src={merchant.images?.[0] || merchant.image}
                        alt={merchant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600 truncate">{merchant.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
