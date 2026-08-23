import torch
import torch.nn as nn
import torch.optim as optim

from pathlib import Path
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models


# ============================================================
# DEVICE
# ============================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("=" * 60)
print("VisionDX Training")
print("=" * 60)
print(f"Device: {device}")

if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")

print("=" * 60)


# ============================================================
# DATASET PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATASET_DIR = (
    BASE_DIR.parent /
    "dataset" /
    "Retinal Fundus Images"
)

TRAIN_DIR = DATASET_DIR / "train"
VAL_DIR = DATASET_DIR / "val"
TEST_DIR = DATASET_DIR / "test"


print("\nDataset paths:")
print(f"Train: {TRAIN_DIR}")
print(f"Train exists: {TRAIN_DIR.exists()}")

print(f"\nValidation: {VAL_DIR}")
print(f"Validation exists: {VAL_DIR.exists()}")

print(f"\nTest: {TEST_DIR}")
print(f"Test exists: {TEST_DIR.exists()}")


# ============================================================
# CONFIGURATION
# ============================================================

IMAGE_SIZE = 224
BATCH_SIZE = 16
NUM_EPOCHS = 10
LEARNING_RATE = 0.0001
NUM_WORKERS = 0

NUM_CLASSES = 7


# ============================================================
# TRANSFORMS
# ============================================================

train_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.RandomHorizontalFlip(),

    transforms.RandomRotation(10),

    transforms.ColorJitter(
        brightness=0.1,
        contrast=0.1,
        saturation=0.1
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading datasets...")


train_dataset = datasets.ImageFolder(
    root=str(TRAIN_DIR),
    transform=train_transform
)


# Your val folder is being used as the validation dataset
val_dataset = datasets.ImageFolder(
    root=str(VAL_DIR),
    transform=val_transform
)


print("\nClasses:")

for index, class_name in enumerate(train_dataset.classes):
    print(f"{index}: {class_name}")


print("\nDataset split:")
print(f"Training images: {len(train_dataset)}")
print(f"Validation images: {len(val_dataset)}")


# ============================================================
# DATA LOADERS
# ============================================================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=NUM_WORKERS,
    pin_memory=True
)


val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=NUM_WORKERS,
    pin_memory=True
)


# ============================================================
# LOAD RESNET50
# ============================================================

print("\nLoading ResNet50...")

model = models.resnet50(
    weights=models.ResNet50_Weights.DEFAULT
)


# Replace the final classification layer

model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(
        model.fc.in_features,
        NUM_CLASSES
    )
)


model = model.to(device)


print("\nModel loaded successfully.")


# ============================================================
# LOSS FUNCTION
# ============================================================

criterion = nn.CrossEntropyLoss()


# ============================================================
# OPTIMIZER
# ============================================================

optimizer = optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=1e-4
)


# ============================================================
# TRAINING FUNCTION
# ============================================================

def train_one_epoch():

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0


    for images, labels in train_loader:

        images = images.to(
            device,
            non_blocking=True
        )

        labels = labels.to(
            device,
            non_blocking=True
        )


        # Reset gradients
        optimizer.zero_grad()


        # Forward pass
        outputs = model(images)


        # Calculate loss
        loss = criterion(
            outputs,
            labels
        )


        # Backpropagation
        loss.backward()


        # Update weights
        optimizer.step()


        running_loss += loss.item()


        # Predictions
        _, predicted = torch.max(
            outputs.data,
            1
        )


        total += labels.size(0)


        correct += (
            predicted == labels
        ).sum().item()


    epoch_loss = running_loss / len(train_loader)

    epoch_accuracy = (
        100 * correct / total
    )


    return epoch_loss, epoch_accuracy


# ============================================================
# VALIDATION FUNCTION
# ============================================================

def validate():

    model.eval()

    running_loss = 0.0

    correct = 0

    total = 0


    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(
                device,
                non_blocking=True
            )

            labels = labels.to(
                device,
                non_blocking=True
            )


            outputs = model(images)


            loss = criterion(
                outputs,
                labels
            )


            running_loss += loss.item()


            _, predicted = torch.max(
                outputs.data,
                1
            )


            total += labels.size(0)


            correct += (
                predicted == labels
            ).sum().item()


    validation_loss = (
        running_loss /
        len(val_loader)
    )


    validation_accuracy = (
        100 * correct / total
    )


    return validation_loss, validation_accuracy


# ============================================================
# TRAINING LOOP
# ============================================================

print("\n" + "=" * 60)
print("Starting Training")
print("=" * 60)


best_val_accuracy = 0.0


# Create models directory

MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(
    exist_ok=True
)


MODEL_PATH = (
    MODEL_DIR /
    "visiondx_resnet50_best.pth"
)


for epoch in range(NUM_EPOCHS):

    print(
        f"\nEpoch "
        f"{epoch + 1}/{NUM_EPOCHS}"
    )


    # Train

    train_loss, train_accuracy = (
        train_one_epoch()
    )


    # Validate

    val_loss, val_accuracy = (
        validate()
    )


    print(
        f"Train Loss: "
        f"{train_loss:.4f}"
    )

    print(
        f"Train Accuracy: "
        f"{train_accuracy:.2f}%"
    )


    print(
        f"Validation Loss: "
        f"{val_loss:.4f}"
    )


    print(
        f"Validation Accuracy: "
        f"{val_accuracy:.2f}%"
    )


    # Save best model

    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy


        torch.save(
            {
                "model_state_dict":
                    model.state_dict(),

                "class_names":
                    train_dataset.classes,

                "num_classes":
                    NUM_CLASSES,

                "validation_accuracy":
                    val_accuracy
            },
            MODEL_PATH
        )


        print(
            f"✓ Best model saved!"
        )


# ============================================================
# TRAINING COMPLETE
# ============================================================

print("\n" + "=" * 60)

print("Training Complete!")

print(
    f"Best Validation Accuracy: "
    f"{best_val_accuracy:.2f}%"
)

print(
    f"Model saved to:"
)

print(MODEL_PATH)

print("=" * 60)