import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { ImageData, ProcessedImage } from '../types';
import { getImagePickerOptions, saveImageToGallery } from '../utils/platformUtils';

export class ImageService {
  private static instance: ImageService;
  
  private constructor() {}
  
  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  /**
   * Request camera and photo library permissions
   */
  async requestPermissions(): Promise<boolean> {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.granted && libraryPermission.granted;
  }

  /**
   * Pick an image from the photo library
   */
  async pickImageFromLibrary(): Promise<ImageData | null> {
    try {
      const options = getImagePickerOptions();
      
      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Ensure we only process image types
        if (asset.type !== 'image') {
          throw new Error('Selected file is not an image');
        }
        
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: 'image/jpeg', // Default to JPEG for consistency
          fileName: asset.fileName || undefined,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw new Error('Failed to pick image from library');
    }
  }

  /**
   * Take a photo using the camera
   */
  async takePhoto(): Promise<ImageData | null> {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Ensure we only process image types
        if (asset.type !== 'image') {
          throw new Error('Selected file is not an image');
        }
        
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: 'image/jpeg', // Default to JPEG for consistency
          fileName: asset.fileName || undefined,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw new Error('Failed to take photo');
    }
  }

  /**
   * Process and optimize image for AI generation
   */
  async processImage(imageData: ImageData): Promise<ProcessedImage> {
    try {
      // Resize and compress image
      const processedImage = await ImageManipulator.manipulateAsync(
        imageData.uri,
        [
          { resize: { width: 512, height: 512 } }
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return {
        ...imageData,
        uri: processedImage.uri,
        width: processedImage.width,
        height: processedImage.height,
        hasTransparentBackground: false,
        originalUri: imageData.uri,
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Remove background from image (placeholder for now)
   * In production, this would use a background removal API
   */
  async removeBackground(imageUri: string): Promise<string> {
    try {
      // For now, return the original image
      // In production, integrate with a background removal service
      // like Remove.bg API or similar
      return imageUri;
    } catch (error) {
      console.error('Error removing background:', error);
      throw new Error('Failed to remove background');
    }
  }

  /**
   * Save image to device/gallery
   */
  async saveImageToDevice(imageUri: string, fileName?: string): Promise<string> {
    try {
      // For native, save to device
      const timestamp = Date.now();
      const name = fileName || `miniyouapp-${timestamp}.jpg`;
      
      const destination = `${FileSystem.documentDirectory}${name}`;
      
      await FileSystem.copyAsync({
        from: imageUri,
        to: destination,
      });

      return destination;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save image to device');
    }
  }



  /**
   * Get image info
   */
  async getImageInfo(uri: string): Promise<{ width: number; height: number; size: number }> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      
      if (!info.exists) {
        throw new Error('Image file does not exist');
      }

      // Get image dimensions using ImageManipulator
      const manipResult = await ImageManipulator.manipulateAsync(uri, [], {
        format: ImageManipulator.SaveFormat.JPEG,
      });

      const size = info.size || 0;
      
      return {
        width: manipResult.width,
        height: manipResult.height,
        size,
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      throw new Error('Failed to get image info');
    }
  }

  /**
   * Validate image file
   */
  validateImage(imageData: ImageData): boolean {
    const minDimensions = 100; // Minimum 100x100 pixels
    
    if (imageData.width < minDimensions || imageData.height < minDimensions) {
      throw new Error('Image too small. Please select an image at least 100x100 pixels.');
    }
    
    return true;
  }
}

export default ImageService.getInstance(); 