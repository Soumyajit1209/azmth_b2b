"use client"

import React, { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Upload, File, Send, Link, X, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

interface UploadStatus {
  message: string
  isSuccess: boolean
}

const DocumentUploadPage: React.FC = () => {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadUrl, setUploadUrl] = useState<string>("")
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null)
  const [uploadType, setUploadType] = useState<"file" | "url">("file")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "image/jpeg",
    "image/png",
  ]

  const getFileTypeLabel = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      "application/pdf": "PDF",
      "application/msword": "DOC",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
      "application/vnd.ms-excel": "XLS",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
      "application/vnd.ms-powerpoint": "PPT",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
      "text/plain": "TXT",
      "text/csv": "CSV",
      "image/jpeg": "JPG",
      "image/png": "PNG",
    }

    return typeMap[type] || "Unknown"
  }

  const getFileIcon = (type: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      "application/pdf": <FilePdfIcon />,
      "application/msword": <FileDocIcon />,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <FileDocIcon />,
      "application/vnd.ms-excel": <FileExcelIcon />,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FileExcelIcon />,
      "application/vnd.ms-powerpoint": <FilePptIcon />,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": <FilePptIcon />,
      "text/plain": <FileTextIcon />,
      "text/csv": <FileExcelIcon />,
      "image/jpeg": <FileImageIcon />,
      "image/png": <FileImageIcon />,
    }

    return iconMap[type] || <File className="h-8 w-8 text-blue-400" />
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    handleSelectedFile(file)
  }

  const handleSelectedFile = (file: File | undefined) => {
    if (file && acceptedFileTypes.includes(file.type)) {
      setSelectedFile(file)
      setUploadStatus(null)
    } else if (file) {
      setSelectedFile(null)
      setUploadStatus({
        message: "Please select a supported document type",
        isSuccess: false,
      })
    }
  }

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadUrl(event.target.value)
    setUploadStatus(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (uploadType === "file") {
      await handleFileUpload()
    } else {
      await handleUrlUpload()
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        message: "No file selected",
        isSuccess: false,
      })
      return
    }

    try {
      setIsUploading(true)
      setUploadStatus({
        message: "Uploading...",
        isSuccess: false,
      })

      // Get the JWT token from Clerk
      const token = await getToken()

      const formData = new FormData()
      formData.append("document", selectedFile)

      // Add user information to the form data
      if (user) {
        formData.append("userId", user.id)
        formData.append("username", user.username || user.firstName || "")
      }

      const response = await fetch("/api/upload-document", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        setUploadStatus({
          message: "File uploaded successfully!",
          isSuccess: true,
        })
        setSelectedFile(null)
      } else {
        setUploadStatus({
          message: "Upload failed. Please try again.",
          isSuccess: false,
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus({
        message: "Upload failed. Network error.",
        isSuccess: false,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlUpload = async () => {
    if (!uploadUrl || !uploadUrl.trim()) {
      setUploadStatus({
        message: "Please enter a valid URL",
        isSuccess: false,
      })
      return
    }

    // Basic URL validation
    try {
      new URL(uploadUrl)
    } catch (e) {
      setUploadStatus({
        message: "Please enter a valid URL",
        isSuccess: false,
      })
      return
    }

    try {
      setIsUploading(true)
      setUploadStatus({
        message: "Processing URL...",
        isSuccess: false,
      })

      // Get the JWT token from Clerk
      const token = await getToken()

      const response = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: uploadUrl,
          userId: user?.id,
          username: user?.username || user?.firstName || "",
        }),
      })

      if (response.ok) {
        setUploadStatus({
          message: "URL document processed successfully!",
          isSuccess: true,
        })
        setUploadUrl("")
      } else {
        setUploadStatus({
          message: "Failed to process URL. Please try again.",
          isSuccess: false,
        })
      }
    } catch (error) {
      console.error("URL processing error:", error)
      setUploadStatus({
        message: "Processing failed. Network error.",
        isSuccess: false,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearSelection = () => {
    if (uploadType === "file") {
      setSelectedFile(null)
    } else {
      setUploadUrl("")
    }
    setUploadStatus(null)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    onDrop: (acceptedFiles) => {
      handleSelectedFile(acceptedFiles[0])
    },
    onDropRejected: (error) => {
      console.log(error)
      setUploadStatus({
        message: "Please select a supported document type",
        isSuccess: false,
      })
    },
  })

  const mainVariant = {
    initial: {
      x: 0,
      y: 0,
    },
    animate: {
      x: 20,
      y: -20,
      opacity: 0.9,
    },
  }

  const secondaryVariant = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 w-full max-w-2xl">
          {/* Header section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <File className="mr-3" />
              Document Upload
            </h2>
            <p className="text-blue-100 mt-2">Upload files or provide URLs for processing</p>
          </div>
          
          {/* Main content */}
          <div className="p-6">
            {/* Upload type selector */}
            <div className="flex mb-8 bg-gray-900/50 rounded-lg p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setUploadType("file")}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition-all ${
                  uploadType === "file" 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" 
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <Upload className="mr-2 h-5 w-5" />
                File Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadType("url")}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition-all ${
                  uploadType === "url" 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" 
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <Link className="mr-2 h-5 w-5" />
                URL Import
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {uploadType === "file" ? (
                  <motion.div 
                    key="file-upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    {/* Aceternity UI for file upload */}
                    <div className="w-full" {...getRootProps()}>
                      <motion.div
                        onClick={handleClick}
                        whileHover="animate"
                        className={cn(
                          "group/file block rounded-xl cursor-pointer w-full relative overflow-hidden",
                          "bg-gradient-to-b from-gray-800 to-gray-900",
                          "border-2 border-dashed",
                          isDragActive 
                            ? "border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                            : "border-gray-600 hover:border-blue-500",
                          "transition-all duration-300"
                        )}
                      >
                        <input
                          ref={fileInputRef}
                          id="document-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        
                        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-40">
                          <GridPattern />
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-8">
                          <div className="relative w-full max-w-xl mx-auto">
                            {selectedFile ? (
                              <motion.div
                                layoutId="file-upload"
                                className={cn(
                                  "relative overflow-hidden z-40",
                                  "bg-gradient-to-b from-gray-700 to-gray-800",
                                  "rounded-xl border border-gray-600",
                                  "shadow-lg"
                                )}
                              >
                                <div className="p-5">
                                  <div className="flex items-center gap-4">
                                    {getFileIcon(selectedFile.type)}
                                    
                                    <div className="flex-1">
                                      <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="text-base font-medium text-white truncate max-w-xs"
                                      >
                                        {selectedFile.name}
                                      </motion.p>
                                      
                                      <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          layout
                                          className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-medium"
                                        >
                                          {getFileTypeLabel(selectedFile.type)}
                                        </motion.span>
                                        
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          layout
                                          className="text-xs text-gray-400"
                                        >
                                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </motion.span>
                                        
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          layout
                                          className="text-xs text-gray-400"
                                        >
                                          Modified: {new Date(selectedFile.lastModified).toLocaleDateString()}
                                        </motion.span>
                                      </div>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={clearSelection}
                                      className="text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <>
                                <motion.div
                                  layoutId="file-upload"
                                  variants={mainVariant}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  }}
                                  className={cn(
                                    "relative group-hover/file:shadow-2xl z-40",
                                    "bg-gradient-to-b from-blue-600/10 to-blue-800/10",
                                    "border border-gray-700 group-hover/file:border-blue-500/50",
                                    "flex flex-col items-center justify-center py-12 px-4",
                                    "mx-auto rounded-xl transition-all duration-300"
                                  )}
                                >
                                  {isDragActive ? (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="text-blue-300 flex flex-col items-center"
                                    >
                                      <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                                        <Upload className="h-8 w-8 text-blue-400" />
                                      </div>
                                      <p className="text-lg font-medium mb-1">Drop to Upload</p>
                                      <p className="text-sm text-gray-400">Release to add your document</p>
                                    </motion.div>
                                  ) : (
                                    <div className="flex flex-col items-center text-gray-300">
                                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover/file:bg-blue-500/20 transition-colors">
                                        <Upload className="h-8 w-8 text-blue-400" />
                                      </div>
                                      <p className="text-lg font-medium mb-1">Select a Document</p>
                                      <p className="text-sm text-gray-400">Drag & drop files or click to browse</p>
                                    </div>
                                  )}
                                </motion.div>

                                <motion.div
                                  variants={secondaryVariant}
                                  className="absolute opacity-0 border border-dashed border-blue-400 inset-0 z-30 bg-transparent rounded-xl"
                                ></motion.div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {["PDF", "DOC", "XLSX", "PPT", "TXT", "CSV", "JPG", "PNG"].map((format) => (
                        <span key={format} className="text-xs text-gray-400 px-2 py-1 rounded-full bg-gray-700/50">
                          {format}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="url-upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                      <div className="relative mb-5">
                        <div className="absolute left-3 top-3.5 text-gray-400">
                          <ExternalLink size={18} />
                        </div>
                        <input
                          type="url"
                          value={uploadUrl}
                          onChange={handleUrlChange}
                          placeholder="Enter document URL"
                          className={cn(
                            "w-full bg-gray-900/50 backdrop-blur-sm",
                            "border border-gray-700 focus:border-blue-500",
                            "rounded-lg p-3 pl-10 pr-10",
                            "text-gray-200 placeholder-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                            "transition-all duration-200"
                          )}
                        />
                        {uploadUrl && (
                          <button
                            type="button"
                            onClick={clearSelection}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <AlertCircle size={16} className="mr-2 text-blue-400" />
                        Enter the URL of a document to process (PDF, DOC, web page, etc.)
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                        <p className="font-medium text-gray-400 mb-1">Supported URL types:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Document links (PDF, DOC, XLSX, etc.)</li>
                          <li>Web pages with document content</li>
                          <li>Cloud storage links (Google Drive, Dropbox, etc.)</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status message */}
              <AnimatePresence>
                {uploadStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "mb-6 p-4 rounded-lg",
                      "border flex items-center gap-3",
                      uploadStatus.isSuccess 
                        ? "bg-green-900/20 border-green-800 text-green-400" 
                        : "bg-red-900/20 border-red-800 text-red-400"
                    )}
                  >
                    {uploadStatus.isSuccess ? (
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span>{uploadStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isUploading || (uploadType === "file" ? !selectedFile : !uploadUrl)}
                className={cn(
                  "w-full py-3 px-4 rounded-lg",
                  "flex items-center justify-center",
                  "text-white font-medium",
                  "transition-all duration-200",
                  isUploading ? "bg-blue-700 cursor-not-allowed" : 
                    (uploadType === "file" ? !selectedFile : !uploadUrl) 
                      ? "bg-gray-700 cursor-not-allowed" 
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg"
                )}
              >
                {isUploading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">
                      {uploadType === "file" ? "Uploading..." : "Processing..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {uploadType === "file" ? "Upload Document" : "Process URL"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// File type icons
const FilePdfIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13v4" />
      <path d="M9 13v4" />
      <path d="M15 13v4" />
      <path d="M9 17h6" />
    </svg>
  </div>
)

const FileDocIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  </div>
)

const FileExcelIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2" />
      <path d="M8 17h2" />
      <path d="M14 13h2" />
      <path d="M14 17h2" />
    </svg>
  </div>
)

const FilePptIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <circle cx="12" cy="14" r="3" />
    </svg>
  </div>
)

const FileTextIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  </div>
)
const FileImageIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" /><circle cx="10" cy="13" r="2" />
      <path d="m20 17-1.9-1.9a2 2 0 0 0-2.8 0L10 20" />
    </svg>
  </div>
)

// Loading spinner component
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

// Grid pattern component
function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-900 dark:bg-gray-950 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-sm ${
                index % 2 === 0
                  ? "bg-gray-800 dark:bg-gray-900"
                  : "bg-gray-800 dark:bg-gray-900 shadow-[0px_0px_1px_3px_rgba(30,30,30,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(10,10,10,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export default DocumentUploadPage