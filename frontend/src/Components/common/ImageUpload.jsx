import React, { useState } from 'react';
import apiClient from '../../config/api';

const ImageUpload = ({ onImageUpload, multiple = false, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (multiple && files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => formData.append('images', file));
        const response = await apiClient.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const newPreviews = response.data.data.map(img => ({
          url: img.url,
          public_id: img.public_id
        }));
        setPreview([...preview, ...newPreviews]);
        onImageUpload(response.data.data);
      } else {
        formData.append('image', files[0]);
        const response = await apiClient.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const newPreview = {
          url: response.data.data.url,
          public_id: response.data.data.public_id
        };
        setPreview([newPreview]);
        onImageUpload(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleBase64Upload = async (base64String) => {
    setUploading(true);
    setError('');

    try {
      const response = await apiClient.post('/upload/base64', {
        image: base64String,
        folder: 'chefkart'
      });

      const newPreview = {
        url: response.data.data.url,
        public_id: response.data.data.public_id
      };
      setPreview([...preview, newPreview]);
      onImageUpload(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = preview[index];
    
    try {
      await apiClient.delete('/upload/delete', {
        data: { public_id: imageToRemove.public_id }
      });
      
      const newPreview = preview.filter((_, i) => i !== index);
      setPreview(newPreview);
    } catch (err) {
      setError('Failed to remove image');
    }
  };

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={handleFileSelect}
          multiple={multiple}
          accept="image/*"
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {uploading ? 'Uploading...' : `Choose ${multiple ? 'Images' : 'Image'}`}
        </label>
        
        {multiple && (
          <p className="text-sm text-gray-500 mt-2">
            Up to {maxFiles} files, max 5MB each
          </p>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Preview:</h4>
          <div className={`grid ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4`}>
            {preview.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
