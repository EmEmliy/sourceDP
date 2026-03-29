const badgeVariants = {
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-orange-100 text-orange-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
}

const badgeSizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}

export default function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${badgeVariants[variant]}
        ${badgeSizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      )}
      {children}
    </span>
  )
}

export function RankBadge({ rank }) {
  const getVariant = (r) => {
    if (r === 1) return 'warning'
    if (r === 2) return 'info'
    if (r === 3) return 'default'
    return 'default'
  }

  const getEmoji = (r) => {
    if (r === 1) return '🥇'
    if (r === 2) return '🥈'
    if (r === 3) return '🥉'
    return r
  }

  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold">
      {getEmoji(rank)}
    </span>
  )
}
