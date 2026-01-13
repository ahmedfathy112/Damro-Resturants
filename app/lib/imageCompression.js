import imageCompression from "browser-image-compression";

/**
 * Compresses an image file before upload
 * @param {File} file - The original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.2, // 200KB
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: file.type, // Preserve original file type
    initialQuality: 0.8, // Initial compression quality
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    // Compress the image
    const compressedFile = await imageCompression(file, compressionOptions);

    // Preserve the original file name and extension
    const originalName = file.name;
    
    // Create a new File object with the original name but compressed content
    // This ensures the filename and extension are preserved
    const finalFile = new File([compressedFile], originalName, {
      type: file.type,
      lastModified: Date.now(),
    });

    return finalFile;
  } catch (error) {
    console.error("Image compression error:", error);
    // If compression fails, return original file
    throw new Error("فشل في ضغط الصورة: " + error.message);
  }
};
