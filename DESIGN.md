# VisionDX — System Design & Architecture Document

VisionDX is an AI-powered retinal disease screening and diagnostics platform combining deep learning computer vision with a modern web application for automated multi-disease classification and patient diagnostic history management.

---

## 1. System Overview & Architecture

VisionDX utilizes a decoupled, hybrid-cloud architecture separating the high-performance ML inference runtime from the web application and data tier:

```mermaid
graph TD
    User["Clinician / Patient (Web Browser)"]
    
    subgraph "Frontend & Application Tier (Vercel / Cloud)"
        NextApp["Next.js 15 App (React 19, TailwindCSS)"]
        ClientComp["ImageUpload Component (Client-Side)"]
        AuthModule["JWT Authentication & Session Guard"]
        APIRoutes["Next.js Route Handlers (/api/*)"]
    end

    subgraph "Data Tier (Cloud PostgreSQL)"
        PrismaORM["Prisma ORM Client"]
        PostgresDB[("PostgreSQL Database (Prisma Postgres / Supabase)")]
    end

    subgraph "Inference & Deep Learning Tier (Local / GPU / ngrok)"
        NgrokTunnel["ngrok Public HTTPS Tunnel"]
        FastAPIServer["FastAPI ML Microservice (Port 8001)"]
        PyTorchModel["ResNet-50 PyTorch Model (7 Classes)"]
    end

    User -->|"Visits https://visiondx.vercel.app"| NextApp
    NextApp --> ClientComp
    ClientComp -->|"1. POST /predict (Multipart Image)"| NgrokTunnel
    NgrokTunnel --> FastAPIServer
    FastAPIServer --> PyTorchModel
    PyTorchModel -->|"Softmax Probabilities & Prediction"| FastAPIServer
    FastAPIServer -->|"JSON Diagnosis Response"| ClientComp
    
    ClientComp -->|"2. POST /api/predict (Save History)"| APIRoutes
    APIRoutes --> AuthModule
    AuthModule --> PrismaORM
    PrismaORM --> PostgresDB
```

---

## 2. Technology Stack

| Layer | Technologies & Frameworks | Description |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js 15, React 19, TypeScript, TailwindCSS | Server-side rendered pages with interactive client components and glassmorphism UI |
| **Data Persistence** | PostgreSQL, Prisma ORM 7.x | User accounts, diagnostic records, and OTP authentication tracking |
| **Auth & Security** | JWT (`jose`), HTTP-only Cookies, Bcryptjs | Stateless session management and password hashing |
| **ML Microservice** | FastAPI, Uvicorn, Python 3.13, Pillow | High-throughput asynchronous REST API for model serving |
| **Machine Learning** | PyTorch 2.x, Torchvision (ResNet-50) | Custom-head convolutional neural network trained on retinal fundus images |
| **Networking & Tunneling**| ngrok (Secure HTTPS Reverse Tunnel) | Bridges cloud-hosted frontend (Vercel) to local inference compute |

---

## 3. Machine Learning Pipeline & Classification

### 3.1 Neural Network Architecture
* **Backbone:** ResNet-50 (Residual Networks with 50 layers, pretrained feature extractor)
* **Custom Classification Head:**
  ```python
  model.fc = nn.Sequential(
      nn.Dropout(0.3),
      nn.Linear(model.fc.in_features, num_classes) # num_classes = 7
  )
  ```

### 3.2 Target Disease Classes
The model evaluates retinal fundus photographs across 7 distinct medical classifications:
1. **AMD** (Age-related Macular Degeneration)
2. **Cataract**
3. **DR** (Diabetic Retinopathy)
4. **Glaucoma**
5. **Hypertensive Retinopathy**
6. **Normal Fundus** (Healthy Retina)
7. **Pathological Myopia**

### 3.3 Preprocessing & Transformation Pipeline
Input images undergo standard computer vision normalization matching the training distribution:
$$\text{Input Image} \longrightarrow \text{Resize}(224, 224) \longrightarrow \text{ToTensor}() \longrightarrow \text{Normalize}(\mu, \sigma)$$
* **Mean ($\mu$):** `[0.485, 0.456, 0.406]`
* **Standard Deviation ($\sigma$):** `[0.229, 0.224, 0.225]`

---

## 4. API Specifications & Contracts

### 4.1 ML Inference Microservice (`FastAPI`)

#### `POST /predict`
Performs real-time deep learning inference on an uploaded retinal fundus image.

* **Headers:**
  * `Content-Type: multipart/form-data`
  * `ngrok-skip-browser-warning: true` *(for ngrok tunnels)*
* **Request Body:**
  * `file`: Binary image file (`image/jpeg`, `image/png`)
* **Response Contract (200 OK):**
  ```json
  {
    "prediction": "Glaucoma",
    "confidence": 98.45,
    "all_predictions": {
      "AMD": 0.12,
      "Cataract": 0.05,
      "DR": 0.35,
      "Glaucoma": 98.45,
      "Hypertensive_Retinopathy": 0.21,
      "Normal_Fundus": 0.42,
      "Pathological_Myopia": 0.40
    }
  }
  ```

#### `GET /health`
* **Response Contract (200 OK):**
  ```json
  {
    "status": "healthy",
    "model_loaded": true,
    "device": "cpu"
  }
  ```

---

### 4.2 Next.js Application Route Handlers

| Route | Method | Access | Purpose |
| :--- | :---: | :---: | :--- |
| `/api/auth/signup` | `POST` | Public | Register user account with hashed password |
| `/api/auth/login` | `POST` | Public | Verify credentials and issue JWT cookie (`visiondx_token`) |
| `/api/auth/logout` | `POST` | Public | Invalidate session cookie |
| `/api/predict` | `POST` | Authenticated | Persist diagnostic record (keeps latest 5 records per user) |
| `/api/profile` | `GET` | Authenticated | Retrieve authenticated user details & past predictions |

---

## 5. Database Schema (Prisma)

```mermaid
erDiagram
    USER ||--o{ PREDICTION : "has many"
    USER {
        string id PK "cuid"
        string name
        string email UK
        string passwordHash
        int age
        string gender
        datetime createdAt
        datetime updatedAt
    }
    PREDICTION {
        string id PK "cuid"
        string imageUrl
        string disease
        float confidence
        json predictions
        datetime createdAt
        string userId FK
    }
    PASSWORD_RESET_OTP {
        string id PK "cuid"
        string email
        string otp
        datetime expiresAt
        datetime createdAt
    }
```

---

## 6. End-to-End Diagnostic Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Clinician / Patient
    participant Browser as Client Browser (Next.js UI)
    participant FastAPI as FastAPI Inference Engine (ngrok)
    participant Model as ResNet-50 PyTorch
    participant NextAPI as Next.js API (/api/predict)
    participant DB as PostgreSQL (Prisma)

    User->>Browser: Selects Retinal Image (.png/.jpg)
    Browser->>Browser: Generates local object preview URL
    User->>Browser: Clicks "Analyze Image"
    Browser->>FastAPI: POST /predict (multipart/form-data)
    FastAPI->>Model: Tensor Batch [1, 3, 224, 224]
    Model-->>FastAPI: Softmax Probabilities across 7 Classes
    FastAPI-->>Browser: JSON { prediction, confidence, all_predictions }
    Browser->>Browser: Renders AI Diagnosis Badge & Probability Breakdown Bars
    
    opt User saves to history
        User->>Browser: Clicks "Save Prediction"
        Browser->>NextAPI: POST /api/predict { disease, confidence, predictions }
        NextAPI->>NextAPI: Validates session JWT from HTTP-only cookie
        NextAPI->>DB: INSERT into Prediction table
        NextAPI->>DB: Trims user history to latest 5 records
        NextAPI-->>Browser: JSON { success: true, message: "Prediction saved" }
        Browser->>User: Displays confirmation badge
    end
```

---

## 7. Security & Environment Configuration

### Environment Variables Matrix

| Variable | Scope | Target | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Server-only | Vercel / Local `.env` | Connection string for PostgreSQL database |
| `JWT_SECRET` | Server-only | Vercel / Local `.env` | Secret key for signing and verifying user session JWTs |
| `NEXT_PUBLIC_API_URL` | Client & Server | Vercel / Local `.env` | Public HTTPS base URL for ML backend (`ngrok` tunnel or cloud endpoint) |

### Key Security Controls
* **CORS Protection:** Explicit whitelist in FastAPI restricting allowed origins (`https://visiondx.vercel.app`, `localhost:3000`).
* **Session Integrity:** JWT stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies to mitigate XSS attacks.
* **Input Validation:** Multipart type verification (`image/jpeg`, `image/png`) and dimension normalization prior to feeding tensors into model memory.
