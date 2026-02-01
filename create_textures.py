from PIL import Image
import numpy as np

img = Image.open('static/img/texture.png').convert('RGBA')
data = np.array(img)
gray = 0.299 * data[:,:,0] + 0.587 * data[:,:,1] + 0.114 * data[:,:,2]

# Blue version
blue_img = np.zeros_like(data)
blue_img[:,:,0] = (gray / 255 * 61).astype(np.uint8)
blue_img[:,:,1] = (gray / 255 * 75).astype(np.uint8)
blue_img[:,:,2] = (gray / 255 * 154).astype(np.uint8)
blue_img[:,:,3] = data[:,:,3]
Image.fromarray(blue_img).save('static/img/texture_blue.png')

# Red version
red_img = np.zeros_like(data)
red_img[:,:,0] = (gray / 255 * 193).astype(np.uint8)
red_img[:,:,1] = (gray / 255 * 58).astype(np.uint8)
red_img[:,:,2] = (gray / 255 * 58).astype(np.uint8)
red_img[:,:,3] = data[:,:,3]
Image.fromarray(red_img).save('static/img/texture_red.png')

print('Done')
