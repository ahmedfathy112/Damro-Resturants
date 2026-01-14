import imageCompression from "browser-image-compression";

/**
 * Compresses an image file before upload (optimized for speed)
 * @param {File} file - The original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  // Skip compression if file is already small enough (< 300KB)
  if (file.size < 300 * 1024) {
    return file;
  }

  // Optimized compression settings for faster processing
  const defaultOptions = {
    maxSizeMB: 0.5, // Increased to 500KB for faster compression
    maxWidthOrHeight: 1920, // Increased resolution limit for faster processing
    useWebWorker: true,
    fileType: file.type,
    initialQuality: 0.85, // Slightly higher quality for faster compression
    alwaysKeepResolution: false, // Allow resizing for faster compression
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    // Compress the image with timeout protection
    const compressionPromise = imageCompression(file, compressionOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Compression timeout")), 10000)
    );

    const compressedFile = await Promise.race([
      compressionPromise,
      timeoutPromise,
    ]);

    // Preserve the original file name and extension
    const originalName = file.name;
    
    // Create a new File object with the original name but compressed content
    const finalFile = new File([compressedFile], originalName, {
      type: file.type,
      lastModified: Date.now(),
    });

    return finalFile;
  } catch (error) {
    console.error("Image compression error:", error);
    // If compression fails or times out, return original file
    if (error.message === "Compression timeout") {
      console.warn("Compression timed out, using original file");
      return file;
    }
    // For other errors, still return original file to allow upload to proceed
    console.warn("Compression failed, using original file:", error.message);
    return file;
  }
};
