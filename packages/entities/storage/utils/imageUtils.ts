/**
 * Image Utilities
 * 
 * Reusable image processing logic for the data layer.
 * @package @features/data/domains/global/storage/utils
 */

/**
 * Resize options
 */
export interface ResizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Resize image to max dimensions while maintaining aspect ratio.
 * This function returns a File object.
 */
export const resizeImage = (
    file: File,
    options: ResizeOptions = {}
): Promise<File> => {
    const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.85,
        format = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Fill with white background to handle PNG transparency if outputting as JPEG
                if (format === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name, {
                            type: format,
                            lastModified: Date.now(),
                        }));
                    } else {
                        reject(new Error('Failed to create image blob'));
                    }
                }, format, quality);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export default {
    resizeImage,
};
