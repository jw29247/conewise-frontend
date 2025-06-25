#!/bin/bash

# Script to convert EPS files to PNG format for web use
# Requires ImageMagick or Ghostscript to be installed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}UK Traffic Sign EPS to PNG Converter${NC}"
echo "======================================="

# Check if ImageMagick is installed
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick convert"
elif command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
else
    echo -e "${RED}Error: ImageMagick is not installed.${NC}"
    echo "Please install ImageMagick first:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

echo -e "${GREEN}Found ImageMagick: using '$CONVERT_CMD'${NC}"

# Set directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SOURCE_DIR="$SCRIPT_DIR/src/assets/signs"
OUTPUT_DIR="$SCRIPT_DIR/public/signs"

echo -e "${BLUE}Source directory:${NC} $SOURCE_DIR"
echo -e "${BLUE}Output directory:${NC} $OUTPUT_DIR"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter
converted=0
failed=0
skipped=0

# Function to convert a single EPS file
convert_eps_to_png() {
    local eps_file=$1
    local rel_path="${eps_file#$SOURCE_DIR/}"
    local output_path="$OUTPUT_DIR/$rel_path"
    local output_file="${output_path%.eps}.png"
    local output_file="${output_file%.EPS}.png"
    
    # Skip if PNG already exists and is newer than source
    if [ -f "$output_file" ] && [ "$output_file" -nt "$eps_file" ]; then
        echo -e "${YELLOW}⊝${NC} Skipping (up-to-date): $rel_path"
        ((skipped++))
        return
    fi
    
    # Create directory structure
    mkdir -p "$(dirname "$output_file")"
    
    # Convert EPS to PNG with high quality
    # -density 300: Use 300 DPI for high quality
    # -resize 512x512: Resize to max 512px while maintaining aspect ratio
    # -background white: White background for signs
    # -alpha remove: Remove alpha channel
    # -quality 95: High quality PNG compression
    if $CONVERT_CMD -density 300 "$eps_file" \
               -resize 512x512 \
               -background white \
               -alpha remove \
               -quality 95 \
               "$output_file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Converted: $rel_path"
        ((converted++))
    else
        echo -e "${RED}✗${NC} Failed: $rel_path"
        ((failed++))
    fi
}

# Export function and variables for parallel processing
export -f convert_eps_to_png
export SOURCE_DIR OUTPUT_DIR CONVERT_CMD
export RED GREEN BLUE YELLOW NC
export converted failed skipped

echo ""
echo "Starting conversion..."
echo ""

# Find and convert all EPS files
find "$SOURCE_DIR" -type f \( -name "*.eps" -o -name "*.EPS" \) -print0 | while IFS= read -r -d '' file; do
    convert_eps_to_png "$file"
done

# Generate mapping JSON for PNG files
echo ""
echo -e "${BLUE}Generating PNG mapping file...${NC}"

# Create the mapping JSON
node -e "
const fs = require('fs');
const path = require('path');

// Read the original mapping
const originalMapping = JSON.parse(fs.readFileSync('$SOURCE_DIR/signMapping.json', 'utf8'));

// Create new mapping with PNG paths
const pngMapping = {};
for (const [code, epsPath] of Object.entries(originalMapping)) {
    // Convert EPS path to PNG path
    let pngPath = epsPath.replace(/\.eps$/i, '.png');
    // Add /signs/ prefix for public directory
    pngPath = '/signs/' + pngPath;
    pngMapping[code] = pngPath;
}

// Write the new mapping
fs.writeFileSync('$OUTPUT_DIR/signMapping.json', JSON.stringify(pngMapping, null, 2));
console.log('✓ Created signMapping.json with ' + Object.keys(pngMapping).length + ' entries');
"

# Create TypeScript mapping file
echo -e "${BLUE}Creating TypeScript mapping file...${NC}"

cat > "$SOURCE_DIR/pngSignMapping.ts" << 'EOF'
// Auto-generated PNG sign mapping
// This file maps UK traffic sign codes to their PNG file paths in the public directory

export const pngSignMapping: Record<string, string> = 
EOF

# Append the JSON content
echo "$(cat $OUTPUT_DIR/signMapping.json);" >> "$SOURCE_DIR/pngSignMapping.ts"

echo ""
echo "======================================="
echo -e "${GREEN}Conversion complete!${NC}"
echo "Converted: $converted files"
echo "Failed: $failed files"
echo "Skipped: $skipped files (already up-to-date)"
echo ""
echo "Output directory: $OUTPUT_DIR"
echo "Mapping file: $OUTPUT_DIR/signMapping.json"
echo "TypeScript mapping: $SOURCE_DIR/pngSignMapping.ts"
echo ""
echo "Next steps:"
echo "1. Review the converted PNG files"
echo "2. Update your TrafficSign component to use pngSignMapping"
echo "3. Test the sign display in your application"