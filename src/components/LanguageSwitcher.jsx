import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../i18n/translations';

export default function LanguageSwitcher() {
  const { lang, switchLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative flex-shrink-0" style={{ zIndex: 100 }}>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t.langSwitcher.label}
        className="flex items-center gap-1.5 h-8 px-2.5 rounded-full border transition-all duration-150 hover:bg-orange-50 active:scale-95"
        style={{
          borderColor: open ? 'var(--color-primary)' : 'var(--color-border)',
          color: open ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          boxShadow: open ? '0 0 0 3px rgba(255,98,0,0.10)' : 'none',
          background: open ? '#FFF7F3' : '#fff',
        }}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-semibold hidden sm:inline" style={{ letterSpacing: '0.01em' }}>
          {current.label}
        </span>
        {/* 下箭头 */}
        <svg
          className="w-3 h-3 flex-shrink-0 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--color-text-tertiary)',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {open && (
        <div
          role="listbox"
          aria-label={t.langSwitcher.label}
          className="absolute right-0 mt-2 w-36 overflow-hidden animate-scaleIn"
          style={{
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            background: '#fff',
            transformOrigin: 'top right',
          }}
        >
          {LANGUAGES.map((l) => {
            const isActive = l.code === lang;
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  switchLang(l.code);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors"
                style={{
                  background: isActive ? 'var(--color-primary-bg)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#F8F8F8';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-base">{l.flag}</span>
                <span className="text-sm">{l.label}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 ml-auto flex-shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
