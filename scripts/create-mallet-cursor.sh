#!/bin/bash
# Create mallet cursor for glockenspiel
# This script generates a simple mallet/drumstick cursor icon

cd "$(dirname "$0")/../static/img"

# Size of the cursor (32x32 is standard, 64x64 for larger)
SIZE=32
LARGE_SIZE=64

# Colors
HANDLE_COLOR="#8B4513"  # Saddle brown for wooden handle
HEAD_COLOR="#FFD700"    # Gold for mallet head
OUTLINE_COLOR="#5D3A1A" # Dark brown outline

# Create standard size mallet cursor (32x32)
magick -size ${SIZE}x${SIZE} xc:transparent \
    -fill "${HANDLE_COLOR}" -stroke "${OUTLINE_COLOR}" -strokewidth 1 \
    -draw "line 8,24 24,8" \
    -draw "line 9,25 25,9" \
    -draw "line 10,26 26,10" \
    -fill "${HEAD_COLOR}" -stroke "${OUTLINE_COLOR}" -strokewidth 1 \
    -draw "circle 26,6 30,6" \
    mallet-cursor.png

echo "Created mallet-cursor.png (${SIZE}x${SIZE})"

# Create large size mallet cursor (64x64) for desktop hover
magick -size ${LARGE_SIZE}x${LARGE_SIZE} xc:transparent \
    -fill "${HANDLE_COLOR}" -stroke "${OUTLINE_COLOR}" -strokewidth 2 \
    -draw "line 16,48 48,16" \
    -draw "line 18,50 50,18" \
    -draw "line 20,52 52,20" \
    -fill "${HEAD_COLOR}" -stroke "${OUTLINE_COLOR}" -strokewidth 2 \
    -draw "circle 52,12 60,12" \
    mallet-cursor-large.png

echo "Created mallet-cursor-large.png (${LARGE_SIZE}x${LARGE_SIZE})"

# Alternative: Create from an emoji or existing image
# magick -background transparent -fill black -font "Apple Color Emoji" -pointsize 32 label:"🔨" mallet-cursor.png

echo "Done! Cursors created in static/img/"
