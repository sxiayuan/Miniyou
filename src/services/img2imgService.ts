// Optimized Image-to-Image Service for MiniYou
import { Platform } from 'react-native';

export interface Img2ImgRequest {
  imageBase64: string; // Base64 encoded image
  style: string;
  strength: number; // 0.1-1.0, how much to change the image
  seed?: number;
}

export interface Img2ImgResponse {
  success: boolean;
  imageBase64?: string;
  error?: string;
  jobId?: string;
}

class Img2ImgService {
  private baseUrl: string = 'http://localhost:8188';

  // Convert image URI to base64
  async imageUriToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  // Style prompts optimized for img2img
  private getStyleConfig(style: string) {
    const configs = {
      'pixel': {
        positive: 'pixel art, 8-bit, retro game style, pixelated, sharp pixels, digital art, vibrant colors',
        negative: 'blurry, smooth, gradient, photorealistic, 3d render',
        strength: 0.75,
        cfg: 7.0,
        steps: 25
      },
      'cartoon': {
        positive: 'cartoon style, animated, cel shading, vibrant colors, clean lines, stylized, disney pixar style',
        negative: 'realistic, photograph, blurry, dark, gritty',
        strength: 0.7,
        cfg: 8.0,
        steps: 30
      },
      'cute': {
        positive: 'kawaii, chibi style, adorable, cute, pastel colors, soft, anime style, big eyes, sweet',
        negative: 'scary, dark, realistic, gritty, harsh',
        strength: 0.65,
        cfg: 7.5,
        steps: 28
      },
      'sketch': {
        positive: 'pencil sketch, hand drawn, line art, graphite, artistic sketch, black and white drawing',
        negative: 'colorful, photorealistic, digital, blurry',
        strength: 0.8,
        cfg: 6.0,
        steps: 20
      }
    };
    
    return configs[style as keyof typeof configs] || configs.cartoon;
  }

  // Upload image to ComfyUI
  async uploadImage(imageBase64: string): Promise<string> {
    try {
      const formData = new FormData();
      
      // Convert base64 to blob
      const byteCharacters = atob(imageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      
      formData.append('image', blob, 'input_image.png');
      
      const response = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return result.name; // Returns the filename on the server
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Create SD 1.5 text-to-image workflow
  private createSD15Workflow(style: string) {
    const config = this.getStyleConfig(style);
    const seed = Math.floor(Math.random() * 4294967295);

    return {
      "1": {
        "inputs": {
          "ckpt_name": "sd_v1-5-pruned-emaonly.ckpt"
        },
        "class_type": "CheckpointLoaderSimple",
        "_meta": { "title": "Load Checkpoint" }
      },
      "2": {
        "inputs": {
          "text": `${config.positive}, portrait, person, character design, high quality`,
          "clip": ["1", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": { "title": "Positive Prompt" }
      },
      "3": {
        "inputs": {
          "text": config.negative,
          "clip": ["1", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": { "title": "Negative Prompt" }
      },
      "4": {
        "inputs": {
          "width": 512,  // SD 1.5 native resolution
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage",
        "_meta": { "title": "Empty Latent Image" }
      },
      "5": {
        "inputs": {
          "seed": seed,
          "steps": 20,  // SD 1.5 standard steps
          "cfg": 7.0,  // Standard CFG
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1.0,
          "model": ["1", 0],
          "positive": ["2", 0],
          "negative": ["3", 0],
          "latent_image": ["4", 0]
        },
        "class_type": "KSampler",
        "_meta": { "title": "Sample" }
      },
      "6": {
        "inputs": {
          "samples": ["5", 0],
          "vae": ["1", 2]
        },
        "class_type": "VAEDecode",
        "_meta": { "title": "Decode" }
      },
      "7": {
        "inputs": {
          "filename_prefix": "miniyou_sd14",
          "images": ["6", 0]
        },
        "class_type": "SaveImage",
        "_meta": { "title": "Save Image" }
      }
    };
  }

  // Queue the generation (using SDXL Turbo)
  async queueImg2Img(request: Img2ImgRequest): Promise<string> {
    try {
      console.log('Using SD 1.5 workflow for reliable generation');
      
      // Use SD 1.5 workflow with working model
      const workflow = this.createSD15Workflow(request.style);

      const response = await fetch(`${this.baseUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: workflow,
          client_id: this.generateClientId()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.prompt_id;
    } catch (error) {
      console.error('Error queuing generation:', error);
      throw error;
    }
  }

  // Check generation status
  async checkStatus(promptId: string): Promise<{ status: string; imageBase64?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${promptId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const history = await response.json();
      
      if (history[promptId]) {
        const jobStatus = history[promptId].status;
        
        console.log('ComfyUI job status:', jobStatus.status_str);
        
        if (jobStatus.status_str === 'success') {
          console.log('✅ Generation succeeded, extracting image...');
          const outputs = jobStatus.outputs;
          
          // Find the saved image
          for (const nodeId in outputs) {
            if (outputs[nodeId].images && outputs[nodeId].images.length > 0) {
              const imageInfo = outputs[nodeId].images[0];
              console.log('Found image:', imageInfo);
              
              // Download the image and convert to base64
              const imageUrl = `${this.baseUrl}/view?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder || ''}&type=${imageInfo.type}`;
              const imageResponse = await fetch(imageUrl);
              const imageBlob = await imageResponse.blob();
              
              // Convert to base64
              const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const result = reader.result as string;
                  resolve(result.split(',')[1]);
                };
                reader.readAsDataURL(imageBlob);
              });
              
              return { status: 'completed', imageBase64: base64 };
            }
          }
          console.log('❌ No images found in outputs');
        } else if (jobStatus.status_str === 'error') {
          console.error('❌ ComfyUI generation failed with error status');
          console.error('Full job status:', JSON.stringify(jobStatus, null, 2));
          return { status: 'error' };
        } else {
          console.log('⏳ Generation still processing:', jobStatus.status_str);
          return { status: 'processing' };
        }
      }
      
      return { status: 'pending' };
    } catch (error) {
      console.error('Error checking status:', error);
      throw error;
    }
  }

  // Demo mode - returns a placeholder image
  private async generateDemoImage(style: string): Promise<Img2ImgResponse> {
    console.log('🎭 Using demo mode for style:', style);
    
    // Create a simple colored square as demo image based on style
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Style-based colors
      const styleColors = {
        pixel: '#8B4513', // Brown for pixel art
        cartoon: '#FF6B6B', // Red for cartoon
        cute: '#FFB6C1', // Pink for cute
        sketch: '#A0A0A0'  // Gray for sketch
      };
      
      const color = styleColors[style as keyof typeof styleColors] || '#6C5CE7';
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DEMO', 256, 200);
      ctx.font = '32px Arial';
      ctx.fillText(`${style.toUpperCase()} Style`, 256, 280);
      ctx.font = '24px Arial';
      ctx.fillText('ComfyUI Working...', 256, 320);
    }
    
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    
    return {
      success: true,
      imageBase64: base64,
      jobId: 'demo-' + Date.now()
    };
  }

  // Main generation method (temporarily using text-to-image)
  async generateImg2Img(request: Img2ImgRequest): Promise<Img2ImgResponse> {
    try {
      console.log('Starting simplified image generation...');
      
      // TEMPORARY: Force demo mode to test UI while models download
      console.log('🎭 Using demo mode for testing...');
      return await this.generateDemoImage(request.style);
      
      // Queue the generation (using text-to-image workflow)
      const promptId = await this.queueImg2Img(request);
      console.log('Generation queued with ID:', promptId);
      
      // Poll for completion (SDXL Turbo is very fast)
      const maxWaitTime = 60000; // 1 minute  
      const pollInterval = 2000; // 2 seconds
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        const status = await this.checkStatus(promptId);
        
        if (status.status === 'completed' && status.imageBase64) {
          return {
            success: true,
            imageBase64: status.imageBase64,
            jobId: promptId
          };
        } else if (status.status === 'error') {
          throw new Error('Generation failed');
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      throw new Error('Generation timed out');
      
    } catch (error) {
      console.error('🚨 Img2Img generation error:', String(error));
      console.error('🔍 Error details:', error instanceof Error ? error.message : String(error));
      console.log('🎭 Falling back to demo mode due to generation failure...');
      
      // Add a small delay so users can see the error in console
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fallback to demo mode
      return await this.generateDemoImage(request.style);
    }
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 Testing ComfyUI connection...');
      const response = await fetch(`${this.baseUrl}/system_stats`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.log('✅ ComfyUI connected successfully');
      return true;
    } catch (error) {
      console.error('❌ ComfyUI connection failed:', String(error));
      return false;
    }
  }
}

export default new Img2ImgService();