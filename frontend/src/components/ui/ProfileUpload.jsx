import { useRef, useState } from "react";
import { Upload, Camera } from "lucide-react";
import axios from "axios";
import axiosClient from "../../utils/axiosClient"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../features/auth/authThunks";

const ProfileUpload = ({ profilePic }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const dispatch = useDispatch();

  const handleImageClick = () => {
    if (!uploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;
    setUploading(true);

    try {
      const signatureRes = await axiosClient.get(`/image/profile/upload`);

      const { signature, timestamp, public_id, api_key, upload_url } =
        signatureRes.data;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);
      console.log(formData);

      const cloudRes = await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(cloudRes);

      const { secure_url, public_id: cloudinaryPublicId } = cloudRes.data;

      await axiosClient.post("/image/profile/save", {
        cloudinaryPublicId,
        secureUrl: secure_url,
      });
         dispatch(fetchUserProfile())
      setUploadedUrl(secure_url);
      alert("Profile image uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center space-y-4 mt-10">
      <div
        className="w-32 h-32 rounded-full shadow-md overflow-hidden cursor-pointer hover:opacity-90 transition-all"
        onClick={handleImageClick}
      >
        <img
          src={
              previewUrl ||
            profilePic ||
            uploadedUrl ||
            "https://ui-avatars.com/api/?name=User&background=random"
          }
          alt="Profile Preview"
          className="w-full h-full object-cover"
        />
      </div>

        <Camera onClick={handleImageClick} className="cursor-pointer active:scale-95 hover:bg-blue-600 border border-white/50 rounded-full h-8 w-8 absolute right-1 z-10 bottom-2 text-white bg-black/50 backdrop-blur-2xl p-1"/>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile && !uploadedUrl &&  (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`absolute -bottom-5 right-0 text-sm px-2 py-1.5 rounded-lg text-white font-medium flex items-center gap-2 transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
         {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Save Profile
            </>
          )
        }  
        </button>
      )}  
    </div>
  );
};

export default ProfileUpload;
