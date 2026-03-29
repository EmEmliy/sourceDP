import { useState } from 'react'
import { Link } from 'react-router-dom'

const messages = [
  {
    id: 'm1',
    type: 'system',
    title: '账户安全通知',
    content: '您的账号于2026-03-16在新设备登录，如非本人操作请及时修改密码。',
    time: '2小时前',
    read: false,
    icon: '🔒',
    link: '/settings'
  },
  {
    id: 'm2',
    type: 'order',
    title: '订单状态更新',
    content: '您的订单已完成配送，欢迎您对海底捞火锅(吴中路店)进行评价。',
    time: '1天前',
    read: false,
    icon: '📋',
    link: '/orders'
  },
  {
    id: 'm3',
    type: 'coupon',
    title: '优惠券到账',
    content: '您获得了一张满100减20的海底捞火锅优惠券，有效期至2026-03-31。',
    time: '2天前',
    read: true,
    icon: '🎫',
    link: '/coupons'
  },
  {
    id: 'm4',
    type: 'activity',
    title: '新人专享活动',
    content: '首单立减50元，新人专属福利等你来领！',
    time: '3天前',
    read: true,
    icon: '🎁',
    link: '/'
  },
  {
    id: 'm5',
    type: 'review',
    title: '评价提醒',
    content: '您浏览的海底捞火锅有新评论，点击查看详情。',
    time: '5天前',
    read: true,
    icon: '⭐',
    link: '/merchant/f1'
  },
]

const messageTypes = [
  { id: 'all', label: '全部', icon: '📬' },
  { id: 'system', label: '系统', icon: '🔔' },
  { id: 'order', label: '订单', icon: '📋' },
  { id: 'coupon', label: '优惠', icon: '🎫' },
]

export default function Messages() {
  const [activeTab, setActiveTab] = useState('all')
  const [messageList, setMessageList] = useState(messages)

  const filteredMessages = activeTab === 'all' 
    ? messageList 
    : messageList.filter(m => m.type === activeTab)

  const unreadCount = messageList.filter(m => !m.read).length

  const handleRead = (id) => {
    setMessageList(prev => prev.map(m => 
      m.id === id ? { ...m, read: true } : m
    ))
  }

  const handleReadAll = () => {
    setMessageList(prev => prev.map(m => ({ ...m, read: true })))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/profile" className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">消息通知</h1>
          {unreadCount > 0 && (
            <button 
              onClick={handleReadAll}
              className="px-3 py-1 text-orange-500 text-sm"
            >
              全部已读
            </button>
          )}
        </div>

        <div className="flex px-4 pb-2 gap-2 overflow-x-auto scrollbar-hide">
          {messageTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === type.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">暂无消息</p>
          </div>
        ) : (
          filteredMessages.map(message => (
            <Link
              key={message.id}
              to={message.link}
              onClick={() => handleRead(message.id)}
              className={`block bg-white rounded-xl p-4 shadow-sm ${
                !message.read ? 'border-l-4 border-orange-500' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {message.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${!message.read ? 'text-gray-800' : 'text-gray-600'}`}>
                      {message.title}
                    </h3>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{message.time}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{message.content}</p>
                </div>
                {!message.read && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </Link>
          ))
        )}
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
