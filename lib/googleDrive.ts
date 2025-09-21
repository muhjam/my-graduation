'use client';

export interface DriveFile {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink?: string;
}

export class GoogleDriveService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async uploadFile(file: File, caption: string): Promise<DriveFile | null> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `${Date.now()}_${file.name}`);
      formData.append('description', caption);

      // Upload to Google Drive
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Make file public
      await this.makeFilePublic(result.id);

      return {
        id: result.id,
        name: result.name,
        webViewLink: `https://drive.google.com/file/d/${result.id}/view`,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${result.id}&sz=w400`
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      return null;
    }
  }

  private async makeFilePublic(fileId: string): Promise<void> {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });
    } catch (error) {
      console.error('Error making file public:', error);
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    return `https://drive.google.com/uc?id=${fileId}`;
  }
}

export const createDriveService = (accessToken: string) => new GoogleDriveService(accessToken);
