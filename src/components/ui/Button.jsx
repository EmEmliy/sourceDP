const variants = {
  primary: {
    style: {
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
      color: '#fff',
      boxShadow: '0 3px 10px rgba(255,98,0,0.28)',
    },
    hover: 'hover:opacity-90',
    className: 'active:scale-95',
  },
  secondary: {
    style: { background: '#fff', color: 'var(--color-text-primary)', border: '1.5px solid var(--color-border)' },
    hover: 'hover:border-orange-300 hover:text-orange-500',
    className: 'active:scale-95',
  },
  ghost: {
    style: { background: 'transparent', color: 'var(--color-text-secondary)' },
    hover: 'hover:bg-gray-100',
    className: 'active:scale-95',
  },
  danger: {
    style: { background: '#EF4444', color: '#fff', boxShadow: '0 3px 10px rgba(239,68,68,0.28)' },
    hover: 'hover:opacity-90',
    className: 'active:scale-95',
  },
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1',
  md: 'px-5 py-2.5 text-sm gap-1.5',
  lg: 'px-6 py-3 text-base gap-2',
}

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  block = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const v = variants[variant] || variants.primary

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-full font-semibold
        transition-all duration-150 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400
        disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none
        ${v.hover} ${v.className}
        ${sizes[size]}
        ${block ? 'w-full' : ''}
        ${className}
      `}
      style={v.style}
      {...props}
    >
      {loading ? (
        <svg className={`${iconSizes[size]} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
