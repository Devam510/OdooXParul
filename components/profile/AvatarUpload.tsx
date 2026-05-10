"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function AvatarUpload({ currentAvatar, onUpload }: { currentAvatar?: string | null, onUpload: (base64: string) => void }) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be less than 5MB");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      onUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    onUpload(""); // Empty string means clear avatar
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group">
        {preview ? (
          <>
            <Image src={preview} alt="Avatar" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <UserPlaceholder />
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
        />
      </div>
      
      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-1">Profile Photo</h4>
        <p className="text-xs text-gray-500 mb-3">Max size 5MB. Formats: JPG, PNG, WEBP.</p>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Upload className="h-3 w-3 mr-1.5" />
            Upload New
          </button>
          {preview && (
            <button 
              type="button" 
              onClick={handleClear}
              className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 flex items-center"
            >
              <X className="h-3 w-3 mr-1.5" />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UserPlaceholder() {
  return (
    <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
