import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import uploadService from '../../../services/uploadService';
import { useToast } from '../../../context/ToastContext';

export const ImageUpload = ({ images = [], onChange, maxImages = 5 }) => {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = async (files) => {
    if (images.length + files.length > maxImages) {
      addToast(`You can upload a maximum of ${maxImages} images.`, 'error');
      return;
    }

    const validatedFiles = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        addToast(`Invalid file type for ${file.name}. Only JPG, PNG, and WEBP are supported.`, 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast(`File ${file.name} is too large. Max size is 5MB.`, 'error');
        return;
      }
      validatedFiles.push(file);
    }

    if (validatedFiles.length === 0) return;

    try {
      setUploading(true);
      const res = await uploadService.uploadImages(validatedFiles);
      if (res.success && res.data) {
        const newImages = [...images, ...res.data];
        onChange(newImages);
        addToast('Images uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err?.response?.data?.error?.message || err?.message || 'Failed to upload images', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border/80 bg-surface/50 hover:bg-surface hover:border-primary/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="space-y-2 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-text/60 font-semibold">Uploading images...</p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white font-extrabold">
                  Drag & Drop or <span className="text-primary hover:underline">Browse files</span>
                </p>
                <p className="text-[10px] text-gray-500 font-semibold mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB each, up to {maxImages} images)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-surface shrink-0"
            >
              <img 
                src={img.url} 
                alt={img.filename || `Preview ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-gray-300 max-w-[85%] truncate">
                {img.filename || `Image ${idx + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
