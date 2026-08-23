import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights


NUM_CLASSES = 7


def create_model():
    # Load ResNet50 with ImageNet pretrained weights
    model = resnet50(
        weights=ResNet50_Weights.IMAGENET1K_V2
    )

    # Replace the final classification layer
    model.fc = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(
            model.fc.in_features,
            NUM_CLASSES
        )
    )

    return model


if __name__ == "__main__":
    model = create_model()

    print(model)