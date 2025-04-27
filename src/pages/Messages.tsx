import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  collection, query, where, orderBy, onSnapshot, 
  addDoc, serverTimestamp, getDoc, doc, updateDoc, setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Message, User, Chat } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Send, Search, ArrowLeft } from 'lucide-react';

const Messages: React.FC = () => {
  const [currentUser] = useAuthState(auth);
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Load chats for the current user
  useEffect(() => {
    if (!currentUser) return;
    
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat));
      
      // Sort by last message timestamp (if available)
      chatsData.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return b.lastMessage.createdAt.toMillis() - a.lastMessage.createdAt.toMillis();
      });
      
      setChats(chatsData);
      
      // If chatId is provided, select that chat
      if (chatId) {
        const selectedChat = chatsData.find(chat => chat.id === chatId);
        if (selectedChat) {
          setSelectedChat(selectedChat);
          loadChatPartner(selectedChat);
        }
      }
    });
    
    return unsubscribe;
  }, [currentUser, chatId]);
  
  // Load users for search
  useEffect(() => {
    if (!currentUser) return;
    
    const usersQuery = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs
        .map(doc => ({
          ...doc.data()
        } as User))
        .filter(user => user.uid !== currentUser.uid);
      
      setUsers(usersData);
    });
    
    return unsubscribe;
  }, [currentUser]);
  
  // Load messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;
    
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', selectedChat.id),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      setMessages(messagesData);
      
      // Mark messages as read
      snapshot.docs.forEach(doc => {
        const messageData = doc.data();
        if (messageData.receiverId === currentUser?.uid && !messageData.read) {
          updateDoc(doc.ref, { read: true });
        }
      });
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    
    return unsubscribe;
  }, [selectedChat, currentUser]);
  
  // Check if chat partner is typing
  useEffect(() => {
    if (!selectedChat || !chatPartner) return;
    
    const unsubscribe = onSnapshot(doc(db, 'chats', selectedChat.id), (doc) => {
      const chatData = doc.data() as Chat;
      if (chatData?.typing && chatData.typing[chatPartner.uid]) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });
    
    return unsubscribe;
  }, [selectedChat, chatPartner]);
  
  const loadChatPartner = async (chat: Chat) => {
    if (!currentUser) return;
    
    const partnerId = chat.participants.find(id => id !== currentUser.uid);
    
    if (partnerId) {
      const userDoc = await getDoc(doc(db, 'users', partnerId));
      if (userDoc.exists()) {
        setChatPartner(userDoc.data() as User);
      }
    }
  };
  
  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    navigate(`/messages/${chat.id}`);
    loadChatPartner(chat);
  };
  
  const startChat = async (user: User) => {
    if (!currentUser) return;
    
    // Check if chat already exists
    const existingChat = chats.find(chat => 
      chat.participants.includes(currentUser.uid) && 
      chat.participants.includes(user.uid)
    );
    
    if (existingChat) {
      selectChat(existingChat);
      setSearchTerm('');
      return;
    }
    
    // Create new chat
    const chatRef = await addDoc(collection(db, 'chats'), {
      participants: [currentUser.uid, user.uid],
      createdAt: serverTimestamp()
    });
    
    navigate(`/messages/${chatRef.id}`);
    setSearchTerm('');
  };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentUser || !selectedChat || !chatPartner) return;
    
    // Add message to Firestore
    await addDoc(collection(db, 'messages'), {
      chatId: selectedChat.id,
      text: message.trim(),
      senderId: currentUser.uid,
      receiverId: chatPartner.uid,
      createdAt: serverTimestamp(),
      read: false
    });
    
    // Update last message in chat
    await updateDoc(doc(db, 'chats', selectedChat.id), {
      lastMessage: {
        text: message.trim(),
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      },
      // Clear typing indicator
      [`typing.${currentUser.uid}`]: false
    });
    
    // Clear message input
    setMessage('');
  };
  
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!currentUser || !selectedChat) return;
    
    // Set typing indicator
    updateDoc(doc(db, 'chats', selectedChat.id), {
      [`typing.${currentUser.uid}`]: true
    });
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to clear typing indicator
    const timeout = setTimeout(() => {
      if (currentUser && selectedChat) {
        updateDoc(doc(db, 'chats', selectedChat.id), {
          [`typing.${currentUser.uid}`]: false
        });
      }
    }, 2000);
    
    setTypingTimeout(timeout);
  };
  
  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const isMobile = window.innerWidth < 768;
  const showSidebar = !isMobile || (isMobile && !selectedChat);
  const showMessages = !isMobile || (isMobile && selectedChat);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
        <div className="flex h-full">
          {/* Chat Sidebar */}
          {showSidebar && (
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Messages</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {searchTerm ? (
                  filteredUsers.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <div
                          key={user.uid}
                          onClick={() => startChat(user)}
                          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={user.photoURL || 'https://via.placeholder.com/50'}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No users found
                    </div>
                  )
                ) : (
                  <div className="divide-y divide-gray-200">
                    {chats.map(chat => {
                      const partnerId = chat.participants.find(id => id !== currentUser?.uid);
                      const partner = users.find(user => user.uid === partnerId);
                      
                      return (
                        <div
                          key={chat.id}
                          onClick={() => selectChat(chat)}
                          className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                          }`}
                        >
                          <img
                            src={partner?.photoURL || 'https://via.placeholder.com/50'}
                            alt={partner?.displayName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{partner?.displayName}</div>
                            {chat.lastMessage && (
                              <div className="text-sm text-gray-500 truncate">
                                {chat.lastMessage.senderId === currentUser?.uid ? 'You: ' : ''}
                                {chat.lastMessage.text}
                              </div>
                            )}
                          </div>
                          {chat.lastMessage && (
                            <div className="text-xs text-gray-400">
                              {formatDistanceToNow(chat.lastMessage.createdAt.toDate(), { addSuffix: false })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Messages Area */}
          {showMessages && (
            <div className="w-full md:w-2/3 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center">
                    {isMobile && (
                      <button
                        onClick={() => navigate('/messages')}
                        className="mr-2 p-1 rounded-full hover:bg-gray-100"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <img
                      src={chatPartner?.photoURL || 'https://via.placeholder.com/40'}
                      alt={chatPartner?.displayName}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{chatPartner?.displayName}</div>
                      <div className="text-xs text-gray-500">
                        {chatPartner?.online ? (
                          <span className="text-success">Online</span>
                        ) : (
                          'Offline'
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div
                    ref={messageContainerRef}
                    className="flex-1 p-4 overflow-y-auto scrollbar-hide"
                  >
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map(message => {
                          const isOwn = message.senderId === currentUser?.uid;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                                  isOwn
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}
                              >
                                <div>{message.text}</div>
                                <div
                                  className={`text-right text-xs mt-1 ${
                                    isOwn ? 'text-blue-100' : 'text-gray-500'
                                  }`}
                                >
                                  {message.createdAt && (
                                    formatDistanceToNow(message.createdAt.toDate(), {
                                      addSuffix: true
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                              <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Start a conversation</h3>
                        <p className="text-gray-500 max-w-xs">
                          Send a message to {chatPartner?.displayName}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className="bg-primary hover:bg-primary-dark text-white p-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                  <p className="text-gray-500 max-w-xs mb-6">
                    Send private messages to friends and share moments
                  </p>
                  <p className="text-gray-400 text-sm">
                    Select a chat or search for someone to message
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;