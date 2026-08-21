"use client";

import { useRef, useState } from "react";

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageError, setImageError] = useState("");

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      setImageError("Please select a PNG, JPG, or JPEG image.");
      setSelectedImage(null);
      setImageName("");
      return;
    }

    setImageError("");
    setImageName(file.name);

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageName("");
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mt-12">
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-12 transition hover:border-blue-400">
        {!selectedImage ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              👁️
            </div>

            <h3 className="mt-6 text-xl font-semibold text-slate-900">
              Upload retinal image
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              PNG, JPG or JPEG
            </p>

            <button
              type="button"
              onClick={handleChooseImage}
              className="mt-7 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Choose Image
            </button>
          </>
        ) : (
          <div>
            <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-lg">
              <img
                src={selectedImage}
                alt="Selected retinal image"
                className="max-h-80 w-full object-contain"
              />
            </div>

            <p className="mt-5 font-medium text-slate-900">
              {imageName}
            </p>

            <p className="mt-2 text-sm text-green-600">
              Image selected successfully
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleChooseImage}
                className="rounded-lg border border-blue-300 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Change Image
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-900"
              >
                Remove
              </button>
            </div>

            <button
              type="button"
              className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Analyze Image
            </button>
          </div>
        )}

        {imageError && (
          <p className="mt-5 text-sm font-medium text-red-500">
            {imageError}
          </p>
        )}
      </div>
    </div>
  );
}