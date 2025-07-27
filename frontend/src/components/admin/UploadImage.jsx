import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  FileImage,
  Play,
  HardDrive,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

function UploadImage({ problemId: propProblemId }) {
  const { problemId: paramProblemId } = useParams();
  const problemId = propProblemId || paramProblemId;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);

  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const selectedFile = watch("imageFile")?.[0];

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        const fileList = new DataTransfer();
        fileList.items.add(imageFile);
        setValue("imageFile", fileList.files);

        const previewUrl = URL.createObjectURL(imageFile);
        setSelectedFilePreview(previewUrl);
      }
    },
    [setValue]
  );

  const handleFileSelect = (files) => {
    if (files && files[0]) {
      const previewUrl = URL.createObjectURL(files[0]);
      setSelectedFilePreview(previewUrl);
    }
  };

  const clearSelectedFile = () => {
    setValue("imageFile", null);
    setSelectedFilePreview(null);
    if (selectedFilePreview) {
      URL.revokeObjectURL(selectedFilePreview);
    }
  };

  const onSubmit = async (data) => {
    const file = data.imageFile[0];
    console.log(file);

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      console.log(problemId);
      const signatureResponse = await axiosClient.get(
        `/image/upload/${problemId}`
      );

      const { signature, timestamp, public_id, api_key, upload_url } =
        signatureResponse.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      const metadataResponse = await axiosClient.post("/image/save", {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
      });

      setUploadedImage(metadataResponse.data.imageSolution);
      reset();
      setSelectedFilePreview(null);
    } catch (err) {
      console.error("Image upload error:", err);
      setError("root", {
        type: "manual",
        message:
          err.response?.data?.message ||
          "Image upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    register("imageFile", {
      required: "Please select an image file",
      validate: {
        isImage: (files) => {
          if (!files || !files[0]) return "Please select an image file";
          const file = files[0];
          return (
            file.type.startsWith("image/") || "Please select a valid image file"
          );
        },
        fileSize: (files) => {
          if (!files || !files[0]) return true;
          const file = files[0];
          const maxSize = 10 * 1024 * 1024; // 10MB
          return file.size <= maxSize || "Image must be less than 10MB";
        },
      },
    });
  }, [register]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 mt-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Image Solution
          </h1>
          <p className="text-gray-600">
            Share your solution with an image snapshot
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 scale-[1.02]"
                    : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    setValue("imageFile", e.target.files);
                    handleFileSelect(e.target.files);
                    clearErrors("imageFile");
                  }}
                />

                <div className="text-center">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <FileImage className="w-16 h-16 text-green-500" />
                          <CheckCircle className="w-6 h-6 text-green-500 absolute -top-1.5 -right-0 bg-white rounded-full" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatFileSize(selectedFile.size)} • Ready to upload
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSelectedFile();
                        }}
                        className="inline-flex btn btn-soft btn-error hover:text-white items-center px-3 py-1 text-sm text-error transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload
                        className={`w-16 h-16 transition-colors ${
                          isDragOver ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {isDragOver
                            ? "Drop your image here"
                            : "Choose image or drag & drop"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Supports JPG, PNG, WEBP up to 10MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Browse Files
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {errors.imageFile && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700 text-sm">
                    {errors.imageFile.message}
                  </p>
                </div>
              )}

              {errors.root && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700 text-sm">{errors.root.message}</p>
                </div>
              )}

              {selectedFile && selectedFilePreview && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-blue-500" />
                    Preview
                  </h3>
                  <img
                    src={selectedFilePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg bg-gray-100"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <HardDrive className="w-4 h-4 mr-2" />
                      Size: {formatFileSize(selectedFile.size)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FileImage className="w-4 h-4 mr-2" />
                      Type: {selectedFile.type}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className={`inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 transform ${
                    !selectedFile || uploading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {uploading && (
            <div className="border-t border-gray-100 bg-gray-50 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Uploading to cloud...
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Please don't close this page while uploading
                </p>
              </div>
            </div>
          )}

          {uploadedImage && (
            <div className="border-t border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Upload Successful!
                  </h3>
                  <div className="mt-3">
                    <NavLink
                      to={uploadedImage.secureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      View Image
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
