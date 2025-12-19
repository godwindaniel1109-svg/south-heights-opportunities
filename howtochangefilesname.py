

import os
from pathlib import Path

# Define the directory path using a raw string literal (r'')
directory_path = r'C:\Users\HP\Desktop\my-project-folder\just-testin'

# Iterate over items in the specified directory using pathlib.Path.iterdir()
for file_path in Path(directory_path).iterdir():
    # Skip directories, only process files
    if file_path.is_file():
        # Get the parts of the filename
        f_name = file_path.stem  # Filename without extension
        f_ext = file_path.suffix  # File extension (e.g., '.txt')
        
        # Use a try-except block to gracefully handle files that don't match the expected format
        try:
            # Assumes format: Title - Course - #Num
            # Example: 'Intro to Python - CS101 - #5'
            f_title, f_course, f_num_raw = f_name.split(' - ')
            
            # Process the parts as you specified
            # f_num_raw might be '#5', so we strip the '#' and pad to '05'
            f_num = f_num_raw.strip('#').zfill(2) 
            
            # Construct the new filename structure: '05-Intro to Python.txt'
            new_name = f'{f_num}-{f_title}{f_ext}'
            
            # Construct the full new path
            new_file_path = file_path.with_name(new_name)
            
            # Rename the file using the full paths
            file_path.rename(new_file_path)
            print(f'Renamed: {file_path.name} -> {new_file_path.name}')

        except ValueError:
            print(f"Skipping file due to incorrect format: {file_path.name}")
            continue
