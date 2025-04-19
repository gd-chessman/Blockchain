import React, { useState } from 'react'
import { MessageSquare, X, Send, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  time: string
}

const mockMessages: Message[] = [
  {
    id: 1,
    text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    sender: 'bot',
    time: '10:00'
  },
  {
    id: 2,
    text: 'Tôi muốn tìm hiểu về cách tạo coin mới',
    sender: 'user',
    time: '10:01'
  },
  {
    id: 3,
    text: 'Chúng tôi có thể giúp bạn tạo coin mới trên blockchain. Bạn đã có ví điện tử chưa?',
    sender: 'bot',
    time: '10:02'
  },
  {
    id: 4,
    text: 'Tôi đã có ví Solana rồi',
    sender: 'user',
    time: '10:03'
  }
]

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút bong bóng chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <MessageSquare size={24} />
      </button>

      {/* Hộp thoại chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User size={16} />
              </div>
              <h3 className="font-semibold">Hỗ trợ trực tuyến</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                <Send size={16} />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
