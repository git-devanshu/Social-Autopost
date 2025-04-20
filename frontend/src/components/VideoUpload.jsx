import { useState } from "react";
import {toast} from 'react-hot-toast';

export default function VideoUpload({onUpload, h, w}) {
    const [videoPreview, setVideoPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if(file){
            if (!file.type.includes("video/")) {
                alert("Please upload a video file");
                return;
            }
            setVideoPreview(URL.createObjectURL(file));
            uploadToCloudinary(file);
        }
    };

    const uploadToCloudinary = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_NAME);
        formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        formData.append("resource_type", "video");

        const toastId = toast.loading('Uploading Video, please don not refresh the page');

        try{
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dxksp15ir/video/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            toast.success('Video uploaded', {id : toastId});
            onUpload(data.secure_url);
            setUploading(false);
        } 
        catch(error){
            console.error("Video upload failed:", error);
            toast.error('Video upload failed', {id : toastId});
            setUploading(false);
        }
    };

    return (
        <div style={{
            width: `${w}px`,
            height: `${h}px`,
            border: "2px dashed gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: videoPreview ? "transparent" : "#f5f5f5"
        }}>
            <input
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                onChange={handleVideoChange}
                style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
            />
            
            {videoPreview ? (
                <video 
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                    <source src={videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                    {uploading ? (
                        <span style={{ color: "gray" }}>Uploading video...</span>
                    ) : (
                        <>
                            <span style={{ color: "gray", display: "block" }}>Click to upload Video</span>
                            <span style={{ color: "gray", fontSize: "0.8rem", display: "block", marginTop: "0.5rem" }}>
                                (MP4, MOV)
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}