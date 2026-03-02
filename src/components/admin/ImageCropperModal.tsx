"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { X, Check } from "lucide-react";

interface ImageCropperModalProps {
  imageSrc: string;
  aspect: number;
  onCropCancel: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function ImageCropperModal({
  imageSrc,
  aspect,
  onCropCancel,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showResult = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء اقتصاص الصورة");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-orange">
            crop
          </span>
          قص الصورة لتناسب المكان
        </h3>
        <button
          onClick={onCropCancel}
          className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cropper Container */}
      <div className="relative w-full max-w-2xl h-[50vh] sm:h-[60vh] bg-black rounded-3xl overflow-hidden border border-white/20">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          cropShape="rect"
          showGrid={true}
        />
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl mt-6 space-y-4">
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <span className="text-white/70 text-sm">تكبير:</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-brand-orange h-1.5 bg-white/20 rounded-full appearance-none outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCropCancel}
            className="px-6 py-3 rounded-xl font-bold text-white/70 bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            إلغاء
          </button>
          <button
            onClick={showResult}
            disabled={isProcessing}
            className="px-6 py-3 rounded-xl font-bold text-white bg-brand-orange hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            ) : (
              <Check className="w-4 h-4" />
            )}
            تأكيد القص
          </button>
        </div>
      </div>
    </div>
  );
}
