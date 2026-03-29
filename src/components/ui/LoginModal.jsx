import { useState, useEffect } from 'react'
import Modal from './Modal'
import { useUser } from '../../contexts/UserContext'

export default function LoginModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login: doLogin, register: doRegister, user } = useUser()
  const [mode, setMode] = useState(initialMode)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMode(initialMode)
    setError('')
  }, [initialMode, isOpen])

  useEffect(() => {
    if (isOpen && user) {
      onClose()
    }
  }, [isOpen, user, onClose])

  const handleSendCode = () => {
    if (phone.length === 11) {
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (phone.length !== 11) {
      setError('请输入正确的手机号')
      return
    }
    
    if (code.length < 4) {
      setError('请输入验证码或密码')
      return
    }

    setLoading(true)
    setTimeout(() => {
      try {
        if (mode === 'login') {
          doLogin(phone, code)
        } else {
          doRegister(phone, code)
        }
        onClose()
      } catch (err) {
        setError('操作失败，请重试')
      } finally {
        setLoading(false)
      }
    }, 800)
  }

  const isDefaultUser = phone === '13636524634' && code === '000000'

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">点评</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'login' ? '登录后享受更多服务' : '注册新账号'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? '登录后可以收藏商家、查看订单' : '注册后可享受新用户专属优惠'}
          </p>
          {isDefaultUser && (
            <p className="text-green-600 text-xs mt-2 bg-green-50 py-1 px-2 rounded inline-block">
              ✓ 测试账号自动识别
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">验证码 / 密码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="验证码或密码(测试: 000000)"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || phone.length !== 11}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-orange-500 disabled:text-gray-400 disabled:border-gray-200 hover:border-orange-500 transition-colors whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 11 || code.length < 4}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">
            {mode === 'login' ? '还没有账号?' : '已有账号?'}
          </span>
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-orange-500 text-sm hover:underline ml-1"
          >
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
