import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const STORAGE_KEY = 'dianping_user'
const DEFAULT_USER = {
  id: 10000,
  phone: '13636524634',
  password: '000000',
  nickname: '超级管理员',
  avatar: null,
  favorites: [],
  footprints: [],
  createdAt: '2024-01-01T00:00:00.000Z'
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = (phone, code) => {
    if (phone === DEFAULT_USER.phone && code === DEFAULT_USER.password) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER))
      setUser(DEFAULT_USER)
      return DEFAULT_USER
    }
    
    const userData = {
      id: Date.now(),
      phone: phone,
      nickname: '用户' + phone.slice(-4),
      avatar: null,
      favorites: [],
      footprints: [],
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = (phone, code) => {
    return login(phone, code)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const addFavorite = (merchantId) => {
    if (!user) return
    const updated = {
      ...user,
      favorites: [...new Set([...user.favorites, merchantId])]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  const removeFavorite = (merchantId) => {
    if (!user) return
    const updated = {
      ...user,
      favorites: user.favorites.filter(id => id !== merchantId)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  const addFootprint = (merchantId) => {
    if (!user) return
    const footprints = [merchantId, ...user.footprints.filter(id => id !== merchantId)].slice(0, 50)
    const updated = { ...user, footprints }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      addFavorite,
      removeFavorite,
      addFootprint,
      isFavorite: (merchantId) => user?.favorites?.includes(merchantId) || false
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

export default UserContext
