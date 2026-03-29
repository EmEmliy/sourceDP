export function Skeleton({ className = '', animate = true }) {
  return (
    <div
      className={`
        bg-gray-200 rounded
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  )
}

export function MerchantCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="flex">
        <Skeleton className="w-28 h-28 flex-shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-1" />
          <Skeleton className="h-3 w-1/3 mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <MerchantCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ImageSkeleton({ aspectRatio = '16/9' }) {
  return (
    <div style={{ aspectRatio }} className="w-full">
      <Skeleton className="w-full h-full" />
    </div>
  )
}
