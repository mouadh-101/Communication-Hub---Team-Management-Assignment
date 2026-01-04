import React, { useEffect, useRef } from 'react';
import type { Message } from '../types/index';
import '../styles/MessageList.css';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <div className="message-list">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="message-list">No messages yet. Start the conversation!</div>;
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-header">
            <span className="sender-name">{message.sender.name}</span>
            <span className="timestamp">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
