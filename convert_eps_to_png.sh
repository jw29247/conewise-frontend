#!/bin/bash

# Script to convert all EPS files to PNG format
# Maintains directory structure from src/assets/signs to public/signs

SRC_DIR="/Users/jacobwhite/Desktop/Conewise Launch/conewise-frontend/src/assets/signs"
DEST_DIR="/Users/jacobwhite/Desktop/Conewise Launch/conewise-frontend/public/signs"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Counter for progress tracking
converted=0
failed=0
skipped=0
total=$(find "$SRC_DIR" -name "*.eps" -o -name "*.EPS" | wc -l | tr -d ' ')

echo "Starting conversion of $total EPS files..."
echo "Source: $SRC_DIR"
echo "Destination: $DEST_DIR"
echo "-----------------------------------"

# Find all EPS files (case insensitive)
find "$SRC_DIR" -name "*.eps" -o -name "*.EPS" | while read -r eps_file; do
    # Get relative path from source directory
    relative_path="${eps_file#$SRC_DIR/}"
    
    # Get directory path and filename
    dir_path=$(dirname "$relative_path")
    filename=$(basename "$eps_file")
    
    # Change extension to .png (handle both .eps and .EPS)
    png_filename="${filename%.[eE][pP][sS]}.png"
    
    # Full destination path
    dest_dir="$DEST_DIR/$dir_path"
    dest_file="$dest_dir/$png_filename"
    
    # Create destination directory if it doesn't exist
    mkdir -p "$dest_dir"
    
    # Check if PNG already exists
    if [ -f "$dest_file" ]; then
        echo "[$((converted + failed + skipped + 1))/$total] Skipping (already exists): $relative_path"
        ((skipped++))
    else
        echo "[$((converted + failed + skipped + 1))/$total] Converting: $relative_path -> $dir_path/$png_filename"
        
        # Convert EPS to PNG with ImageMagick
        # -density 300 for high quality
        # -resize 512x512 to ensure at least 256x256 (double for retina displays)
        # -background transparent for transparent background
        # -flatten to handle multi-layer EPS files
        if magick -density 300 "$eps_file" -resize 512x512 -background transparent -flatten "$dest_file" 2>/dev/null; then
            ((converted++))
        else
            echo "   ERROR: Failed to convert $relative_path"
            ((failed++))
        fi
    fi
done

echo "-----------------------------------"
echo "Conversion complete!"
echo "Successfully converted: $converted files"
echo "Failed: $failed files"
echo "Skipped (already existed): $skipped files"
echo "Total processed: $((converted + failed + skipped))/$total"

# List any failed conversions for review
if [ $failed -gt 0 ]; then
    echo ""
    echo "Failed conversions:"
    find "$SRC_DIR" -name "*.eps" -o -name "*.EPS" | while read -r eps_file; do
        relative_path="${eps_file#$SRC_DIR/}"
        dir_path=$(dirname "$relative_path")
        filename=$(basename "$eps_file")
        png_filename="${filename%.[eE][pP][sS]}.png"
        dest_file="$DEST_DIR/$dir_path/$png_filename"
        
        if [ ! -f "$dest_file" ] && [ ! -f "$dest_file" ]; then
            echo "  - $relative_path"
        fi
    done
fi