import { useState } from 'react'
import { Link } from 'react-router-dom'

  const settingsSections = [
  {
    title: '基本设置',
    items: [
      { id: 'profile', icon: '👤', title: '关于我们', link: '/profile' },
      { id: 'feedback', icon: '💬', title: '意见反馈', action: 'feedback' },
    ]
  },
  {
    title: '隐私设置',
    items: [
      { id: 'privacy', icon: '🔒', title: '隐私政策', link: '/privacy' },
      { id: 'terms', icon: '📜', title: '用户协议', link: '/terms' },
      { id: 'data', icon: '📊', title: '个人信息下载', action: 'downloadData' },
    ]
  },
  {
    title: '通用设置',
    items: [
      { id: 'language', icon: '🌐', title: '语言', subtitle: '简体中文', action: 'setLanguage' },
      { id: 'notifications', icon: '🔔', title: '推送通知', switch: true, value: true },
      { id: 'location', icon: '📍', title: '位置权限', switch: true, value: true },
    ]
  },
  {
    title: '关于',
    items: [
      { id: 'version', icon: 'ℹ️', title: '版本', subtitle: 'v1.0.0' },
      { id: 'feedback', icon: '💬', title: '意见反馈', action: 'feedback' },
      { id: 'help', icon: '❓', title: '帮助中心', link: '/help' },
    ]
  },
]

export default function Settings() {
  const [switches, setSwitches] = useState({
    notifications: true,
    location: true
  })

  const handleSwitch = (id) => {
    setSwitches(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAction = (action) => {
    switch(action) {
      case 'changePassword':
        alert('修改密码功能开发中')
        break
      case 'bindPhone':
        alert('绑定手机功能开发中')
        break
      case 'bindEmail':
        alert('绑定邮箱功能开发中')
        break
      case 'downloadData':
        alert('个人信息下载功能开发中')
        break
      case 'setLanguage':
        alert('语言设置功能开发中')
        break
      case 'feedback':
        alert('意见反馈功能开发中')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <Link to="/profile" className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">设置</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {settingsSections.map((section, idx) => (
          <div key={section.title} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-xs text-gray-500 font-medium">{section.title}</span>
            </div>
            {section.items.map((item, itemIdx) => (
              <div 
                key={item.id}
                className={`flex items-center px-4 py-3 ${itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <div className="flex-1">
                  {item.link ? (
                    <Link to={item.link} className="block">
                      <span className="font-medium text-gray-800">{item.title}</span>
                      {item.subtitle && <span className="text-gray-400 text-sm ml-2">{item.subtitle}</span>}
                    </Link>
                  ) : item.switch ? (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{item.title}</span>
                      <button
                        onClick={() => handleSwitch(item.id)}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          switches[item.id] ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          switches[item.id] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => item.action && handleAction(item.action)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium text-gray-800">{item.title}</span>
                      <div className="flex items-center">
                        {item.subtitle && <span className="text-gray-400 text-sm mr-2">{item.subtitle}</span>}
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex justify-around items-center safe-area-bottom">
        <Link to="/" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">首页</span>
        </Link>
        <Link to="/category/food" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-xs mt-1">分类</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">搜索</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center p-2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">订单</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2 text-orange-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">我的</span>
        </Link>
      </nav>
    </div>
  )
}
