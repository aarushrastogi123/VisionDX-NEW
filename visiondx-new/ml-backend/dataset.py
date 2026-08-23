from pathlib import Path
from PIL import Image
from torch.utils.data import Dataset
from sklearn.model_selection import train_test_split


# Path to the original training dataset
DATASET_PATH = Path("../dataset/Retinal Fundus Images/train")


# Our 7 classes
CLASS_NAMES = sorted([
    folder.name
    for folder in DATASET_PATH.iterdir()
    if folder.is_dir()
])

# Convert class name → number
CLASS_TO_IDX = {
    class_name: index
    for index, class_name in enumerate(CLASS_NAMES)
}


class RetinalDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, index):
        image_path = self.image_paths[index]
        label = self.labels[index]

        # Open retinal image
        image = Image.open(image_path).convert("RGB")

        # Apply transformations
        if self.transform:
            image = self.transform(image)

        return image, label


def get_train_val_split(val_size=0.1, random_state=42):
    image_paths = []
    labels = []

    valid_extensions = {".jpg", ".jpeg", ".png"}

    # Go through every class folder
    for class_name in CLASS_NAMES:
        class_folder = DATASET_PATH / class_name

        for image_path in class_folder.iterdir():
            if image_path.suffix.lower() in valid_extensions:
                image_paths.append(str(image_path))
                labels.append(CLASS_TO_IDX[class_name])

    # Create stratified split
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        image_paths,
        labels,
        test_size=val_size,
        random_state=random_state,
        stratify=labels,
    )

    return (
        train_paths,
        val_paths,
        train_labels,
        val_labels,
    )


if __name__ == "__main__":
    (
        train_paths,
        val_paths,
        train_labels,
        val_labels,
    ) = get_train_val_split()

    print("Classes:")
    for name, index in CLASS_TO_IDX.items():
        print(f"{index}: {name}")

    print("\nDataset split:")
    print(f"Training images: {len(train_paths)}")
    print(f"Validation images: {len(val_paths)}")