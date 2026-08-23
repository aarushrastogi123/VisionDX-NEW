"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
type PredictionResult = {
  prediction: string;
  confidence: number;
  all_predictions: Record<string, number>;
};

export default function ImageUpload({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}){
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageError, setImageError] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError(
        "Please select a PNG, JPG, or JPEG image."
      );

      setSelectedImage(null);
      setSelectedFile(null);
      setImageName("");

      return;
    }

    setImageError("");
    setAnalysisError("");
    setResult(null);

    setSelectedFile(file);
    setImageName(file.name);

    // Revoke the previous blob URL to avoid memory leaks
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  const handleChooseImage = () => {
  if (!isLoggedIn) {
    router.push("/signup?next=/#diagnosis");
    return;
  }

  fileInputRef.current?.click();
};

  const handleRemoveImage = () => {
    // Revoke blob URL before clearing
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setSelectedFile(null);
    setImageName("");
    setImageError("");
    setAnalysisError("");
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyzeImage = async () => {
    if (!isLoggedIn) {
      router.push("/signup?next=/#diagnosis");
      return;
    }
    if (!selectedFile) {
      setAnalysisError(
        "Please select an image first."
      );

      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const ML_API_URL =
        process.env.NEXT_PUBLIC_ML_API_URL ?? "http://127.0.0.1:8001";

      const response = await fetch(
        `${ML_API_URL}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail ||
            "Failed to analyze image."
        );
      }

      const data: PredictionResult =
        await response.json();

      setResult(data);
    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the image."
      );
    } finally {
      setIsAnalyzing(false);
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
                disabled={isAnalyzing}
                className="rounded-lg border border-blue-300 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Change Image
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isAnalyzing}
                className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </button>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing}
              className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isAnalyzing
                ? "Analyzing..."
                : "Analyze Image"}
            </button>
          </div>
        )}

        {imageError && (
          <p className="mt-5 text-sm font-medium text-red-500">
            {imageError}
          </p>
        )}
      </div>

      {analysisError && (
        <p className="mt-5 text-sm font-medium text-red-500">
          {analysisError}
        </p>
      )}

      {result && (
        <div className="mt-8 rounded-3xl border border-cyan-200 bg-white p-8 text-left shadow-xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
              AI Analysis Complete
            </p>

            <h3 className="mt-4 text-3xl font-bold text-slate-900">
              {result.prediction.replaceAll("_", " ")}
            </h3>

            <p className="mt-3 text-xl font-semibold text-green-600">
              {result.confidence}% Confidence
            </p>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h4 className="mb-5 text-lg font-semibold text-slate-900">
              Prediction Breakdown
            </h4>

            <div className="space-y-4">
              {Object.entries(result.all_predictions)
                .sort((a, b) => b[1] - a[1])
                .map(([className, probability]) => (
                  <div key={className}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {className.replaceAll("_", " ")}
                      </span>

                      <span className="font-semibold text-slate-900">
                        {probability}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                        style={{
                          width: `${probability}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}