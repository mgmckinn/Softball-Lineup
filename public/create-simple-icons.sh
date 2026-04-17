#!/bin/bash
# Create simple placeholder icon files using ImageMagick or base64 encoded PNGs

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create icons..."
    
    # Create 192x192 icon
    convert -size 192x192 xc:"#1b5e20" \
        -fill "#ffd700" -draw "circle 96,96 96,32" \
        -fill "#1b5e20" -font Arial-Bold -pointsize 120 \
        -gravity center -annotate +0+0 "A" \
        logo192.png
    
    # Create 512x512 icon
    convert -size 512x512 xc:"#1b5e20" \
        -fill "#ffd700" -draw "circle 256,256 256,85" \
        -fill "#1b5e20" -font Arial-Bold -pointsize 320 \
        -gravity center -annotate +0+0 "A" \
        logo512.png
    
    # Create favicon
    convert -size 64x64 xc:"#1b5e20" \
        -fill "#ffd700" -draw "circle 32,32 32,11" \
        -fill "#1b5e20" -font Arial-Bold -pointsize 40 \
        -gravity center -annotate +0+0 "A" \
        favicon.ico
    
    echo "✅ Icons created successfully!"
else
    echo "❌ ImageMagick not found"
    echo "Install with: brew install imagemagick"
    echo "Or use the Python script after: pip3 install pillow"
fi
