import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Get platform-specific image picker options
 */
export const getImagePickerOptions = () => {
  return {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 0.8,
  };
};

/**
 * Get platform-specific sharing options
 */
export const getSharingOptions = (url: string, title?: string) => {
  return {
    url,
    title: title || 'MiniYouApp - My Generated Avatar',
  };
};

/**
 * Platform-specific file download
 */
export const downloadFile = async (url: string, filename: string) => {
  // For native, download using expo-file-system
  const downloadResumable = FileSystem.downloadAsync(url, FileSystem.documentDirectory + filename);
  await downloadResumable;
};

/**
 * Platform-specific image saving
 */
export const saveImageToGallery = async (uri: string) => {
  // For native, save to media library
  await MediaLibrary.saveToLibraryAsync(uri);
}; 