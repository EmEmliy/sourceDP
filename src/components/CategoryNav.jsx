import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function CategoryNav({ categories }) {
  const [activeCategory, setActiveCategory] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)

  return (
    <div className="relative">
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <span className="text-3xl mb-1.5">{cat.icon}</span>
            <span className="text-xs text-gray-700 font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>

      {hoveredCategory && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border p-4 z-20">
          <div className="flex flex-wrap gap-2">
            {categories
              .find((c) => c.id === hoveredCategory)
              ?.subCategories?.map((sub, idx) => (
                <Link
                  key={idx}
                  to={`/category/${hoveredCategory}`}
                  className="px-4 py-2 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-full text-sm transition-colors"
                >
                  {sub}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
