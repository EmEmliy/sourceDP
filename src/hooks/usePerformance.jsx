import { useEffect } from 'react'

export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleLoad = () => {
      const perfData = performance.getEntriesByType('navigation')[0]
      if (perfData) {
        const metrics = {
          'DNS 查询': `${perfData.domainLookupEnd - perfData.domainLookupStart}ms`,
          'TCP 连接': `${perfData.connectEnd - perfData.connectStart}ms`,
          'SSL 握手': `${perfData.secureConnectionStart > 0 ? perfData.connectEnd - perfData.secureConnectionStart : 0}ms`,
          '请求响应': `${perfData.responseStart - perfData.requestStart}ms`,
          '内容加载': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
          '页面完整': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
          '首次渲染': `${perfData.domInteractive - perfData.fetchStart}ms`,
          '首次内容': `${perfData.domContentLoaded - perfData.fetchStart}ms`,
          '完全加载': `${perfData.loadEventEnd - perfData.fetchStart}ms`,
        }
        console.log('📊 页面性能指标:', metrics)
      }
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => window.removeEventListener('load', handleLoad)
  }, [])
}

export function reportWebVitals({ name, delta, id }) {
  console.log(`⚡ Web Vitals - ${name}:`, delta, 'ms', '(id:', id, ')')
}

export default usePerformanceMonitor
