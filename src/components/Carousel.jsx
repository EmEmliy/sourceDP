import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const banners = [
  {
    id: 1,
    image: '/images/banner/banner_food.jpg',
    title: '新人专享立减50元',
    subtitle: '首次下单立减，海底捞、TRB等百家好店等你来',
    link: '/category/food',
    color: 'from-orange-500/80 to-red-500/80',
  },
  {
    id: 2,
    image: '/images/banner/banner_hotpot.jpg',
    title: '周三半价美食节',
    subtitle: '火锅、烧烤、日料 · 周三限时抢购',
    link: '/category/food',
    color: 'from-red-600/80 to-orange-400/80',
  },
  {
    id: 3,
    image: '/images/banner/banner_hotel.jpg',
    title: '酒店民宿特惠季',
    subtitle: '希尔顿、香格里拉、亚朵 · 低至5折起',
    link: '/category/hotel',
    color: 'from-slate-700/80 to-blue-600/80',
  },
  {
    id: 4,
    image: '/images/banner/banner_beauty.jpg',
    title: '丽人服务专场',
    subtitle: '美容·美发·美甲 · 新客7折优惠',
    link: '/category/beauty',
    color: 'from-pink-500/80 to-rose-500/80',
  },
  {
    id: 5,
    image: '/images/banner/banner_fitness.jpg',
    title: '健身体验周',
    subtitle: '超级猩猩、乐刻运动 · 首月免费体验',
    link: '/category/fitness',
    color: 'from-green-600/80 to-teal-500/80',
  },
]

export default function Carousel({ banners: customBanners }) {
  const [current, setCurrent] = useState(0)
  const displayBanners = customBanners || banners

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayBanners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [displayBanners.length])

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + displayBanners.length) % displayBanners.length)
  }

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % displayBanners.length)
  }

  return (
    <div className="relative w-full h-56 overflow-hidden rounded-xl shadow-lg group">
      {displayBanners.map((banner, index) => (
        <Link
          key={banner.id}
          to={banner.link}
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.color || 'from-orange-500/60 to-red-500/60'}`} />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{banner.title}</h3>
            <p className="text-white/90">{banner.subtitle}</p>
          </div>
        </Link>
      ))}
      
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
