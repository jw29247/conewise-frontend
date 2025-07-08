#!/usr/bin/env python3
"""
Create placeholder PNG files for UK traffic signs
This creates simple placeholder images until proper conversion can be done
"""

import os
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def create_placeholder_sign(sign_code: str, category: str, output_path: Path, size: int = 256):
    """Create a placeholder PNG for a traffic sign"""
    # Create a new image with white background
    img = Image.new('RGB', (size, size), 'white')
    draw = ImageDraw.Draw(img)
    
    # Define colors based on category
    category_colors = {
        'warning': '#FFD700',  # Yellow
        'regulatory': '#FF0000',  # Red
        'information': '#0066CC',  # Blue
        'direction': '#008000',  # Green
        'motorway': '#0066CC',  # Blue
        'temporary': '#FFD700',  # Yellow
        'speed-limit': '#FF0000',  # Red
        'parking': '#0066CC',  # Blue
        'bus-and-cycle': '#0066CC',  # Blue
        'pedestrian': '#0066CC',  # Blue
        'level-crossing': '#FFD700',  # Yellow
        'low-bridge': '#FFD700',  # Yellow
        'tram': '#0066CC',  # Blue
        'traffic-calming': '#008000',  # Green
        'tidal-flow': '#0066CC',  # Blue
    }
    
    # Get color for category
    bg_color = 'white'
    border_color = 'black'
    for cat, color in category_colors.items():
        if cat in category.lower():
            border_color = color
            break
    
    # Draw border
    border_width = 10
    draw.rectangle(
        [(border_width, border_width), (size - border_width, size - border_width)],
        fill=bg_color,
        outline=border_color,
        width=border_width
    )
    
    # Draw sign code in center
    try:
        # Try to use a system font
        font_size = min(60, size // 4)
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw the sign code
    text = sign_code
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill='black', font=font)
    
    # Draw category name at bottom
    try:
        small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
    except:
        small_font = ImageFont.load_default()
    
    category_text = category.replace('-eps', '').replace('-', ' ').title()
    bbox = draw.textbbox((0, 0), category_text, font=small_font)
    cat_width = bbox[2] - bbox[0]
    
    draw.text(
        ((size - cat_width) // 2, size - 30),
        category_text,
        fill='gray',
        font=small_font
    )
    
    # Save the image
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, 'PNG', optimize=True, quality=95)

def main():
    print("Creating placeholder PNG files for UK traffic signs")
    print("===================================================")
    
    # Get directories
    script_dir = Path(__file__).parent.absolute()
    source_dir = script_dir / "src" / "assets" / "signs"
    output_dir = script_dir / "public" / "signs"
    
    # Load original mapping
    mapping_file = source_dir / "signMapping.json"
    with open(mapping_file, 'r') as f:
        original_mapping = json.load(f)
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create placeholders for the most common signs
    common_signs = [
        "501", "510", "516", "520", "530", "544", "554", "570", "601", "606", 
        "610", "615", "616", "617", "618", "619", "629", "638", "645", "660",
        "670", "670V30", "670V20", "670V40", "670V50", "7001", "7009", "7010",
        "7011", "7012", "7301", "954", "956", "957", "958", "816", "818", "820"
    ]
    
    created = 0
    
    for sign_code in common_signs:
        if sign_code in original_mapping:
            eps_path = original_mapping[sign_code]
            png_path = eps_path.replace('.eps', '.png').replace('.EPS', '.png')
            png_file = output_dir / png_path
            
            # Get category from path
            category = eps_path.split('/')[0]
            
            try:
                create_placeholder_sign(sign_code, category, png_file)
                print(f"✓ Created placeholder for {sign_code}")
                created += 1
            except Exception as e:
                print(f"✗ Failed to create placeholder for {sign_code}: {e}")
    
    # Generate PNG mapping
    print("\nGenerating PNG mapping file...")
    
    png_mapping = {}
    for code, eps_path in original_mapping.items():
        png_path = eps_path.replace('.eps', '.png').replace('.EPS', '.png')
        png_mapping[code] = f"/signs/{png_path}"
    
    # Write JSON mapping
    mapping_output = output_dir / "signMapping.json"
    with open(mapping_output, 'w') as f:
        json.dump(png_mapping, f, indent=2)
    
    print(f"✓ Created signMapping.json with {len(png_mapping)} entries")
    
    # Create TypeScript mapping
    ts_content = """// Auto-generated PNG sign mapping
// This file maps UK traffic sign codes to their PNG file paths in the public directory

export const pngSignMapping: Record<string, string> = """
    
    ts_content += json.dumps(png_mapping, indent=2) + ";\n"
    
    ts_output = source_dir / "pngSignMapping.ts"
    with open(ts_output, 'w') as f:
        f.write(ts_content)
    
    print(f"✓ Created TypeScript mapping file")
    
    print(f"\nCreated {created} placeholder PNG files")
    print("\nNOTE: These are placeholder images. For production use, you should:")
    print("1. Install Ghostscript: brew install ghostscript")
    print("2. Run the full conversion script")

if __name__ == "__main__":
    main()