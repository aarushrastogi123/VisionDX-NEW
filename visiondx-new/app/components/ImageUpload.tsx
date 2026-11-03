"use client";

import Image from "next/image";
import { Button, Card } from "apple-liquid-glass-ui";
import { useEffect, useRef, useState } from "react";

type PredictionResult = {
  prediction: string;
  confidence: number;
  all_predictions: Record<string, number>;
};

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImageUrl = useRef<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (previousImageUrl.current) {
        URL.revokeObjectURL(previousImageUrl.current);
      }
    };
  }, []);

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
      if (previousImageUrl.current) {
        URL.revokeObjectURL(previousImageUrl.current);
        previousImageUrl.current = null;
      }
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

    if (previousImageUrl.current) {
      URL.revokeObjectURL(previousImageUrl.current);
    }

    setSelectedFile(file);
    setImageName(file.name);
    setPredictionResult(null);

    const imageUrl = URL.createObjectURL(file);

    previousImageUrl.current = imageUrl;
    setSelectedImage(imageUrl);
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (previousImageUrl.current) {
      URL.revokeObjectURL(previousImageUrl.current);
      previousImageUrl.current = null;
    }
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

      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8001"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/predict`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
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
    <div className="mx-auto mt-10 max-w-3xl text-left">

      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleImageChange}
        aria-label="Choose a retinal image"
        className="sr-only"
      />

      <Card variant="elevated" padding="md" className="vision-upload-card gl-glass-elevated rounded-2xl">

        {!selectedImage ? (

          <>
            <div className="rounded-xl border border-dashed border-cyan-100/25 bg-white/[0.035] px-5 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.06)] sm:px-10 sm:py-14">
              <div aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-[#75e3df]">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15.5v3A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#edf8fa]">
                Select an image to begin
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#b5cad3]">
                Only upload a retinal fundus image (a photograph of the retina) in PNG or JPEG format. Other images aren’t supported and may produce an incorrect result. Your image is previewed here before analysis.
              </p>

              <Button type="button" variant="primary" size="md" onClick={handleChooseImage} className="mt-6">
                Choose image
              </Button>
            </div>
          </>

        ) : (

          <div>

            {/* Image Preview */}

            <div className="relative mx-auto h-[22rem] max-w-md overflow-hidden rounded-xl border border-white/15 bg-[#0a202c]/70 shadow-[0_18px_60px_rgba(0,0,0,.28)]">

              <Image
                src={selectedImage}
                alt="Selected retinal image"
                fill
                sizes="(max-width: 28rem) 100vw, 28rem"
                unoptimized
                className="object-contain"
              />

            </div>

            <p className="mt-5 break-all text-center font-medium text-[#edf8fa]">
              {imageName}
            </p>

            <p role="status" className="mt-2 text-center text-sm text-[#61cce5]">
              Image ready for review
            </p>

            {/* Image buttons */}

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <button
                type="button"
                onClick={handleChooseImage}
                disabled={isAnalyzing || isSaving}
                className="gl-glass min-h-11 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#d3e4e9] transition-colors hover:border-cyan-200/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Change image
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isAnalyzing || isSaving}
                className="min-h-11 rounded-lg px-5 py-2.5 text-sm font-semibold text-[#9db3be] transition-colors hover:bg-white/[0.06] hover:text-[#edf8fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove image
              </button>

            </div>

            {/* Analyze Button */}

            {!predictionResult && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing}
                  aria-busy={isAnalyzing}
                >
                  {isAnalyzing
                    ? "Analyzing image…"
                    : "Analyze image"}
                </Button>
              </div>
            )}

            {/* AI RESULT */}

            {predictionResult && (

              <div className="gl-glass mt-8 rounded-xl border border-cyan-100/15 p-5 text-left sm:p-7" aria-live="polite">

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#75e3df]">
                  Model output
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#edf8fa]">
                  {predictionResult.prediction.replaceAll(
                    "_",
                    " "
                  )}
                </h3>

                <p className="mt-2 text-sm text-[#b5cad3]">
                  Model confidence: {" "}
                  <span className="font-semibold text-[#edf8fa]">
                    {predictionResult.confidence.toFixed(2)}%
                  </span>

                </p>

                {/* Meaningful predictions */}

                <div className="mt-6 border-t border-white/10 pt-5">

                  <p className="font-semibold text-[#d3e4e9]">
                    Class confidence scores
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

                              <span className="text-[#b5cad3]">
                                {disease.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>

                              <span className="font-medium text-[#edf8fa]">
                                {confidence.toFixed(2)}%
                              </span>

                            </div>

                            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${disease.replaceAll("_", " ")} confidence`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.max(0, confidence))}>

                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#75e3df] to-[#61cce5] transition-[width] duration-300 motion-reduce:transition-none"
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
                  className="mt-8 min-h-12 w-full rounded-lg bg-gradient-to-r from-[#75e3df] to-[#8bf2ed] px-6 py-3 text-sm font-semibold text-[#06121c] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : saveMessage
                    ? "Saved to your history"
                    : "Save result to history"}
                </button>

                {saveMessage && (
                  <p role="status" className="mt-4 text-center text-sm font-medium text-[#61cce5]">
                    {saveMessage}
                  </p>
                )}

              </div>

            )}

          </div>

        )}

        {imageError && (

          <p role="alert" className="mt-5 rounded-lg border border-rose-200/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-100">
            {imageError}
          </p>

        )}

      </Card>

    </div>
  );
}
