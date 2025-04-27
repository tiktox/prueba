import { formatDistanceToNow } from 'date-fns';

/**
 * Generate a username based on the user's display name
 * @param displayName User's display name
 * @returns Generated username
 */
export const generateUsername = (displayName: string): string => {
  // Remove special characters and spaces
  let username = displayName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
  
  // Add a random number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  username = `${username}${randomNum}`;
  
  return username;
};

/**
 * Format a timestamp to a relative time string
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Truncate a string to a specified length
 * @param str String to truncate
 * @param maxLength Maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Get image dimensions from a URL
 * @param url Image URL
 * @returns Promise with image dimensions
 */
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Create a chat ID from two user IDs
 * @param uid1 First user ID
 * @param uid2 Second user ID
 * @returns Sorted and combined chat ID
 */
export const createChatId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join('_');
};