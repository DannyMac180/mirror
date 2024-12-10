// app/my-mirror/page.tsx
'use client'

import React, { useState } from 'react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export default function MyMirrorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')

  // Simulate sending a message and receiving a response
  // In production, replace with actual API calls
  const sendMessage = async () => {
    if (!inputValue.trim()) return
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim()
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Mock assistant response
    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `You said: ${userMessage.content}`
    }
    setTimeout(() => setMessages((prev) => [...prev, assistantMessage]), 700)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <div className="text-xl font-semibold">Claude</div>
        <div className="text-sm text-gray-400">
          Using limited free plan <button className="text-blue-400 hover:underline">Upgrade</button>
        </div>
      </div>

      {/* Greeting & Prompt */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Good evening, Dan</h1>
        <p className="text-gray-300 mb-4">How can Claude help you today?</p>

        {/* Style chooser (mock) */}
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-sm text-gray-300">Claude Haiku</span>
          <span className="text-sm text-gray-300">|</span>
          <span className="text-sm text-gray-300 cursor-pointer hover:text-gray-200">Choose style</span>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="bg-gray-800 text-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-700 transition">
            Write a memo
          </button>
          <button className="bg-gray-800 text-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-700 transition">
            Summarize meeting notes
          </button>
          <button className="bg-gray-800 text-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-700 transition">
            Generate excel formulas
          </button>
        </div>

        {/* Chat Area */}
        <div className="border border-gray-800 rounded p-4 h-96 overflow-y-auto flex flex-col space-y-4 mb-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`max-w-md ${msg.role === 'user' ? 'self-end text-right' : 'self-start text-left'}`}>
              <div className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm">No messages yet. Ask a question above.</p>
          )}
        </div>

        {/* Recent Chats (mock) */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Your recent chats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-3 rounded hover:bg-gray-700 transition cursor-pointer text-sm text-gray-200">
              Designing an Ethical AI
            </div>
            <div className="bg-gray-800 p-3 rounded hover:bg-gray-700 transition cursor-pointer text-sm text-gray-200">
              Discovering a Hidden
            </div>
            <div className="bg-gray-800 p-3 rounded hover:bg-gray-700 transition cursor-pointer text-sm text-gray-200">
              Effective AI-Powered
            </div>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="mt-auto border-t border-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 text-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}