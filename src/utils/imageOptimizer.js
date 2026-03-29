export function optimizeImageUrl(url, options = {}) {
  const { width = 800, quality = 80, format = 'auto' } = options
  
  if (!url) return ''
  
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}w=${width}&q=${quality}&fm=${format}`
  }
  
  if (url.includes('via.placeholder.com')) {
    return `${url}?width=${width}`
  }
  
  return url
}

export function getOptimizedImages(urls, options = {}) {
  return urls.map(url => optimizeImageUrl(url, options))
}

export function generateSrcSet(url, sizes = [400, 800, 1200]) {
  if (!url || !url.includes('unsplash.com')) return ''
  
  return sizes
    .map(size => `${optimizeImageUrl(url, { width: size })} ${size}w`)
    .join(', ')
}

export function getPlaceholderDataUrl(text, width = 400, height = 300) {
  const colors = ['f3f4f6', 'e5e7eb', 'd1d5db', '9ca3af']
  const color = colors[Math.floor(Math.random() * colors.length)]
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23${color}' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`
}

export default { optimizeImageUrl, getOptimizedImages, generateSrcSet, getPlaceholderDataUrl }
