from pathlib import Path

DATASET_PATH = Path("../dataset/Retinal Fundus Images")

splits = ["train", "val", "test"]

for split in splits:
    print(f"\n{'=' * 50}")
    print(f"{split.upper()} DATA")
    print('=' * 50)

    split_path = DATASET_PATH / split
    total = 0

    for class_folder in sorted(split_path.iterdir()):
        if class_folder.is_dir():
            image_count = len([
                f for f in class_folder.iterdir()
                if f.suffix.lower() in [".jpg", ".jpeg", ".png"]
            ])

            total += image_count
            print(f"{class_folder.name}: {image_count}")

    print(f"\nTOTAL {split.upper()} IMAGES: {total}")