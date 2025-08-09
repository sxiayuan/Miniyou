// ComfyUI Service for MiniYou App
// This service handles communication with ComfyUI API

export interface ComfyUIGenerationRequest {
  imageUri: string;
  style: string;
  keepBackground: boolean;
}

export interface ComfyUIGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  jobId?: string;
}

class ComfyUIService {
  private baseUrl: string;
  private pollInterval: number = 1000; // 1 second

  constructor(baseUrl: string = 'http://localhost:8188') {
    this.baseUrl = baseUrl;
  }

  // Basic workflow template for style transfer
  private createWorkflow(imageUri: string, style: string, keepBackground: boolean) {
    // This is a basic workflow - you'll need to customize based on your needs
    return {
      "1": {
        "inputs": {
          "ckpt_name": "model.safetensors" // You'll need to download a model
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "2": {
        "inputs": {
          "text": this.getStylePrompt(style),
          "clip": ["1", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "3": {
        "inputs": {
          "text": "blurry, low quality, distorted",
          "clip": ["1", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "4": {
        "inputs": {
          "seed": Math.floor(Math.random() * 1000000),
          "steps": 20,
          "cfg": 7.0,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 0.75,
          "model": ["1", 0],
          "positive": ["2", 0],
          "negative": ["3", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "5": {
        "inputs": {
          "image": imageUri,
          "vae": ["1", 2]
        },
        "class_type": "VAEEncodeForInpaint"
      },
      "6": {
        "inputs": {
          "samples": ["4", 0],
          "vae": ["1", 2]
        },
        "class_type": "VAEDecode"
      },
      "7": {
        "inputs": {
          "filename_prefix": "miniyou_output",
          "images": ["6", 0]
        },
        "class_type": "SaveImage"
      }
    };
  }

  private getStylePrompt(style: string): string {
    const stylePrompts = {
      'pixel': 'pixel art style, 8-bit retro game graphics, pixelated, digital art',
      'cartoon': 'cartoon style, animated, vibrant colors, stylized illustration',
      'cute': 'kawaii chibi style, adorable, sweet, pastel colors, anime-inspired',
      'sketch': 'hand-drawn sketch, pencil drawing, artistic line art, black and white'
    };
    
    return stylePrompts[style as keyof typeof stylePrompts] || 'artistic style';
  }

  // Queue a prompt for generation
  async queuePrompt(imageUri: string, style: string, keepBackground: boolean): Promise<string> {
    try {
      const workflow = this.createWorkflow(imageUri, style, keepBackground);
      
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
      console.error('Error queuing prompt:', error);
      throw error;
    }
  }

  // Check the status of a generation job
  async checkStatus(promptId: string): Promise<{ status: string; images?: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${promptId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const history = await response.json();
      
      if (history[promptId]) {
        const status = history[promptId].status;
        
        if (status.status_str === 'success') {
          // Extract image URLs from the completed job
          const outputs = status.outputs;
          const images: string[] = [];
          
          for (const nodeId in outputs) {
            if (outputs[nodeId].images) {
              outputs[nodeId].images.forEach((img: any) => {
                images.push(`${this.baseUrl}/view?filename=${img.filename}&subfolder=${img.subfolder}&type=${img.type}`);
              });
            }
          }
          
          return { status: 'completed', images };
        } else if (status.status_str === 'error') {
          return { status: 'error' };
        } else {
          return { status: 'processing' };
        }
      }
      
      return { status: 'pending' };
    } catch (error) {
      console.error('Error checking status:', error);
      throw error;
    }
  }

  // Poll for completion
  async waitForCompletion(promptId: string, maxWaitTime: number = 60000): Promise<string[]> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.checkStatus(promptId);
      
      if (status.status === 'completed' && status.images) {
        return status.images;
      } else if (status.status === 'error') {
        throw new Error('Generation failed');
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, this.pollInterval));
    }
    
    throw new Error('Generation timed out');
  }

  // Main method to generate an image
  async generateImage(request: ComfyUIGenerationRequest): Promise<ComfyUIGenerationResponse> {
    try {
      console.log('Starting image generation with ComfyUI...');
      
      // Queue the prompt
      const promptId = await this.queuePrompt(
        request.imageUri, 
        request.style, 
        request.keepBackground
      );
      
      console.log('Prompt queued with ID:', promptId);
      
      // Wait for completion
      const images = await this.waitForCompletion(promptId);
      
      if (images.length > 0) {
        return {
          success: true,
          imageUrl: images[0],
          jobId: promptId
        };
      } else {
        throw new Error('No images generated');
      }
      
    } catch (error) {
      console.error('ComfyUI generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Test connection to ComfyUI
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/system_stats`);
      return response.ok;
    } catch (error) {
      console.error('ComfyUI connection test failed:', error);
      return false;
    }
  }
}

export default new ComfyUIService();