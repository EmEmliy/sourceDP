export default function DiscountBadge({ discount, discountDesc, discountEndTime, size = 'md' }) {
  if (!discount) return null

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg overflow-hidden">
      <div className={`${sizeClasses[size]} flex items-center gap-2`}>
        <span className="font-bold">{discount}</span>
        {discountDesc && <span className="text-white/80 text-xs">{discountDesc}</span>}
      </div>
      {discountEndTime && (
        <div className="bg-black/20 px-3 py-0.5 text-xs text-white/90">
          有效期至 {discountEndTime}
        </div>
      )}
    </div>
  )
}

export function DiscountTag({ discount }) {
  if (!discount) return null

  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded">
      {discount}
    </span>
  )
}
