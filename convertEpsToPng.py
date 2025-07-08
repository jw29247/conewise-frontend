#!/usr/bin/env python3
"""
Convert EPS files to PNG format for web use
This script converts UK traffic sign EPS files to PNG format
"""

import os
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Tuple

# Try to import Pillow
try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

# Colors for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'

def print_colored(message: str, color: str = Colors.END):
    """Print colored message to terminal"""
    print(f"{color}{message}{Colors.END}")

def check_ghostscript():
    """Check if Ghostscript is installed"""
    try:
        subprocess.run(['gs', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def convert_with_ghostscript(eps_file: Path, png_file: Path, size: int = 512) -> bool:
    """Convert EPS to PNG using Ghostscript"""
    try:
        # Create parent directory if it doesn't exist
        png_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Ghostscript command
        cmd = [
            'gs',
            '-dNOPAUSE',
            '-dBATCH',
            '-dSAFER',
            '-sDEVICE=png16m',
            f'-r{300}',  # 300 DPI
            f'-sOutputFile={png_file}',
            '-dEPSCrop',
            str(eps_file)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            # Resize if needed using PIL
            if HAS_PIL:
                try:
                    img = Image.open(png_file)
                    img.thumbnail((size, size), Image.Resampling.LANCZOS)
                    img.save(png_file, 'PNG', optimize=True, quality=95)
                except Exception:
                    pass  # Keep original if resize fails
            return True
        else:
            print(f"Ghostscript error: {result.stderr}")
            return False
    except Exception as e:
        print(f"Error converting {eps_file}: {e}")
        return False

def convert_with_imagemagick(eps_file: Path, png_file: Path, size: int = 512) -> bool:
    """Convert EPS to PNG using ImageMagick"""
    try:
        # Create parent directory if it doesn't exist
        png_file.parent.mkdir(parents=True, exist_ok=True)
        
        # ImageMagick command
        cmd = [
            'convert',
            '-density', '300',
            str(eps_file),
            '-resize', f'{size}x{size}',
            '-background', 'white',
            '-alpha', 'remove',
            '-quality', '95',
            str(png_file)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.returncode == 0
    except Exception as e:
        print(f"Error converting {eps_file}: {e}")
        return False

def main():
    print_colored("UK Traffic Sign EPS to PNG Converter", Colors.BLUE)
    print("=======================================")
    
    # Check available tools
    has_gs = check_ghostscript()
    has_im = False
    try:
        subprocess.run(['convert', '--version'], capture_output=True, check=True)
        has_im = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    if not has_gs and not has_im:
        print_colored("Error: Neither Ghostscript nor ImageMagick is installed.", Colors.RED)
        print("\nPlease install one of the following:")
        print("  Ghostscript:")
        print("    macOS: brew install ghostscript")
        print("    Ubuntu: sudo apt-get install ghostscript")
        print("\n  ImageMagick:")
        print("    macOS: brew install imagemagick")
        print("    Ubuntu: sudo apt-get install imagemagick")
        sys.exit(1)
    
    # Determine which tool to use
    if has_im:
        print_colored("Using ImageMagick for conversion", Colors.GREEN)
        convert_func = convert_with_imagemagick
    else:
        print_colored("Using Ghostscript for conversion", Colors.GREEN)
        convert_func = convert_with_ghostscript
    
    # Get directories
    script_dir = Path(__file__).parent.absolute()
    source_dir = script_dir / "src" / "assets" / "signs"
    output_dir = script_dir / "public" / "signs"
    
    print(f"Source directory: {source_dir}")
    print(f"Output directory: {output_dir}")
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load original mapping
    mapping_file = source_dir / "signMapping.json"
    with open(mapping_file, 'r') as f:
        original_mapping = json.load(f)
    
    # Convert files
    converted = 0
    failed = 0
    skipped = 0
    
    print("\nStarting conversion...")
    
    for sign_code, eps_path in original_mapping.items():
        eps_file = source_dir / eps_path
        png_path = eps_path.replace('.eps', '.png').replace('.EPS', '.png')
        png_file = output_dir / png_path
        
        # Skip if PNG already exists and is newer than source
        if png_file.exists() and png_file.stat().st_mtime > eps_file.stat().st_mtime:
            print_colored(f"⊝ Skipping (up-to-date): {eps_path}", Colors.YELLOW)
            skipped += 1
            continue
        
        if convert_func(eps_file, png_file):
            print_colored(f"✓ Converted: {eps_path}", Colors.GREEN)
            converted += 1
        else:
            print_colored(f"✗ Failed: {eps_path}", Colors.RED)
            failed += 1
    
    # Generate PNG mapping
    print("\n" + Colors.BLUE + "Generating PNG mapping file..." + Colors.END)
    
    png_mapping = {}
    for code, eps_path in original_mapping.items():
        png_path = eps_path.replace('.eps', '.png').replace('.EPS', '.png')
        png_mapping[code] = f"/signs/{png_path}"
    
    # Write JSON mapping
    mapping_output = output_dir / "signMapping.json"
    with open(mapping_output, 'w') as f:
        json.dump(png_mapping, f, indent=2)
    
    print_colored(f"✓ Created signMapping.json with {len(png_mapping)} entries", Colors.GREEN)
    
    # Create TypeScript mapping
    print_colored("Creating TypeScript mapping file...", Colors.BLUE)
    
    ts_content = """// Auto-generated PNG sign mapping
// This file maps UK traffic sign codes to their PNG file paths in the public directory

export const pngSignMapping: Record<string, string> = """
    
    ts_content += json.dumps(png_mapping, indent=2) + ";\n"
    
    ts_output = source_dir / "pngSignMapping.ts"
    with open(ts_output, 'w') as f:
        f.write(ts_content)
    
    # Summary
    print("\n=======================================")
    print_colored("Conversion complete!", Colors.GREEN)
    print(f"Converted: {converted} files")
    print(f"Failed: {failed} files")
    print(f"Skipped: {skipped} files (already up-to-date)")
    print(f"\nOutput directory: {output_dir}")
    print(f"Mapping file: {mapping_output}")
    print(f"TypeScript mapping: {ts_output}")
    print("\nNext steps:")
    print("1. Review the converted PNG files")
    print("2. Update your TrafficSign component to use pngSignMapping")
    print("3. Test the sign display in your application")

if __name__ == "__main__":
    main()