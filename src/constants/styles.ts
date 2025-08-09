import { StyleOption } from '../types';

export const ART_STYLES: StyleOption[] = [
  {
    id: 'pixel',
    name: 'Pixel Art',
    description: '8-bit/16-bit retro gaming style',
    previewImage: 'https://via.placeholder.com/150/FF3B30/FFFFFF?text=Pixel',
    isPremium: false,
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Classic animated cartoon style',
    previewImage: 'https://via.placeholder.com/150/AF52DE/FFFFFF?text=Cartoon',
    isPremium: false,
  },
  {
    id: 'cute',
    name: 'Cute/Kawaii',
    description: 'Adorable, chibi-style characters',
    previewImage: 'https://via.placeholder.com/150/FF9500/FFFFFF?text=Cute',
    isPremium: false,
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese anime/manga style',
    previewImage: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=Anime',
    isPremium: true,
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Artistic watercolor painting style',
    previewImage: 'https://via.placeholder.com/150/34C759/FFFFFF?text=Watercolor',
    isPremium: true,
  },
  {
    id: 'sketch',
    name: 'Sketch',
    description: 'Hand-drawn sketch style',
    previewImage: 'https://via.placeholder.com/150/8E8E93/FFFFFF?text=Sketch',
    isPremium: false,
  },
  {
    id: 'pop-art',
    name: 'Pop Art',
    description: 'Andy Warhol-inspired style',
    previewImage: 'https://via.placeholder.com/150/FF2D92/FFFFFF?text=Pop+Art',
    isPremium: true,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple geometric style',
    previewImage: 'https://via.placeholder.com/150/1C1C1E/FFFFFF?text=Minimalist',
    isPremium: false,
  },
];

export const FREE_STYLES = ART_STYLES.filter(style => !style.isPremium);
export const PREMIUM_STYLES = ART_STYLES.filter(style => style.isPremium);

export const getStyleById = (id: string): StyleOption | undefined => {
  return ART_STYLES.find(style => style.id === id);
}; 