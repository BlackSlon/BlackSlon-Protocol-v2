#!/usr/bin/env python3
"""
BlackSlon Logo Color Generator
Generates different colored versions of the BlackSlon logo
"""

from PIL import Image, ImageEnhance
import os

def change_logo_color(input_path, output_path, target_color):
    """
    Change white pixels to target color while keeping black pixels unchanged
    """
    try:
        # Open the image
        img = Image.open(input_path)
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Get pixel data
        pixels = img.load()
        width, height = img.size
        
        # Convert target color hex to RGB
        if target_color.startswith('#'):
            target_color = target_color.lstrip('#')
            target_rgb = tuple(int(target_color[i:i+2], 16) for i in (0, 2, 4))
        else:
            target_rgb = target_color
        
        # Process each pixel
        for x in range(width):
            for y in range(height):
                r, g, b, a = pixels[x, y]
                
                # If pixel is white (or very light), change to target color
                if r > 240 and g > 240 and b > 240:
                    pixels[x, y] = (*target_rgb, a)
                # Keep black pixels unchanged
                elif r < 20 and g < 20 and b < 20:
                    pixels[x, y] = (r, g, b, a)
                # For gray pixels, blend with target color
                elif r > 100 and g > 100 and b > 100:
                    # Calculate blend factor based on how light the pixel is
                    blend_factor = (r + g + b) / (3 * 255)
                    new_r = int(r * (1 - blend_factor) + target_rgb[0] * blend_factor)
                    new_g = int(g * (1 - blend_factor) + target_rgb[1] * blend_factor)
                    new_b = int(b * (1 - blend_factor) + target_rgb[2] * blend_factor)
                    pixels[x, y] = (new_r, new_g, new_b, a)
        
        # Save the result as PNG to preserve transparency
        output_path_png = output_path.replace('.jpg', '.png')
        img.save(output_path_png, 'PNG')
        print(f"✅ Created: {output_path_png}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")
        return False

def main():
    # Define colors
    colors = {
        'yellow': '#EAB308',      # Energy/power
        'blue': '#3B82F6',        # Gas (blue-500 - jaskrawy niebieski z cen)
        'amber': '#B45309',       # €BSR
        'gray': '#6B7280',        # Order/User panels (gray-500)
    }
    
    # Input file
    input_file = 'public/BS_image.jpg'
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"❌ Input file not found: {input_file}")
        return
    
    # Generate colored versions
    for color_name, color_code in colors.items():
        output_file = f'public/BS{color_name}_image.png'
        print(f"🎨 Generating {color_name} version...")
        change_logo_color(input_file, output_file, color_code)
    
    print("\n🎉 All logo variations generated successfully!")
    print("Files created:")
    for color_name in colors.keys():
        print(f"  - public/BS{color_name}_image.png")

if __name__ == "__main__":
    main()
