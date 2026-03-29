import { useState, useRef, useCallback } from 'react'

export default function PullToRefresh({ onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      isPulling.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isPulling.current || window.scrollY > 0) return
    
    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current
    
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 80))
    }
  }, [])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 60) {
      setIsRefreshing(true)
      await onRefresh?.()
      setIsRefreshing(false)
    }
    setPullDistance(0)
    isPulling.current = false
  }, [pullDistance, onRefresh])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: isRefreshing ? 60 : pullDistance }}
      >
        {(isRefreshing || pullDistance > 0) && (
          <div className="flex flex-col items-center gap-1">
            {isRefreshing ? (
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg 
                className="w-6 h-6 text-orange-500 transition-transform" 
                style={{ transform: `rotate(${pullDistance * 3}deg)` }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span className="text-xs text-gray-500">
              {isRefreshing ? '刷新中...' : pullDistance > 60 ? '释放刷新' : '下拉刷新'}
            </span>
          </div>
        )}
      </div>
      
      <div style={{ transform: isRefreshing ? 'translateY(60px)' : `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  )
}
