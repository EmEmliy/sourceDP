import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const { t } = useLanguage()

  useEffect(() => {
    const handleGestureStart = (e) => {
      touchStartX.current = e.touches[0].clientX
    }
    const handleGestureEnd = (e) => {
      touchEndX.current = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX.current
      if (Math.abs(diff) > 100 && diff > 0) {
        navigate('/category/food')
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
      label: t.mobileNav.home,
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8}
            d={active
              ? 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'
              : 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            }
          />
        </svg>
      ),
    },
    {
      id: 'discovery',
      path: '/category/food',
      label: t.mobileNav.category,
      // 罗盘图标 — 与搜索图标完全区分
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          {active ? (
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm2.32 3.85L9.5 12 12 14.5l4.15-5.18a.5.5 0 00-.63-.68L12 10.5 9.5 8 14.68 5.85a.5.5 0 01-.36.85z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="9" strokeWidth={1.8}/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
              <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
            </>
          )}
        </svg>
      ),
    },
    {
      id: 'coupons',
      path: '/coupons',
      label: t.mobileNav.coupons,
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8}
            d={active
              ? 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'
              : 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'
            }
          />
        </svg>
      ),
    },
    {
      id: 'search',
      path: '/search',
      label: t.mobileNav.favorites,
      // 放大镜图标 — 与发现图标完全区分
      icon: (active) => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.2 : 1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      path: '/profile',
      label: t.mobileNav.profile,
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8}
            d={active
              ? 'M18 10a6 6 0 11-12 0 6 6 0 0112 0zM2 21a10 10 0 0120 0H2z'
              : 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            }
          />
        </svg>
      ),
    },
  ]

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative transition-all active:scale-90"
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}
              >
                {/* 活跃指示条 */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full animate-scaleIn"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}
                <span className={isActive ? 'scale-110 transition-transform' : 'transition-transform'}>
                  {item.icon(isActive)}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ fontSize: '10px', color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      {/* 底部占位，防止内容被遮挡 */}
      <div className="h-14 md:hidden" />
    </>
  )
}
