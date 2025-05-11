export const uploadImage = async (file: File): Promise<string> => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.secure_url as string; // This is the image URL on Cloudinary
};
