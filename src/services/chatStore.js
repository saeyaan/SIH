// src/services/chatStore.js

const CHAT_STORAGE_KEY = 'bhashasetu_chat_messages';

export const getMessages = () => {
  const data = localStorage.getItem(CHAT_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addMessage = (message) => {
  const messages = getMessages();
  const newMessage = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...message
  };
  messages.push(newMessage);
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  // Dispatch a custom event for the same window to update
  window.dispatchEvent(new Event('chat_updated'));
  return newMessage;
};

export const clearMessages = () => {
  localStorage.removeItem(CHAT_STORAGE_KEY);
  window.dispatchEvent(new Event('chat_updated'));
};

// Listeners helper for components
export const subscribeToChat = (callback) => {
  const handleUpdate = () => callback(getMessages());
  window.addEventListener('storage', handleUpdate);
  window.addEventListener('chat_updated', handleUpdate);
  
  return () => {
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener('chat_updated', handleUpdate);
  };
};
