# 👁️ VisionDX

> AI-powered retinal fundus image analysis platform built with Next.js, PyTorch, ResNet50, FastAPI, Prisma, and PostgreSQL.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-ee4c2c?logo=pytorch)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169e1?logo=postgresql)](https://www.postgresql.org/)

---

## 🌐 Live Demo

**Frontend:** https://visiondx.vercel.app/

> The Next.js frontend is deployed on Vercel.
>
> The ML inference backend currently runs locally because GPU-based cloud deployment is not part of the current production deployment.

---

# 🧠 About VisionDX

VisionDX is an AI-powered retinal fundus image analysis platform designed to assist with the classification of retinal images.

Users can upload a retinal fundus image and receive an AI-generated prediction from a trained **ResNet50 deep learning model**.

The platform combines a modern web application with a dedicated machine learning backend and database system.

### Core capabilities

- 👁️ Retinal fundus image analysis
- 🧠 ResNet50 deep learning classification
- 📊 Confidence score and class probability breakdown
- 🔐 User authentication
- 👤 User profiles
- 📁 Prediction history
- 🗄️ PostgreSQL database
- ⚡ FastAPI ML inference API
- 🌐 Next.js frontend

---

# ✨ Features

## 🤖 AI Retinal Image Analysis

Users can upload a retinal fundus image and receive an AI-generated classification.

VisionDX currently supports **7 retinal image classes**:

| Class | Description |
|---|---|
| AMD | Age-Related Macular Degeneration |
| Cataract | Cataract |
| DR | Diabetic Retinopathy |
| Glaucoma | Glaucoma |
| Hypertensive Retinopathy | Retinal changes associated with hypertension |
| Normal Fundus | Normal retinal fundus |
| Pathological Myopia | Pathological Myopia |

---

## 📊 Prediction Results

After analysis, the application displays:

- Predicted disease/class
- Prediction confidence
- Probability for each class
- Visual probability breakdown

Example:

```text
Prediction: Glaucoma

Confidence: 94.32%

Prediction Breakdown
Glaucoma                  94.32%
AMD                        1.24%
DR                         1.15%
Hypertensive Retinopathy   0.91%
Normal Fundus              0.67%
Pathological Myopia        1.23%
Cataract                   0.48%
🔐 Authentication
VisionDX includes a user authentication system.
Users can:
Create an account
Log in
Log out
Access their profile
Save predictions
View previous predictions
Authentication uses token-based sessions stored through HTTP cookies.
📁 Prediction History
When a logged-in user saves a prediction, the result is stored in PostgreSQL.
The system stores information including:
Prediction ID
Retinal image reference
Predicted disease
Confidence score
Prediction probabilities
Creation timestamp
Associated user
VisionDX currently keeps the 5 most recent predictions per user.
🧠 Deep Learning Model
VisionDX uses a ResNet50 architecture implemented with PyTorch and TorchVision.
The model was adapted for classification across seven retinal image classes.
Model architecture
Retinal Fundus Image
        │
        ▼
Image Preprocessing
        │
        ▼
ResNet50
        │
        ▼
Feature Extraction
        │
        ▼
Dropout (0.3)
        │
        ▼
Fully Connected Layer
        │
        ▼
7-Class Classification
        │
        ▼
Softmax Probabilities
        │
        ▼
Prediction + Confidence
The final classification layer is:
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.fc.in_features, 7)
)
📈 Model Performance
The trained model was evaluated on 1,236 test images.
Metric
Result
Test Accuracy
96.93%
Weighted F1-Score
96.94%
Best Validation Accuracy
91.45%
Test Images
1,236
Training Images
55,446
Number of Classes
7
Training progression
Epoch
Train Accuracy
Validation Accuracy
1
90.12%
90.07%
2
96.37%
89.84%
3
97.13%
90.30%
4
97.43%
91.45%
5
97.72%
90.99%
The best checkpoint was selected based on validation accuracy.
The difference between training and validation performance was monitored to identify potential overfitting.
📚 Dataset
The model was trained using a retinal fundus image dataset containing 55,446 training images across seven classes.
Training distribution
Class
Images
AMD
7,284
Cataract
6,845
DR
7,912
Glaucoma
8,390
Hypertensive Retinopathy
6,100
Normal Fundus
13,205
Pathological Myopia
5,710
Total
55,446
Additional evaluation data:
Validation images: 1,236
Test images: 1,236
The dataset itself is not included in this repository because of its size and dataset distribution considerations.
🔄 Training Pipeline
The training pipeline performs:
Dataset
   ↓
Image Loading
   ↓
Image Augmentation / Transformation
   ↓
ResNet50 Transfer Learning
   ↓
Training
   ↓
Validation
   ↓
Checkpoint Selection
   ↓
Best Model
   ↓
Evaluation
The model was trained using:
PyTorch
TorchVision
CUDA acceleration
NVIDIA GeForce RTX 3050 Ti Laptop GPU
The trained model checkpoint is stored at:
ml-backend/models/visiondx_resnet50_best.pth
⚡ ML Backend
The machine learning inference service is implemented using FastAPI.
API endpoints
GET  /
GET  /health
POST /predict
Prediction endpoint
POST /predict
The endpoint accepts a retinal image using multipart form data:
file: <retinal image>
The backend:
Validates the image type
Reads the uploaded image
Converts it to RGB
Resizes it to 224 × 224
Applies ImageNet normalization
Converts the image into a PyTorch tensor
Runs ResNet50 inference
Calculates Softmax probabilities
Returns the predicted class and confidence
📤 Prediction Response
The current FastAPI backend returns:
{
  "prediction": "Glaucoma",
  "confidence": 94.32,
  "all_predictions": {
    "AMD": 1.24,
    "Cataract": 0.48,
    "DR": 1.15,
    "Glaucoma": 94.32,
    "Hypertensive_Retinopathy": 0.91,
    "Normal_Fundus": 0.67,
    "Pathological_Myopia": 1.23
  }
}
🏗️ System Architecture
                         ┌─────────────────────┐
                         │     User Browser     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                             Upload Image
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │    ML Backend       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Image Preprocessing │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      ResNet50       │
                         │      PyTorch        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Prediction +        │
                         │ Confidence Scores   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js Result    │
                         └─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │ Prediction History  │
                         └─────────────────────┘
🛠️ Technology Stack
Frontend
Next.js 16
React
TypeScript
Tailwind CSS
Machine Learning
Python
PyTorch
TorchVision
ResNet50
CUDA
NumPy
Pillow
ML API
FastAPI
Uvicorn
Python Multipart
Database
PostgreSQL
Prisma ORM
Authentication
JWT/token-based authentication
HTTP cookies
Development & Version Control
Git
GitHub
📂 Project Structure
VISIONDX-NEW/
│
└── visiondx-new/
    │
    ├── app/
    │   ├── api/
    │   │   ├── auth/
    │   │   ├── predict/
    │   │   ├── profile/
    │   │   └── ...
    │   │
    │   ├── components/
    │   │   ├── ImageUpload.tsx
    │   │   └── LogoutButton.tsx
    │   │
    │   ├── login/
    │   ├── profile/
    │   ├── signup/
    │   ├── page.tsx
    │   └── layout.tsx
    │
    ├── lib/
    │   ├── auth.ts
    │   └── prisma.ts
    │
    ├── prisma/
    │   └── schema.prisma
    │
    ├── public/
    │
    ├── ml-backend/
    │   ├── app.py
    │   ├── train.py
    │   ├── evaluate.py
    │   ├── dataset.py
    │   ├── model.py
    │   ├── requirements.txt
    │   │
    │   └── models/
    │       └── visiondx_resnet50_best.pth
    │
    ├── package.json
    ├── next.config.ts
    ├── prisma.config.ts
    └── README.md
🚀 Running VisionDX Locally
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd visiondx-new
🌐 Run the Next.js Frontend
Install dependencies:
npm install
Start the development server:
npm run dev
Open:
http://localhost:3000
🧠 Run the ML Backend
Navigate to:
cd ml-backend
Create/activate the Python virtual environment.
Windows
python -m venv venv
venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Start FastAPI:
uvicorn app:app --host 127.0.0.1 --port 8001 --reload
The API will be available at:
http://127.0.0.1:8001
Health check:
http://127.0.0.1:8001/health
🧪 Train the Model
Navigate to the ML backend:
cd ml-backend
Activate the virtual environment:
venv\Scripts\activate
Run:
python train.py
The training pipeline:
Loads the retinal dataset
Applies image transformations
Loads ResNet50
Modifies the classifier for seven classes
Uses CUDA when available
Trains the model
Validates after each epoch
Saves the best-performing checkpoint
🖥️ GPU Training
The model was trained using:
GPU:
NVIDIA GeForce RTX 3050 Ti Laptop GPU

CUDA:
Enabled
Check CUDA availability:
import torch

print(torch.cuda.is_available())

if torch.cuda.is_available():
    print(torch.cuda.get_device_name(0))
🔄 End-to-End Prediction Flow
User
  ↓
Select retinal image
  ↓
Next.js frontend
  ↓
FastAPI /predict
  ↓
Image validation
  ↓
RGB conversion
  ↓
Resize 224 × 224
  ↓
Normalization
  ↓
PyTorch Tensor
  ↓
ResNet50 inference
  ↓
Softmax probabilities
  ↓
Predicted class
  ↓
Confidence + probabilities
  ↓
Result displayed in frontend
  ↓
User saves prediction
  ↓
Next.js API
  ↓
PostgreSQL
  ↓
Prediction history
☁️ Deployment
Frontend
The Next.js application is currently deployed on:
Vercel
Live application:
https://visiondx.vercel.app/
ML Backend
The FastAPI/PyTorch backend currently runs locally.
The reason is that the ResNet50 inference environment requires PyTorch and sufficient compute resources, while GPU-based always-on cloud hosting introduces additional infrastructure and cost requirements.
The architecture is therefore separated into:
Production Frontend
        │
        │
        ▼
     Vercel

ML Backend
        │
        ▼
 FastAPI + PyTorch
     Local GPU
The backend can be moved to a suitable cloud GPU/compute service in a future deployment.
🔮 Future Improvements
Potential future improvements include:
Deploy the ML inference backend to cloud infrastructure
Containerize the ML backend with Docker
Connect the production frontend directly to the deployed ML API
Add model monitoring
Add detailed classification reports
Add confusion matrix visualization
Improve class balancing
Experiment with learning-rate scheduling
Add early stopping
Improve model generalization
Add richer prediction analytics
Improve profile dashboard
Add explainable AI / visual attention maps
Add model versioning
⚠️ Medical Disclaimer
VisionDX is an experimental AI-based retinal image classification project developed for educational and research purposes.
The predictions generated by VisionDX:
Are not medical diagnoses
Should not replace professional medical advice
Should not be used as the sole basis for treatment decisions
Always consult a qualified healthcare professional for medical diagnosis and treatment.
📊 Current Project Status
Component
Status
Next.js Frontend
✅ Complete
Responsive UI
✅ Complete
User Authentication
✅ Complete
User Profile
✅ Complete
PostgreSQL Integration
✅ Complete
Prediction History
✅ Complete
Dataset Preparation
✅ Complete
ResNet50 Model
✅ Trained
Model Evaluation
✅ Complete
FastAPI Prediction API
✅ Complete
Frontend Prediction UI
✅ Complete
Frontend Deployment
✅ Live
ML Backend Deployment
🔄 Pending
Frontend ↔ Production ML API
🔄 Pending
🎯 Vision
VisionDX demonstrates how deep learning, computer vision, backend APIs, databases, authentication, and modern web technologies can be combined into an end-to-end AI application.
Artificial Intelligence
          +
Computer Vision
          +
Deep Learning
          +
FastAPI
          +
Next.js
          +
PostgreSQL
          +
Authentication
          ↓
       VisionDX
👨‍💻 Developer
Aarush Rastogi
Computer Science Engineering Student
Specialization: Artificial Intelligence & Machine Learning
⭐ If you found VisionDX interesting, consider giving the repository a star.