import torch
import torch.nn as nn

from pathlib import Path
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("VisionDX Model Evaluation")
print("=" * 60)

print(f"Device: {device}")

if torch.cuda.is_available():
    print(
        f"GPU: {torch.cuda.get_device_name(0)}"
    )

print("=" * 60)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATASET_DIR = (
    BASE_DIR.parent /
    "dataset" /
    "Retinal Fundus Images"
)

TEST_DIR = (
    DATASET_DIR /
    "test"
)

MODEL_PATH = (
    BASE_DIR /
    "models" /
    "visiondx_resnet50_best.pth"
)


print("\nPaths:")

print(f"Test dataset: {TEST_DIR}")
print(f"Test exists: {TEST_DIR.exists()}")

print(f"\nModel: {MODEL_PATH}")
print(f"Model exists: {MODEL_PATH.exists()}")


# ============================================================
# CONFIGURATION
# ============================================================

IMAGE_SIZE = 224

BATCH_SIZE = 16

NUM_WORKERS = 0


# ============================================================
# TEST TRANSFORM
# ============================================================

test_transform = transforms.Compose([

    transforms.Resize(
        (IMAGE_SIZE, IMAGE_SIZE)
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# LOAD TEST DATASET
# ============================================================

print("\nLoading test dataset...")


test_dataset = datasets.ImageFolder(
    root=str(TEST_DIR),
    transform=test_transform
)


test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=NUM_WORKERS,
    pin_memory=True
)


print(
    f"Test images: {len(test_dataset)}"
)


print("\nTest Classes:")

for index, class_name in enumerate(
    test_dataset.classes
):
    print(
        f"{index}: {class_name}"
    )


# ============================================================
# LOAD SAVED MODEL
# ============================================================

print("\nLoading trained model...")


checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)


class_names = checkpoint["class_names"]

num_classes = checkpoint["num_classes"]

saved_validation_accuracy = (
    checkpoint["validation_accuracy"]
)


print(
    f"Saved Validation Accuracy: "
    f"{saved_validation_accuracy:.2f}%"
)


# Create ResNet50 architecture

model = models.resnet50(
    weights=None
)


# Same classifier architecture used in training

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


print("Model loaded successfully.")


# ============================================================
# RUN EVALUATION
# ============================================================

print("\n" + "=" * 60)

print("Starting Test Evaluation")

print("=" * 60)


all_predictions = []

all_labels = []

correct = 0

total = 0


with torch.no_grad():

    for batch_index, (
        images,
        labels
    ) in enumerate(test_loader):

        images = images.to(
            device,
            non_blocking=True
        )

        labels = labels.to(
            device,
            non_blocking=True
        )


        # Forward pass

        outputs = model(images)


        # Get prediction

        _, predicted = torch.max(
            outputs,
            1
        )


        # Store predictions

        all_predictions.extend(
            predicted.cpu().numpy()
        )

        all_labels.extend(
            labels.cpu().numpy()
        )


        # Accuracy calculation

        total += labels.size(0)

        correct += (
            predicted == labels
        ).sum().item()


        # Progress

        if (
            (batch_index + 1) % 10 == 0
            or
            batch_index + 1 == len(test_loader)
        ):

            print(
                f"Processed "
                f"{batch_index + 1}/"
                f"{len(test_loader)} batches"
            )


# ============================================================
# TEST ACCURACY
# ============================================================

test_accuracy = (
    100 * correct / total
)


print("\n" + "=" * 60)

print("FINAL TEST RESULTS")

print("=" * 60)


print(
    f"\nTotal Test Images: "
    f"{total}"
)


print(
    f"Correct Predictions: "
    f"{correct}"
)


print(
    f"Incorrect Predictions: "
    f"{total - correct}"
)


print(
    f"\nOverall Test Accuracy: "
    f"{test_accuracy:.2f}%"
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 60)

print("CLASSIFICATION REPORT")

print("=" * 60)


print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=class_names,
        digits=4,
        zero_division=0
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

print("\n" + "=" * 60)

print("CONFUSION MATRIX")

print("=" * 60)


cm = confusion_matrix(
    all_labels,
    all_predictions
)


print("\nRows = Actual Class")
print("Columns = Predicted Class\n")


print("Classes:")

for index, class_name in enumerate(
    class_names
):
    print(
        f"{index}: {class_name}"
    )


print("\nConfusion Matrix:\n")

print(cm)


# ============================================================
# PER CLASS ACCURACY
# ============================================================

print("\n" + "=" * 60)

print("PER-CLASS ACCURACY")

print("=" * 60)


for index, class_name in enumerate(
    class_names
):

    class_total = (
        cm[index].sum()
    )

    class_correct = (
        cm[index][index]
    )


    class_accuracy = (
        100 *
        class_correct /
        class_total
    )


    print(
        f"{class_name}: "
        f"{class_accuracy:.2f}% "
        f"({class_correct}/"
        f"{class_total})"
    )


print("\n" + "=" * 60)

print("Evaluation Complete!")

print("=" * 60)