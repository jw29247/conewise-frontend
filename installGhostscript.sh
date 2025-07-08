#!/bin/bash

# Script to install Ghostscript for proper EPS to PNG conversion

echo "Ghostscript Installation Helper"
echo "==============================="
echo ""
echo "Ghostscript is required to properly convert EPS files to PNG format."
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected macOS"
    echo ""
    
    # Check if Homebrew is installed
    if command -v brew &> /dev/null; then
        echo "Homebrew is installed. Installing Ghostscript..."
        echo "Running: brew install ghostscript"
        brew install ghostscript
    else
        echo "Homebrew is not installed."
        echo "Please install Homebrew first from: https://brew.sh"
        echo "Then run: brew install ghostscript"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Detected Linux"
    echo ""
    
    if command -v apt-get &> /dev/null; then
        # Debian/Ubuntu
        echo "Installing Ghostscript with apt-get..."
        echo "Running: sudo apt-get update && sudo apt-get install ghostscript"
        sudo apt-get update && sudo apt-get install ghostscript
    elif command -v yum &> /dev/null; then
        # RedHat/CentOS
        echo "Installing Ghostscript with yum..."
        echo "Running: sudo yum install ghostscript"
        sudo yum install ghostscript
    else
        echo "Could not detect package manager."
        echo "Please install Ghostscript manually for your distribution."
    fi
    
else
    echo "Unsupported operating system: $OSTYPE"
    echo "Please install Ghostscript manually."
fi

echo ""
echo "After installation, run ./convertEpsToPng.sh to convert all EPS files to PNG."