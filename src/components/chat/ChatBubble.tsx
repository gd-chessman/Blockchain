import { Card } from '@/ui/card'
import React, { useState } from 'react'

export default function ChatBubble({className}: {className?: string}) {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className={`w-full  ${className}`}>
      {!showChat ? (
        <button
          onClick={() => setShowChat(true)}
          className="w-full bg-[#d8e8f7] hover:bg-[#c8d8e7] text-black font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Chat with us
        </button>
      ) : (
        <Card className="rounded-lg shadow-lg p-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chat Box</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="h-[31.25rem] overflow-y-auto mb-4 border rounded-lg p-2">
            {/* Chat messages will go here */}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button className="bg-[#d8e8f7] text-black px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
