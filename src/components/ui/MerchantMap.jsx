import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

// 用腾讯地图 iframe 嵌入，无需 API key
export default function MerchantMap({ location, name, latitude, longitude }) {
  const [mapError, setMapError] = useState(false)
  const { t } = useLanguage()

  // 优先使用经纬度，否则用地址文本
  const searchQuery = latitude && longitude
    ? `${latitude},${longitude}`
    : encodeURIComponent(location || name || '北京')

  // 腾讯地图嵌入链接（share 模式，无需登录/API key）
  const tencentMapUrl = latitude && longitude
    ? `https://map.qq.com/?type=marker&isopts=1&center=${latitude},${longitude}&zoom=16&name=${encodeURIComponent(name || location)}&coord=${latitude},${longitude}&referer=sohu-dianping`
    : `https://map.qq.com/?type=marker&isopts=1&name=${encodeURIComponent(name || '')}&addr=${encodeURIComponent(location || '')}&referer=sohu-dianping`

  // 百度地图静态图片（无需 key 的免费版）
  const baiduStaticUrl = latitude && longitude
    ? `https://api.map.baidu.com/staticimage/v2?ak=E4805d16520de693a3fe707cdc962045&mcode=666&center=${longitude},${latitude}&width=400&height=300&zoom=16&markers=${longitude},${latitude}`
    : null

  // 如果有经纬度，使用百度静态地图图片；否则降级为腾讯地图 iframe
  const useStaticImage = !!(latitude && longitude && baiduStaticUrl)

  const viewOnMapLabel = t.detail?.viewOnMap || 'View on Map'
  const tencentLabel = t.detail?.mapTencent || 'Tencent Maps'
  const googleLabel = t.detail?.mapGoogle || 'Google Maps'
  const baiduLabel = t.detail?.mapBaidu || 'Baidu Maps'

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {mapError ? (
          <MapFallback location={location} name={name} tencentMapUrl={tencentMapUrl} label={viewOnMapLabel} />
        ) : useStaticImage ? (
          <img
            src={baiduStaticUrl}
            alt={`${name} map`}
            className="w-full h-full object-cover"
            onError={() => setMapError(true)}
          />
        ) : (
          <iframe
            src={tencentMapUrl}
            title={`${name || location} map`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setMapError(true)}
          />
        )}
      </div>
      <div className="p-3 bg-white">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-700">{location}</p>
            <div className="flex gap-3 mt-1">
              <a
                href={`https://map.qq.com/?type=marker&isopts=1&name=${encodeURIComponent(name || '')}&addr=${encodeURIComponent(location || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-500 hover:underline"
              >
                {tencentLabel}
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(location || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-500 hover:underline"
              >
                {googleLabel}
              </a>
              <a
                href={`https://api.map.baidu.com/geocoder?address=${encodeURIComponent(location || '')}&output=html`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-500 hover:underline"
              >
                {baiduLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MapFallback({ location, name, tencentMapUrl, label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 gap-3">
      <div className="text-center">
        <div className="text-4xl mb-2">📍</div>
        <p className="text-sm font-medium text-gray-700">{name}</p>
        <p className="text-xs text-gray-500 mt-1 px-4">{location}</p>
      </div>
      <a
        href={tencentMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition-colors"
      >
        {label}
      </a>
    </div>
  )
}
