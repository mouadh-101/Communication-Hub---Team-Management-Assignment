import React, { useState } from 'react';
import '../styles/MessageInput.css';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await onSend(content.trim());
      setContent('');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={disabled ? 'Select a team to send messages' : 'Type a message...'}
        disabled={disabled || sending}
        className="message-input"
      />
      <button type="submit" disabled={disabled || sending || !content.trim()} className="send-button">
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;
