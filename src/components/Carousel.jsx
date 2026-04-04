import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const banners = [
  {
    id: 1,
    image: '/images/banner/banner_hotpot.jpg',
    title: '🎉 周末半价狂欢节',
    subtitle: '每周六日 · 火锅/烧烤/日料半价抢 · 海底捞/巴奴/捞王等热门餐厅参与',
    link: '/category/food',
    gradient: 'from-red-700/85 via-red-600/55 to-transparent',
  },
  {
    id: 2,
    image: '/images/banner/banner_food.jpg',
    title: '👑 会员免单',
    subtitle: '美团会员专享 · 每月抽免单名额 · 加入会员立享外卖/到店双重权益',
    link: '/category/food',
    gradient: 'from-orange-700/85 via-orange-500/55 to-transparent',
  },
  {
    id: 3,
    image: '/images/banner/banner_hotel.jpg',
    title: '酒店民宿特惠季',
    subtitle: '希尔顿·香格里拉·亚朵 · 会员价低至5折 · 周末出行首选',
    link: '/category/hotel',
    gradient: 'from-slate-800/80 via-slate-700/50 to-transparent',
  },
  {
    id: 4,
    image: '/images/banner/banner_beauty.jpg',
    title: '丽人服务专场',
    subtitle: '美容·美发·美甲 · 新客7折 · 周末到店立享优惠',
    link: '/category/beauty',
    gradient: 'from-pink-700/80 via-pink-600/50 to-transparent',
  },
  {
    id: 5,
    image: '/images/banner/banner_fitness.jpg',
    title: '健身体验周',
    subtitle: '超级猩猩·乐刻运动 · 首月免费体验 · 会员专属福利',
    link: '/category/fitness',
    gradient: 'from-emerald-800/80 via-emerald-700/50 to-transparent',
  },
]

export default function Carousel({ banners: customBanners }) {
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const displayBanners = customBanners || banners
  const total = displayBanners.length
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const autoPlayRef = useRef(null)

  const next = useCallback(() => setCurrent(p => (p + 1) % total), [total])
  const prev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total])

  // 自动播放
  const startAutoPlay = useCallback(() => {
    autoPlayRef.current = setInterval(next, 4500)
  }, [next])
  const stopAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current)
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [startAutoPlay, stopAutoPlay])

  // 触摸滑动
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    setIsDragging(true)
    stopAutoPlay()
  }
  const onTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }
  const onTouchEnd = () => {
    setIsDragging(false)
    if (touchDeltaX.current < -50) next()
    else if (touchDeltaX.current > 50) prev()
    startAutoPlay()
  }

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: '280px', borderRadius: 'var(--radius-xl)' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {displayBanners.map((banner, index) => {
        const offset = index - current
        const isActive = offset === 0

        return (
          <Link
            key={banner.id}
            to={banner.link}
            className="absolute inset-0"
            style={{
              transition: isDragging ? 'none' : 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : `scale(1.04) translateX(${offset > 0 ? '2%' : '-2%'})`,
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 2 : 1,
            }}
            tabIndex={isActive ? 0 : -1}
            aria-hidden={!isActive}
          >
            {/* 背景图 */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* 渐变遮罩——左侧深，右侧透明 */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}
            />

            {/* 文案区 */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className="font-bold text-white mb-1.5 drop-shadow-md"
                style={{ fontSize: '22px', lineHeight: 1.2, letterSpacing: '-0.01em' }}
              >
                {banner.title}
              </h3>
              <p
                className="text-white/85 drop-shadow text-sm leading-relaxed"
              >
                {banner.subtitle}
              </p>
              <div
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                立即查看
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        )
      })}

      {/* 左右箭头（桌面显示，移动端隐藏） */}
      <button
        onClick={(e) => { e.preventDefault(); prev() }}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center text-white
                   hidden md:flex transition-all hover:scale-110 active:scale-95"
        style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
        aria-label="上一张"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next() }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center text-white
                   hidden md:flex transition-all hover:scale-110 active:scale-95"
        style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
        aria-label="下一张"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 指示点 */}
      <div className="absolute bottom-4 right-5 flex items-center gap-1.5 z-10">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrent(index); stopAutoPlay(); setTimeout(startAutoPlay, 5000) }}
            aria-label={`第${index + 1}张`}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === current ? '20px' : '6px',
              height: '6px',
              background: index === current ? '#fff' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
