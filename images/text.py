import os
from PIL import Image

# Directory containing images
input_dir = "./"
output_dir = "./"
quality = 75  # Adjust for compression level

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Supported input formats
valid_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".tiff")

# Loop through all files in the folder
for filename in os.listdir(input_dir):
    if filename.lower().endswith(valid_extensions):
        input_path = os.path.join(input_dir, filename)
        output_filename = os.path.splitext(filename)[0] + ".webp"
        output_path = os.path.join(output_dir, output_filename)

        try:
            with Image.open(input_path) as img:
                if img.mode in ("RGBA", "P", "CMYK"):
                    img = img.convert("RGB")
                img.save(output_path, format="webp", quality=quality, method=6)
                original_size = os.path.getsize(input_path) / 1024
                new_size = os.path.getsize(output_path) / 1024
                print(f" {filename}: {original_size:.1f} KB → {new_size:.1f} KB")
        except Exception as e:
            print(f" Failed to convert {filename}: {e}")
