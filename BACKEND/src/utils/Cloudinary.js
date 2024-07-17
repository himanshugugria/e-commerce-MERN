import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Multer setup to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: filename },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export { upload, uploadOnCloudinary };
