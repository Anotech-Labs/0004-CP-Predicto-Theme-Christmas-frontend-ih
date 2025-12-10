import os
from PIL import Image

# Define the folder path containing the images
folder_path = r"D:\demo"

# Supported input file extensions
input_extensions = ('.jpg', '.jpeg', '.png')

# Iterate over all files in the folder
for file_name in os.listdir(folder_path):
    # Check if the file is an image with a supported extension
    if file_name.lower().endswith(input_extensions):
        # Create the full file path
        file_path = os.path.join(folder_path, file_name)
        
        # Open the image
        with Image.open(file_path) as img:
            # Convert the file name to .webp extension
            webp_file_name = os.path.splitext(file_name)[0] + ".webp"
            webp_file_path = os.path.join(folder_path, webp_file_name)
            
            # Save the image as .webp
            img.save(webp_file_path, "WEBP")
        
        # Remove the original image file
        os.remove(file_path)
        
        print(f"Converted and removed {file_name}")