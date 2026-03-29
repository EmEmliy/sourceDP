import { useState, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { StarRating, TagList, DiscountBadge, DistanceDisplay, ReviewCount } from './ui'

const LazyImage = memo(function LazyImage({ src, alt, className, onLoad }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className} ${loaded ? '' : 'animate-shimmer bg-gray-200'}`}
      onLoad={() => {
        setLoaded(true)
        onLoad?.()
      }}
    />
  )
})

function MerchantCard({ merchant, variant = 'default' }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = merchant.images || [merchant.image]
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

  if (variant === 'compact') {
    return (
      <Link
        to={`/merchant/${merchant.id}`}
        className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex">
          <div className="w-20 h-20 flex-shrink-0">
            <LazyImage
              src={images[currentImageIndex]}
              alt={merchant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-2 min-w-0">
            <h3 className="font-medium text-gray-800 text-sm truncate">{merchant.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <StarRating rating={merchant.rating} size="sm" />
            </div>
            <p className="text-gray-500 text-xs truncate mt-0.5">{merchant.category}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/merchant/${merchant.id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="relative">
        <div className="flex">
          <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
            <LazyImage
              src={images[currentImageIndex]}
              alt={merchant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-1 h-1 rounded-full ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <button
              onClick={handleFavorite}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg
                className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-3 min-w-0">
            <h3 className="font-medium text-gray-800 truncate group-hover:text-orange-600 transition-colors">
              {merchant.name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={merchant.rating} size="sm" />
              <ReviewCount count={merchant.reviews} size="sm" />
            </div>
            
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-gray-500 text-sm truncate">{merchant.category}</p>
              {merchant.regionalLabel && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs">
                  {merchant.regionalLabel}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-500 text-xs truncate">{merchant.location}</p>
              <DistanceDisplay distance={merchant.distance} size="sm" />
            </div>
            
            {merchant.tags && merchant.tags.length > 0 && (
              <div className="mt-2">
                <TagList tags={merchant.tags} max={2} size="sm" />
              </div>
            )}
          </div>
        </div>
        
        {merchant.discount && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-3 py-2 border-t border-orange-100">
            <DiscountBadge 
              discount={merchant.discount} 
              discountDesc={merchant.discountDesc}
              size="sm" 
            />
          </div>
        )}
      </div>
    </Link>
  )
}

export default memo(MerchantCard)
