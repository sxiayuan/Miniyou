export const COLORS = {
  // Primary Colors
  PRIMARY_RED: '#FF3B30',
  PRIMARY_PURPLE: '#AF52DE',
  
  // Secondary Colors
  LIGHT_PURPLE: '#E8D5F2',
  DARK_PURPLE: '#8A2BE2',
  LIGHT_RED: '#FFE5E5',
  DARK_RED: '#CC0000',
  
  // Neutral Colors
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F2F2F7',
  GRAY: '#8E8E93',
  DARK_GRAY: '#1C1C1E',
  BLACK: '#000000',
  
  // Background Colors
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#F2F2F7',
  
  // Text Colors
  PRIMARY_TEXT: '#1C1C1E',
  SECONDARY_TEXT: '#8E8E93',
  PLACEHOLDER_TEXT: '#C7C7CC',
  
  // Status Colors
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  INFO: '#007AFF',
} as const;

export type ColorKey = keyof typeof COLORS; 