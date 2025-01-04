import React from 'react';
import { useChat } from '../hooks/useChat';

export const Header = () => {
  const { messages } = useChat();

  return (
    <header className="w-1/2 ml-auto p-2 bg-transparent-100" style={{ height: '5vh' }}>
      <div className="space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg shadow-md ${
                msg.type === 'translate' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <p className="text-s text-gray-800">{msg.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-s"></p>
        )}
      </div>
    </header>
  );
};
