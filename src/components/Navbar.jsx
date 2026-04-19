import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { t } = useLanguage()

  const categories = t.nav.categories
  const suggestions = t.nav.suggestions

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <nav
      className="bg-white sticky top-0 z-50"
      style={{ boxShadow: '0 1px 0 var(--color-border)' }}
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-1200 mx-auto px-4">

        {/* ── 顶部栏：Logo + 搜索 + 语言切换 ── */}
        <div className="flex items-center gap-3 h-14">
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="点评 Source 首页"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6200 0%, #E04F00 100%)' }}
            >
              <span className="text-white text-xs font-bold tracking-tight">DP</span>
            </div>
            <span
              className="text-base font-bold hidden sm:block"
              style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}
            >
              {t.nav.brand.split(' ')[0]}{' '}
              <span style={{ color: 'var(--color-primary)' }}>
                {t.nav.brand.split(' ').slice(1).join(' ') || 'Source'}
              </span>
            </span>
          </Link>

          {/* 搜索框 */}
          <div className="flex-1 relative">
            <div
              className="flex items-center h-10 rounded-full border transition-all duration-200"
              style={{
                borderColor: showSuggestions ? 'var(--color-primary)' : 'var(--color-border)',
                background: showSuggestions ? '#fff' : '#F8F8F8',
                boxShadow: showSuggestions ? '0 0 0 3px rgba(255,98,0,0.12)' : 'none',
              }}
            >
              <div className="pl-4 pr-2 text-gray-400 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                aria-label={t.nav.searchPlaceholder}
                aria-expanded={showSuggestions}
                aria-autocomplete="list"
                placeholder={t.nav.searchPlaceholder}
                className="flex-1 bg-transparent text-sm outline-none min-w-0"
                style={{ color: 'var(--color-text-primary)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                  aria-label={t.nav.clearSearch}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleSearch}
                className="m-1 h-8 px-4 rounded-full text-white text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
              >
                {t.nav.searchBtn}
              </button>
            </div>

            {/* 搜索建议下拉 */}
            {showSuggestions && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white overflow-hidden animate-scaleIn"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  transformOrigin: 'top center',
                }}
              >
                <div className="px-4 pt-3 pb-1">
                  <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{t.nav.hotSearchLabel}</p>
                </div>
                <div className="pb-2">
                  {suggestions.map((s, index) => (
                    <button
                      key={index}
                      onClick={() => { setSearchQuery(s.text); handleSearch() }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-orange-50 transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="flex-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{s.text}</span>
                      {s.tag && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 500 }}
                        >
                          {s.tag}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 语言切换器 */}
          <LanguageSwitcher />
        </div>

        {/* ── 分类导航 ── */}
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-fit
                         transition-all duration-150 hover:bg-orange-50 active:scale-95 flex-shrink-0"
              title={cat.name}
            >
              <span className="text-xl leading-none">{cat.icon}</span>
              <span
                className="text-xs whitespace-nowrap font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
