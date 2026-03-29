export default function ReviewCount({ count, size = 'md', showText = true }) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const formatCount = (num) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toString()
  }

  return (
    <span className={`${sizeClasses[size]} text-gray-500`}>
      {showText ? `${formatCount(count)}条评价` : formatCount(count)}
    </span>
  )
}
