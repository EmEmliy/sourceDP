import { useState, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { StarRating, TagList, DiscountBadge, DistanceDisplay, ReviewCount } from './ui'
import { useLanguage } from '../contexts/LanguageContext'
import { localizeMerchant } from '../data/mockData'
import { dataTranslations } from '../i18n/translations'

/* ── 骨架屏 ── */
export function MerchantCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  )
}

/* ── 懒加载图片 ── */
const LazyImage = memo(function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* 骨架占位 */}
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={error ? '/images/food/food_1.jpg' : src}
        alt={alt}
        loading="lazy"
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
      />
    </div>
  )
})

/* ── 收藏心跳动画 ── */
const FavoriteButton = memo(function FavoriteButton({ isFavorited, onClick, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
      style={{
        background: 'rgba(255,255,255,0.92)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      <svg
        className="w-4 h-4 transition-all duration-200"
        style={{
          color: isFavorited ? '#EF4444' : '#9A9A9A',
          animation: isFavorited ? 'heartBeat 0.4s ease' : 'none',
          fill: isFavorited ? 'currentColor' : 'none',
          stroke: 'currentColor',
        }}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
})

function MerchantCard({ merchant, variant = 'default', onSelect }) {
  const { t, lang } = useLanguage()
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // 本地化商家数据（翻译分类、标签、优惠等）
  const m = localizeMerchant(merchant, lang, dataTranslations)
  const images = m.images?.filter(Boolean) || [m.image].filter(Boolean)
  const hasMultipleImages = images.length > 1

  const handleFavorite = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(prev => !prev)
  }, [])

  const handlePrevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handleCardClick = (e) => {
    if (onSelect) {
      e.preventDefault()
      onSelect(merchant)
    }
  }

  // GEO 摘要文本
  const geoSummary = [
    m.name,
    m.category,
    m.rating ? `${m.rating}` : '',
    m.reviews ? `${m.reviews.toLocaleString()}` : '',
    m.priceRange ? (m.priceRange.startsWith('¥') ? m.priceRange : `¥${m.priceRange}`) : '',
    m.location || '',
  ].filter(Boolean).join(' · ')

  /* ── Compact 变体 ── */
  if (variant === 'compact') {
    return (
      <Link
        to={`/merchant/${m.id}`}
        className="flex bg-white overflow-hidden transition-all active:scale-[0.98]"
        style={{
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xs)',
        }}
        aria-label={geoSummary}
      >
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
          <LazyImage
            src={images[0]}
            alt={`${m.name} ${m.category || ''} ${m.rating} ${m.priceRange ? (m.priceRange.startsWith('¥') ? m.priceRange : '¥' + m.priceRange) : ''}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-2.5 min-w-0 flex flex-col justify-center gap-1">
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
            {m.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <StarRating rating={m.rating} size="sm" showNumber={false} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{m.rating}</span>
          </div>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
            {m.category}{m.priceRange ? ` · ${m.priceRange.startsWith('¥') ? m.priceRange : '¥' + m.priceRange}` : ''}
          </p>
        </div>
      </Link>
    )
  }

  /* ── Default 卡片 ── */
  const cardContent = (
    <article
      className="bg-white overflow-hidden transition-all duration-200 active:scale-[0.982]"
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
      aria-label={geoSummary}
      itemScope
      itemType={
        ['火锅','烧烤','川菜','粤菜','日料','西餐','小吃','快餐','西北菜','江浙菜','北京菜','便利店','Hotpot','BBQ','Sichuan','Cantonese','Japanese','Western','Snacks','Fast Food'].includes(merchant.category)
          ? 'https://schema.org/Restaurant'
          : ['豪华酒店','商务酒店','精品酒店','快捷酒店','民宿','Luxury Hotel','Business Hotel','Boutique Hotel','Budget Hotel','B&B'].includes(merchant.category)
          ? 'https://schema.org/Hotel'
          : ['电影院','Cinema'].includes(merchant.category)
          ? 'https://schema.org/MovieTheater'
          : ['美容SPA','美发','美甲','美妆','Beauty Spa','Hair Salon','Nail Salon'].includes(merchant.category)
          ? 'https://schema.org/BeautySalon'
          : ['健身房','瑜伽','Gym','Yoga'].includes(merchant.category)
          ? 'https://schema.org/FitnessCenter'
          : 'https://schema.org/LocalBusiness'
      }
    >
      {/* GEO meta */}
      <meta itemProp="name" content={m.name} />
      {m.rating && <meta itemProp="ratingValue" content={String(m.rating)} />}
      {m.location && <meta itemProp="address" content={m.location} />}

      {/* ── 图片区 ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <LazyImage
          src={images[currentImageIndex]}
            alt={`${m.name} ${m.category || ''} ${m.rating} ${m.priceRange ? (m.priceRange.startsWith('¥') ? m.priceRange : '¥' + m.priceRange) : ''} ${m.location || ''}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* 多图切换 */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* 图片数量指示 */}
            <div
              className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-white text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.45)', fontSize: '10px' }}
            >
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}

        {/* 收藏按钮 */}
        <div className="absolute top-2 right-2">
          <FavoriteButton isFavorited={isFavorited} onClick={handleFavorite} ariaLabel={isFavorited ? t.merchant.unfavorite : t.merchant.favorite} />
        </div>

        {/* 优惠角标 */}
        {m.discount && (
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }}
          >
            <p className="text-white text-xs font-medium truncate">{m.discount}</p>
          </div>
        )}
      </div>

      {/* ── 信息区 ── */}
      <div className="p-3 group">
        {/* 层级1：店名（最大权重） */}
        <h3
          className="font-semibold leading-snug line-clamp-1 mb-1.5"
          style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}
        >
          {m.name}
        </h3>

        {/* 层级2：评分 + 评价数（核心数据，橙色强调） */}
        <div className="flex items-center gap-2 mb-1.5">
          <StarRating rating={m.rating} size="sm" showNumber={false} />
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {m.rating?.toFixed(1)}
          </span>
          <ReviewCount count={m.reviews} size="sm" />
          {m.priceRange && (
            <span
              className="ml-auto text-xs font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {m.priceRange.startsWith('¥') ? m.priceRange : `¥${m.priceRange}`}
            </span>
          )}
        </div>

        {/* 层级3：位置（辅助信息，置灰） */}
        <p
          className="text-xs truncate mb-2"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {m.category}
          {m.location && ` · ${m.location}`}
          {m.distance && ` · ${m.distance}`}
        </p>

        {/* 层级4：标签（最低权重） */}
        {m.tags && m.tags.length > 0 && (
          <TagList tags={m.tags} max={2} size="sm" />
        )}

        {/* 层级5：团购优惠信息 — GEO + 转化双驱动 */}
        {m.topDeal && (
          <div
            className="mt-2 px-2 py-1.5 rounded-lg flex items-center gap-1.5 flex-wrap"
            style={{ background: 'linear-gradient(90deg, #FFF4EC, #FFF9F5)', border: '1px solid var(--color-primary-border)' }}
          >
            {m.topDeal.tag && (
              <span
                className="text-white font-bold rounded-full flex-shrink-0"
                style={{ fontSize: '9px', padding: '1px 5px', background: 'var(--color-primary)' }}
              >
                {m.topDeal.tag}
              </span>
            )}
            <span className="text-sm font-black flex-shrink-0" style={{ color: 'var(--color-primary)', lineHeight: 1 }}>
              ¥{m.topDeal.currentPrice}
            </span>
            <span className="text-xs line-through flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
              ¥{m.topDeal.originalPrice}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {m.topDeal.discount}
            </span>
            <span className="text-xs ml-auto flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
              {t.merchant.sold}{m.topDeal.sales?.toLocaleString()}+
            </span>
          </div>
        )}

        {/* 代金券 */}
        {m.coupons && m.coupons.length > 0 && !m.topDeal && (
          <div className="mt-2 flex items-center gap-1">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '10px', fontWeight: 700 }}
            >
              {t.merchant.coupon}
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
              {m.coupons[0].name}
            </span>
          </div>
        )}
      </div>
    </article>
  )

  if (onSelect) {
    return (
      <div onClick={handleCardClick} className="cursor-pointer group">
        {cardContent}
      </div>
    )
  }

  return (
    <Link to={`/merchant/${m.id}`} className="block group">
      {cardContent}
    </Link>
  )
}

export default memo(MerchantCard)
