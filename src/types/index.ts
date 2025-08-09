// User Types
export interface User {
  id: string;
  email?: string;
  name?: string;
  isGuest: boolean;
  subscriptionTier: 'free' | 'premium';
  generationsUsed: number;
  generationsLimit: number;
}

// Image Types
export interface ImageData {
  uri: string;
  width: number;
  height: number;
  type: 'image/jpeg' | 'image/png';
  fileName?: string;
}

export interface ProcessedImage extends ImageData {
  hasTransparentBackground: boolean;
  originalUri: string;
}

// Style Types
export type ArtStyle = 
  | 'pixel'
  | 'cartoon'
  | 'cute'
  | 'anime'
  | 'watercolor'
  | 'sketch'
  | 'pop-art'
  | 'minimalist';

export interface StyleOption {
  id: ArtStyle;
  name: string;
  description: string;
  previewImage: string;
  isPremium: boolean;
}

// Generation Types
export interface GenerationRequest {
  imageUri: string;
  style: ArtStyle;
  keepBackground: boolean;
  userId: string;
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultImageUri?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Export Types
export type ExportFormat = 'png' | 'jpg' | 'webp';
export type ExportDestination = 'photos' | 'files' | 'share' | 'clipboard' | 'email';

export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  destination: ExportDestination;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  PhotoUpload: undefined;
  StyleSelection: { imageUri?: string; keepBackground?: boolean };
  Loading: { imageUri: string; style: string; keepBackground: boolean };
  Product: { originalImageUri: string; generatedImageBase64: string; style: string };
  Generation: { imageUri: string; style: ArtStyle; keepBackground: boolean };
  Result: { generationId: string; imageUri: string };
  Settings: undefined;
};

// App State Types
export interface AppState {
  user: User | null;
  currentImage: ProcessedImage | null;
  selectedStyle: StyleOption | null;
  currentGeneration: GenerationResponse | null;
  isLoading: boolean;
  error: string | null;
} 