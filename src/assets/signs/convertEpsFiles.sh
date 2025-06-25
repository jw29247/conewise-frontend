#!/bin/bash

# Script to convert EPS files to PNG format for web use
# Requires ImageMagick or Ghostscript to be installed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}UK Traffic Sign EPS to PNG Converter${NC}"
echo "======================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed.${NC}"
    echo "Please install ImageMagick first:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Create output directory
OUTPUT_DIR="./png-converted"
mkdir -p "$OUTPUT_DIR"

# Counter
converted=0
failed=0

# Function to convert a single EPS file
convert_eps_to_png() {
    local eps_file=$1
    local rel_path=${eps_file#./}
    local output_path="$OUTPUT_DIR/$rel_path"
    local output_file="${output_path%.eps}.png"
    local output_file="${output_file%.EPS}.png"
    
    # Create directory structure
    mkdir -p "$(dirname "$output_file")"
    
    # Convert EPS to PNG with high quality
    if convert -density 300 "$eps_file" -resize 512x512 -background white -alpha remove "$output_file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Converted: $rel_path"
        ((converted++))
    else
        echo -e "${RED}✗${NC} Failed: $rel_path"
        ((failed++))
    fi
}

# Find all EPS files and convert them
echo "Starting conversion..."
echo ""

# Export function for use with find -exec
export -f convert_eps_to_png
export OUTPUT_DIR
export RED GREEN BLUE NC
export converted failed

# Find and convert all EPS files
find . -type f \( -name "*.eps" -o -name "*.EPS" \) -print0 | while IFS= read -r -d '' file; do
    convert_eps_to_png "$file"
done

echo ""
echo "======================================="
echo -e "${GREEN}Conversion complete!${NC}"
echo "Converted: $converted files"
echo "Failed: $failed files"
echo "Output directory: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review the converted PNG files"
echo "2. Copy them to your public/assets directory"
echo "3. Update the TrafficSign component to use PNG files"