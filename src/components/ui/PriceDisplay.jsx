export default function PriceDisplay({ priceRange, size = 'md', showUnit = true }) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const unitText = showUnit ? '/人' : ''

  return (
    <span className={`${sizeClasses[size]} text-gray-600`}>
      {priceRange}{unitText}
    </span>
  )
}
