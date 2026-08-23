"use client";

import { useRef, useState } from "react";

type PredictionResult = {
  prediction: string;
  confidence: number;
  all_predictions: Record<string, number>;
};

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [imageName, setImageName] =
    useState("");

  const [imageError, setImageError] =
    useState("");

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);

  const [saveMessage, setSaveMessage] =
    useState("");

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

      setSelectedFile(null);
      setSelectedImage(null);
      setImageName("");
      setPredictionResult(null);

      return;
    }

    setImageError("");
    setSaveMessage("");

    setSelectedFile(file);
    setImageName(file.name);
    setPredictionResult(null);

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setImageName("");
    setImageError("");
    setPredictionResult(null);
    setSaveMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // ANALYZE IMAGE USING FASTAPI
  // =====================================================

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      setImageError(
        "Please select an image first."
      );

      return;
    }

    setIsAnalyzing(true);

    setImageError("");
    setPredictionResult(null);
    setSaveMessage("");

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response = await fetch(
        "http://127.0.0.1:8001/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          "Failed to analyze image."
        );
      }

      setPredictionResult(result);

    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      setImageError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the image."
      );

    } finally {
      setIsAnalyzing(false);
    }
  };

  // =====================================================
  // SAVE PREDICTION
  // =====================================================

  const handleSavePrediction = async () => {
    if (
      !selectedImage ||
      !predictionResult
    ) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setImageError("");

    try {
      // Only keep predictions greater than 0
      const meaningfulPredictions =
        Object.fromEntries(
          Object.entries(
            predictionResult.all_predictions
          ).filter(
            ([, confidence]) =>
              confidence > 0
          )
        );

      const response = await fetch(
        "/api/predict",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            imageUrl: selectedImage,

            disease:
              predictionResult.prediction,

            confidence:
              predictionResult.confidence,

            predictions:
              meaningfulPredictions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save prediction."
        );
      }

      setSaveMessage(
        "Prediction saved successfully!"
      );

    } catch (error) {
      console.error(
        "Save prediction error:",
        error
      );

      setImageError(
        error instanceof Error
          ? error.message
          : "Failed to save prediction."
      );

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-12">

      {/* Hidden file input */}

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

            {/* Image Preview */}

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

            {/* Image buttons */}

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <button
                type="button"
                onClick={handleChooseImage}
                disabled={isAnalyzing || isSaving}
                className="rounded-lg border border-blue-300 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
              >
                Change Image
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isAnalyzing || isSaving}
                className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
              >
                Remove
              </button>

            </div>

            {/* Analyze Button */}

            {!predictionResult && (

              <button
                type="button"
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAnalyzing
                  ? "Analyzing..."
                  : "Analyze Image"}
              </button>

            )}

            {/* AI RESULT */}

            {predictionResult && (

              <div className="mt-8 rounded-2xl border border-cyan-200 bg-white p-6 text-left shadow-lg">

                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                  AI Analysis Result
                </p>

                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  {predictionResult.prediction.replaceAll(
                    "_",
                    " "
                  )}
                </h3>

                <p className="mt-2 text-lg text-slate-600">

                  Confidence:{" "}

                  <span className="font-bold text-green-600">
                    {predictionResult.confidence.toFixed(2)}%
                  </span>

                </p>

                {/* Meaningful predictions */}

                <div className="mt-6 border-t border-slate-200 pt-5">

                  <p className="font-semibold text-slate-800">
                    Prediction Breakdown
                  </p>

                  <div className="mt-4 space-y-3">

                    {Object.entries(
                      predictionResult.all_predictions
                    )
                      .filter(
                        ([, confidence]) =>
                          confidence > 0
                      )
                      .sort(
                        ([, a], [, b]) =>
                          b - a
                      )
                      .map(
                        ([disease, confidence]) => (

                          <div key={disease}>

                            <div className="flex justify-between text-sm">

                              <span className="text-slate-600">
                                {disease.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>

                              <span className="font-medium text-slate-900">
                                {confidence.toFixed(2)}%
                              </span>

                            </div>

                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">

                              <div
                                className="h-full rounded-full bg-cyan-500 transition-all"
                                style={{
                                  width: `${confidence}%`,
                                }}
                              />

                            </div>

                          </div>

                        )
                      )}

                  </div>

                </div>

                {/* SAVE BUTTON */}

                <button
                  type="button"
                  onClick={handleSavePrediction}
                  disabled={isSaving || !!saveMessage}
                  className="mt-8 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : saveMessage
                    ? "Prediction Saved ✓"
                    : "Save Prediction"}
                </button>

                {saveMessage && (
                  <p className="mt-4 text-center font-medium text-green-600">
                    {saveMessage}
                  </p>
                )}

              </div>

            )}

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