import io
from pathlib import Path

import torch
import torch.nn as nn

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image

from torchvision import models, transforms


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR /
    "models" /
    "visiondx_resnet50_best.pth"
)


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="VisionDX API",
    description="AI-powered retinal image classification API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://visiondx.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IMAGE TRANSFORM
# Must match validation/testing transform
# ============================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# LOAD MODEL
# ============================================================

print("=" * 60)
print("Loading VisionDX Model")
print("=" * 60)

print(f"Device: {device}")
print(f"Model path: {MODEL_PATH}")


if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model not found at: {MODEL_PATH}"
    )


checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)


class_names = checkpoint["class_names"]
num_classes = checkpoint["num_classes"]


print("\nClasses:")

for index, class_name in enumerate(class_names):
    print(f"{index}: {class_name}")


# Create the same ResNet50 architecture

model = models.resnet50(
    weights=None
)


# Must exactly match train.py

model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(
        model.fc.in_features,
        num_classes
    )
)


# Load trained weights

model.load_state_dict(
    checkpoint["model_state_dict"]
)


model = model.to(device)

model.eval()


print("\n✓ VisionDX model loaded successfully!")
print("=" * 60)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "message": "VisionDX API is running",
        "device": str(device),
        "classes": class_names
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True,
        "device": str(device)
    }


# ============================================================
# PREDICT ENDPOINT
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Validate file type
    # --------------------------------------------------------

    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ]


    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload a JPG, JPEG, or PNG image."
            )
        )


    try:

        # ----------------------------------------------------
        # Read uploaded image
        # ----------------------------------------------------

        image_bytes = await file.read()


        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")


        # ----------------------------------------------------
        # Transform image
        # ----------------------------------------------------

        image_tensor = transform(
            image
        )


        image_tensor = (
            image_tensor
            .unsqueeze(0)
            .to(device)
        )


        # ----------------------------------------------------
        # Model prediction
        # ----------------------------------------------------

        with torch.no_grad():

            outputs = model(
                image_tensor
            )


            probabilities = torch.softmax(
                outputs,
                dim=1
            )[0]


            confidence, predicted_index = (
                torch.max(
                    probabilities,
                    dim=0
                )
            )


        predicted_index = (
            predicted_index.item()
        )


        confidence = (
            confidence.item() * 100
        )


        predicted_class = (
            class_names[predicted_index]
        )


        # ----------------------------------------------------
        # All class probabilities
        # ----------------------------------------------------

        all_predictions = {}


        for index, class_name in enumerate(
            class_names
        ):

            all_predictions[class_name] = round(
                probabilities[index].item() * 100,
                2
            )


        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {

            "prediction": predicted_class,

            "confidence": round(
                confidence,
                2
            ),

            "all_predictions": all_predictions

        }


    except Exception as error:

        print(
            f"Prediction error: {error}"
        )


        raise HTTPException(
            status_code=500,
            detail="Error processing image."
        )

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
    "app:app",
    host="127.0.0.1",
    port=8001,
    reload=True
)