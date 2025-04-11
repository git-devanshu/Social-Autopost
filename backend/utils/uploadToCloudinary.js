const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadVideoToCloudinary = async (buffer) => {
    try{
        const b64 = buffer.toString('base64');
        const dataURI = `data:video/mp4;base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "video",
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });

        return result.secure_url;
    } 
    catch(error){
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload video to Transcoded video');
    }
};

module.exports = {uploadVideoToCloudinary};