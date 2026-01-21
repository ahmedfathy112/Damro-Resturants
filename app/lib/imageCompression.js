import imageCompression from "browser-image-compression";

/**
 * Compresses an image file before upload (optimized for speed)
 * @param {File} file - The original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  
  if (file.size < 200 * 1024) {
    return file;
  }

  const defaultOptions = {
    maxSizeMB: 0.3, 
    maxWidthOrHeight: 1024, 
    useWebWorker: true,
    fileType: 'image/webp', 
    initialQuality: 0.75, 
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    
    const compressionPromise = imageCompression(file, compressionOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Compression timeout")), 30000)
    );

    const compressedFile = await Promise.race([
      compressionPromise,
      timeoutPromise,
    ]);

    return new File([compressedFile], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
      type: 'image/webp',
      lastModified: Date.now(),
    });

  } catch (error) {
    console.error("Image compression error:", error);
    
    
    if (file.size > 2 * 1024 * 1024) {
       throw new Error("الصورة حجمها كبير جداً وفشلنا في ضغطها، حاول اختيار صورة أصغر");
    }
    
    return file;
  }
};
