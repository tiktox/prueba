import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  username: string;
  createdAt: Timestamp;
  online?: boolean;
}

export interface ImagePost {
  id: string;
  imageUrl: string;
  description: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  username: string;
  createdAt: Timestamp;
  width?: number;
  height?: number;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: Timestamp;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: Timestamp;
  };
  typing?: {
    [key: string]: boolean;
  };
}