SPACING=300 && \
HEIGHT=42 && \
magick pill.png -resize x${HEIGHT} -gravity west -background transparent -extent ${SPACING}x${HEIGHT} pill-spaced.png && \
magick pill.png -resize x${HEIGHT} -gravity west -background transparent -extent ${SPACING}x${HEIGHT} -modulate 100,100,210 pill-blue-spaced-1.png && \
magick pill.png -resize x${HEIGHT} -gravity west -background transparent -extent ${SPACING}x${HEIGHT} -modulate 100,100,220 pill-blue-spaced-2.png && \
magick pill.png -resize x${HEIGHT} -gravity west -background transparent -extent ${SPACING}x${HEIGHT} -modulate 100,100,230 pill-blue-spaced-3.png && \
echo "Created with spacing: ${SPACING}px, height: ${HEIGHT}px"