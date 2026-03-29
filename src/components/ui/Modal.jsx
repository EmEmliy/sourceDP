import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-start p-4 pt-[10vh]"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 animate-fadeIn" />
      
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} animate-scaleIn max-h-[80vh] overflow-hidden flex flex-col mx-auto`}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b">
            {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
            {showClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = '确认', cancelText = '取消', type = 'default' }) {
  const buttonColors = {
    default: 'bg-orange-500 hover:bg-orange-600',
    danger: 'bg-red-500 hover:bg-red-600',
    success: 'bg-green-500 hover:bg-green-600',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-4">
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2 rounded-full text-white ${buttonColors[type]} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
