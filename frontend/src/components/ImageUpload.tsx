import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (base64Image: string) => void;
  maxSizeMB?: number;
}

export function ImageUpload({ currentImage, onImageChange, maxSizeMB = 2 }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsLoading(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      setIsLoading(false);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
      setIsLoading(false);
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageChange(base64String);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Error al leer la imagen');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error al procesar la imagen');
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview Area */}
      <div className="relative">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Avatar preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-600 shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
              title="Eliminar imagen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-dashed border-gray-400 flex items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {preview ? 'Cambiar Foto' : 'Subir Foto'}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center">
        JPG, PNG o GIF. Máximo {maxSizeMB}MB
      </p>
    </div>
  );
}
