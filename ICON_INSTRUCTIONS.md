<!-- @format -->

# Creating App Icons for PWA

You'll need to create icon files in the following sizes for your PWA to work on all devices:

## Required Icons:

1. **favicon.ico** - 64x64, 32x32, 24x24, 16x16
2. **logo192.png** - 192x192 pixels (for Android home screen)
3. **logo512.png** - 512x512 pixels (for splash screen)

## Quick Icon Generation Options:

### Option 1: Using Online Tools

- Go to https://realfavicongenerator.net/
- Upload your Athletics logo
- Download the generated icon pack
- Place files in the `public/` folder

### Option 2: Using ImageMagick (Command Line)

If you have a source image (e.g., `athletics-logo.png`), run:

```bash
# Install ImageMagick first: brew install imagemagick (macOS)
cd public/

# Create 192x192 icon
convert athletics-logo.png -resize 192x192 logo192.png

# Create 512x512 icon
convert athletics-logo.png -resize 512x512 logo512.png

# Create favicon
convert athletics-logo.png -resize 64x64 favicon.ico
```

### Option 3: Using Design Software

- Create a square image with your Athletics logo
- Background: Green (#1b5e20) with Gold (#ffd700) logo
- Export as PNG in the sizes listed above

## Suggested Design:

- Background: Athletics green (#1b5e20)
- Logo/Icon: Gold baseball/softball (#ffd700)
- Text: "A" or team mascot if applicable

Once you add the icons, your PWA will be complete!
