# 👁️ VisionDX

> AI-powered retinal fundus image analysis using Deep Learning, PyTorch, ResNet50, FastAPI, Next.js, and PostgreSQL.

![VisionDX Banner](https://img.shields.io/badge/AI-Powered-cyan)
![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-red)
![Next.js](https://img.shields.io/badge/Next.js-Full%20Stack-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

---

# 🧠 About VisionDX

VisionDX is an AI-powered retinal image analysis platform designed to assist in the classification of retinal fundus images.

Users can upload a retinal fundus image and receive a prediction generated using a deep learning model based on **ResNet50**.

The project combines:

- 🧠 Deep Learning
- 👁️ Computer Vision
- ⚡ FastAPI
- 🌐 Next.js
- 🗄️ PostgreSQL
- 🔐 User Authentication
- 📊 Prediction History

VisionDX is designed as a full-stack AI application where users can interact with a trained deep learning model through a modern web interface.

---

# ✨ Features

## 🤖 AI-Powered Retinal Analysis

Upload a retinal fundus image and receive an AI-generated prediction.

The deep learning model classifies images into the following **7 classes**:

| Class | Description |
|---|---|
| AMD | Age-Related Macular Degeneration |
| Cataract | Cataract |
| DR | Diabetic Retinopathy |
| Glaucoma | Glaucoma |
| Hypertensive Retinopathy | Retinal damage related to hypertension |
| Normal Fundus | Healthy retinal image |
| Pathological Myopia | Pathological Myopia |

---

## 🔐 Authentication System

VisionDX includes user authentication functionality.

Users can:

- Create an account
- Log in securely
- Log out
- Access their profile
- View their prediction history

Authentication is handled using secure tokens stored in cookies.

---

## 📁 Image Upload

Users can upload retinal fundus images in supported formats:

- PNG
- JPG
- JPEG

The uploaded image is sent to the backend for preprocessing and AI inference.

---

## 🧠 Deep Learning Model

The AI model is built using **PyTorch** and **TorchVision**.

### Architecture

```text
Input Retinal Image
        ↓
Image Preprocessing
        ↓
ResNet50
        ↓
Feature Extraction
        ↓
Dropout Layer
        ↓
Fully Connected Layer
        ↓
7 Disease Classes

The final classification layer was modified for VisionDX.

Original ResNet50 Output → 1000 Classes

VisionDX ResNet50 Output → 7 Classes
🧬 Model Architecture

The model uses a pretrained ResNet50 architecture.

Transfer learning is used to leverage features learned from large-scale image datasets.

The final layer is modified as follows:

model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(2048, 7)
)

The model predicts probabilities for the following classes:

0 → AMD
1 → Cataract
2 → DR
3 → Glaucoma
4 → Hypertensive_Retinopathy
5 → Normal_Fundus
6 → Pathological_Myopia
📊 Dataset

The VisionDX model is trained on a retinal fundus image dataset containing 7 different classes.

The original dataset structure contains:

Retinal Fundus Images/
│
├── train/
│   ├── AMD/
│   ├── Cataract/
│   ├── DR/
│   ├── Glaucoma/
│   ├── Hypertensive_Retinopathy/
│   ├── Normal_Fundus/
│   └── Pathological_Myopia/
│
├── val/
│
└── test/
Original Dataset Distribution
Training Dataset
Class	Images
AMD	7,284
Cataract	6,845
DR	7,912
Glaucoma	8,390
Hypertensive Retinopathy	6,100
Normal Fundus	13,205
Pathological Myopia	5,710
Total Training Images
55,446 images
Original Validation Dataset
433 images
Original Test Dataset
1,236 images
🔄 Dataset Split Used for Training

For the VisionDX training pipeline, the training dataset was split into:

Training Images:   49,901
Validation Images: 5,545

The validation data is used to monitor the model's ability to generalize to unseen images.

📈 Training Results

The model was trained using an NVIDIA RTX 3050 Ti Laptop GPU with CUDA acceleration.

Hardware
GPU: NVIDIA GeForce RTX 3050 Ti Laptop GPU
CUDA: Enabled
PyTorch: CUDA Version
Training Metrics
Epoch 1
Train Loss:        0.2854
Train Accuracy:    90.12%

Validation Loss:   0.4292
Validation Accuracy: 90.07%

✅ Best model saved.

Epoch 2
Train Loss:        0.0975
Train Accuracy:    96.37%

Validation Loss:   0.4551
Validation Accuracy: 89.84%
Epoch 3
Train Loss:        0.0709
Train Accuracy:    97.13%

Validation Loss:   0.5210
Validation Accuracy: 90.30%

✅ Best model saved.

Epoch 4
Train Loss:        0.0600
Train Accuracy:    97.43%

Validation Loss:   0.6945
Validation Accuracy: 91.45%

🏆 Best validation accuracy achieved so far.

Epoch 5
Train Loss:        0.0524
Train Accuracy:    97.72%

Validation Loss:   0.6544
Validation Accuracy: 90.99%
Current Best Result
Best Validation Accuracy: 91.45%

The model checkpoint is automatically saved whenever validation accuracy improves.

⚠️ Training Observations

The training accuracy increased rapidly:

Epoch 1 → 90.12%
Epoch 2 → 96.37%
Epoch 3 → 97.13%
Epoch 4 → 97.43%
Epoch 5 → 97.72%

However, validation loss increased during later epochs.

This may indicate the beginning of overfitting, where the model becomes increasingly specialized to the training dataset.

To address this, VisionDX uses techniques such as:

Transfer Learning
Dropout
Data Augmentation
Validation Monitoring
Best Model Checkpointing

Future improvements may include:

Early Stopping
Learning Rate Scheduling
Additional Data Augmentation
Class Balancing
Hyperparameter Tuning
🏗️ Project Architecture
                    ┌──────────────────────┐
                    │      User Browser    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Next.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                        Upload Image
                               │
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Image Preprocessing  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    ResNet50 Model    │
                    │   PyTorch + CUDA     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Disease Prediction   │
                    │ + Confidence Score   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Prediction History   │
                    │     PostgreSQL       │
                    └──────────────────────┘
🛠️ Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Backend
Python
FastAPI
Uvicorn
Artificial Intelligence
PyTorch
TorchVision
ResNet50
CUDA
Database
PostgreSQL
Prisma ORM
Authentication
Token-based authentication
HTTP Cookies
Secure user sessions
📂 Project Structure
VISIONDX-NEW/
│
└── visiondx-new/
    │
    ├── app/
    │   │
    │   ├── components/
    │   │   └── LogoutButton.tsx
    │   │
    │   ├── login/
    │   ├── profile/
    │   ├── register/
    │   │
    │   ├── page.tsx
    │   └── layout.tsx
    │
    ├── lib/
    │   ├── auth.ts
    │   └── ...
    │
    ├── prisma/
    │   └── schema.prisma
    │
    ├── public/
    │
    ├── ml-backend/
    │   │
    │   ├── train.py
    │   ├── requirements.txt
    │   │
    │   ├── models/
    │   │   └── visiondx_model.pth
    │   │
    │   └── ...
    │
    ├── package.json
    ├── next.config.ts
    └── README.md

The retinal image dataset is intentionally excluded from GitHub because of its large size.

🚀 Running the Frontend

Navigate to the Next.js project:

cd visiondx-new

Install dependencies:

npm install

Start the development server:

npm run dev

Open:

http://localhost:3000
🧠 Training the AI Model

Navigate to the ML backend:

cd ml-backend

Activate the virtual environment.

Windows
venv\Scripts\activate

Run the training script:

python train.py

The training pipeline will:

Load retinal fundus images.
Apply image transformations.
Load pretrained ResNet50.
Modify the classification layer for 7 classes.
Train using CUDA if available.
Validate after every epoch.
Save the best-performing model.
🖥️ GPU Training

VisionDX supports CUDA acceleration.

The training environment used:

GPU:
NVIDIA GeForce RTX 3050 Ti Laptop GPU

CUDA:
Enabled

PyTorch:
CUDA Build

GPU availability can be checked using:

import torch

print(torch.cuda.is_available())

if torch.cuda.is_available():
    print(torch.cuda.get_device_name(0))
📤 Prediction Flow
User selects retinal image
        ↓
Frontend sends image
        ↓
FastAPI receives image
        ↓
Image is converted to RGB
        ↓
Image is resized
        ↓
Image is normalized
        ↓
Tensor is created
        ↓
ResNet50 performs inference
        ↓
Softmax probabilities calculated
        ↓
Highest probability selected
        ↓
Prediction returned to frontend
        ↓
Result displayed to user
🧪 Example Prediction Response

The backend can return data in the following format:

{
  "prediction": "Glaucoma",
  "confidence": 94.32
}

Future versions can also return probabilities for all classes:

{
  "prediction": "Glaucoma",
  "confidence": 94.32,
  "probabilities": {
    "AMD": 1.24,
    "Cataract": 0.48,
    "DR": 1.15,
    "Glaucoma": 94.32,
    "Hypertensive_Retinopathy": 0.91,
    "Normal_Fundus": 0.67,
    "Pathological_Myopia": 1.23
  }
}
🔮 Future Improvements

VisionDX is currently under development.

Planned improvements include:

 Complete FastAPI prediction API
 Connect Next.js frontend to AI backend
 Real-time image prediction
 Display confidence scores
 Display probabilities for all disease classes
 Save prediction history
 Improve profile dashboard
 Add prediction analytics
 Add confusion matrix visualization
 Add classification report
 Implement Early Stopping
 Implement Learning Rate Scheduler
 Improve model generalization
 Add Docker support
 Deploy frontend
 Deploy AI backend
⚠️ Medical Disclaimer

VisionDX is an experimental AI-based retinal image classification project developed for educational and research purposes.

The predictions generated by this system:

Are not medical diagnoses.
Should not replace professional medical advice.
Should not be used as the sole basis for treatment decisions.

Always consult a qualified healthcare professional for medical diagnosis and treatment.

📊 Current Project Status
Frontend UI             ██████████  100%
Authentication          █████████░  90%
Database Integration    ████████░░  80%
Dataset Preparation     ██████████  100%
Model Training          █████████░  In Progress
AI Prediction API       ████░░░░░░  Planned
Frontend ↔ AI Backend   ░░░░░░░░░░  Planned
Deployment              ░░░░░░░░░░  Planned
🎯 Vision

The goal of VisionDX is to demonstrate how modern web technologies and deep learning can be combined to build an end-to-end AI-powered application.

The project brings together:

Artificial Intelligence
        +
Computer Vision
        +
Backend Development
        +
Frontend Development
        +
Database Systems
        +
Authentication
        =
VisionDX
👨‍💻 Developer

Aarush Rastogi

Computer Science Engineering Student
Specialization: Artificial Intelligence & Machine Learning

⭐ Support

If you found this project interesting, consider giving the repository a ⭐.
