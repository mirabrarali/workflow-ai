'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { ChatInterface } from '@/components/ChatInterface';

export default function Home() {
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${showChat ? 'lg:mr-96' : ''} transition-all`}>
        <Dashboard showChat={showChat} />
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="hidden lg:block w-96 border-l border-gray-200 bg-white h-screen">
          <ChatInterface
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      {/* Floating Chat Toggle for Mobile */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-40"
          title="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
}
