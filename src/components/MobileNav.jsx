import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    const handleGestureStart = (e) => {
      touchStartX.current = e.touches[0].clientX
    }
    
    const handleGestureEnd = (e) => {
      touchEndX.current = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX.current
      
      if (Math.abs(diff) > 100) {
        if (diff > 0) {
          navigate('/category/food')
        }
      }
    }

    document.addEventListener('touchstart', handleGestureStart, { passive: true })
    document.addEventListener('touchend', handleGestureEnd, { passive: true })
    
    return () => {
      document.removeEventListener('touchstart', handleGestureStart)
      document.removeEventListener('touchend', handleGestureEnd)
    }
  }, [navigate])

  const navItems = [
    {
      id: 'home',
      path: '/',
      label: '首页',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'discovery',
      path: '/category/food',
      label: '发现',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'favorites',
      path: '/favorites',
      label: '收藏',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      path: '/profile',
      label: '我的',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const quickActions = [
    { id: 'home', icon: '🏠', label: '首页' },
    { id: 'food', icon: '🍜', label: '美食' },
    { id: 'hotel', icon: '🏨', label: '酒店' },
    { id: 'movie', icon: '🎬', label: '电影' },
    { id: 'beauty', icon: '💄', label: '丽人' },
    { id: 'fitness', icon: '🏋️', label: '健身' },
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 ${
                  isActive ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                <span className={`relative ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className="text-xs mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <svg className={`w-6 h-6 text-white transition-transform ${isExpanded ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {isExpanded && (
          <div className="absolute bottom-full left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 mb-2 animate-slideUp">
            <div className="grid grid-cols-6 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  to={action.id === 'home' ? '/' : `/category/${action.id}`}
                  onClick={() => setIsExpanded(false)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-orange-50 active:bg-orange-100"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs text-gray-600">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      <div className="h-16 md:hidden" />
      
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}
