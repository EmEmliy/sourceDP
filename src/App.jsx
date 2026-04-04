import { useState, useCallback, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Category from './pages/Category'
import MerchantDetail from './pages/MerchantDetail'
import SearchPage from './pages/Search'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Footprints from './pages/Footprints'
import Coupons from './pages/Coupons'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import About from './pages/About'
import FloatingToolbar from './components/FloatingToolbar'
import MobileNav from './components/MobileNav'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import PullToRefresh from './components/ui/PullToRefresh'
import { usePerformanceMonitor } from './hooks/usePerformance'
import { setupGlobalErrorHandler, trackPageView } from './utils/errorTracking'

function AppContent() {
  usePerformanceMonitor()
  const [refreshKey, setRefreshKey] = useState(0)
  
  useEffect(() => {
    setupGlobalErrorHandler()
  }, [])
  
  useEffect(() => {
    trackPageView(window.location.pathname)
  }, [])

  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshKey(prev => prev + 1)
    console.log('Page refreshed')
  }, [])

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div key={refreshKey} className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sh/shanghai-hotpot" element={<Category forcedCategoryId="food" geoFilterKey="shanghai-hotpot" pageVariant="shanghai" />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/merchant/:merchantId" element={<MerchantDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/footprints" element={<Footprints />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <FloatingToolbar />
        <MobileNav />
      </div>
    </PullToRefresh>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
