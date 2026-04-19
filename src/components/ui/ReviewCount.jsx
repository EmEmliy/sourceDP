import { useLanguage } from '../../contexts/LanguageContext'

export default function ReviewCount({ count, size = 'md', showText = true }) {
  const { t } = useLanguage()
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const formatCount = (num) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num?.toString() || '0'
  }

  return (
    <span className={`${sizeClasses[size]} text-gray-500`}>
      {showText ? `${formatCount(count)}${t.detail?.reviewsUnit || t.merchant?.reviews || ' reviews'}` : formatCount(count)}
    </span>
  )
}
