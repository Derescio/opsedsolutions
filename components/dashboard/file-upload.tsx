'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
    Upload,
    File,
    Image,
    X,
    FileText,
    Download,
    Trash2
} from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'

interface FileUploadProps {
    onUploadComplete: (files: {
        filename: string
        originalName: string
        url: string
        fileType: string
        fileSize: number
    }[]) => void
    maxFiles?: number
    acceptedTypes?: string[]
}

interface UploadedFile {
    filename: string
    originalName: string
    url: string
    fileType: string
    fileSize: number
}

export default function FileUpload({
    onUploadComplete,
    maxFiles = 5,
    acceptedTypes = ['image/*', 'application/pdf', 'text/plain', '.docx', '.doc']
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const { startUpload: startImageUpload, isUploading: isImageUploading } = useUploadThing('imageUploader', {
        onClientUploadComplete: (res) => {
            if (res) {
                const newFiles = res.map(file => ({
                    filename: file.name,
                    originalName: file.name,
                    url: file.url,
                    fileType: file.type || 'unknown',
                    fileSize: file.size
                }))
                setUploadedFiles(prev => {
                    const updated = [...prev, ...newFiles]
                    // Defer the callback to avoid React render cycle issues
                    setTimeout(() => onUploadComplete(updated), 0)
                    return updated
                })
                toast.success('Images uploaded successfully!')
            }
        },
        onUploadError: (error) => {
            toast.error(`Upload failed: ${error.message}`)
        },
        onUploadProgress: (progress) => {
            setUploadProgress(progress)
        }
    })

    const { startUpload: startFileUpload, isUploading: isFileUploading } = useUploadThing('fileUploader', {
        onClientUploadComplete: (res) => {
            if (res) {
                const newFiles = res.map(file => ({
                    filename: file.name,
                    originalName: file.name,
                    url: file.url,
                    fileType: file.type || 'unknown',
                    fileSize: file.size
                }))
                setUploadedFiles(prev => {
                    const updated = [...prev, ...newFiles]
                    // Defer the callback to avoid React render cycle issues
                    setTimeout(() => onUploadComplete(updated), 0)
                    return updated
                })
                toast.success('Files uploaded successfully!')
            }
        },
        onUploadError: (error) => {
            toast.error(`Upload failed: ${error.message}`)
        },
        onUploadProgress: (progress) => {
            setUploadProgress(progress)
        }
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])

        if (selectedFiles.length + files.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`)
            return
        }

        // Validate file types
        const invalidFiles = selectedFiles.filter(file => {
            const isValidType = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase())
                }
                return file.type.match(type.replace('*', '.*'))
            })
            return !isValidType
        })

        if (invalidFiles.length > 0) {
            toast.error(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`)
            return
        }

        // Validate file sizes (max 16MB for docs, 4MB for images)
        const oversizedFiles = selectedFiles.filter(file => {
            const maxSize = file.type.startsWith('image/') ? 4 * 1024 * 1024 : 16 * 1024 * 1024
            return file.size > maxSize
        })

        if (oversizedFiles.length > 0) {
            toast.error(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}`)
            return
        }

        setFiles(prev => [...prev, ...selectedFiles])
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const removeUploadedFile = (index: number) => {
        const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index)
        setUploadedFiles(newUploadedFiles)
        onUploadComplete(newUploadedFiles)
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const imageFiles = files.filter(file => file.type.startsWith('image/'))
            const documentFiles = files.filter(file => !file.type.startsWith('image/'))

            const promises = []

            if (imageFiles.length > 0) {
                promises.push(startImageUpload(imageFiles))
            }

            if (documentFiles.length > 0) {
                promises.push(startFileUpload(documentFiles))
            }

            await Promise.all(promises)
            setFiles([])
        } catch (error) {
            toast.error('Upload failed')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) {
            return <Image className="w-4 h-4" />
        } else if (fileType.includes('pdf')) {
            return <FileText className="w-4 h-4" />
        } else {
            return <File className="w-4 h-4" />
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* File Input */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Drag files here or click to upload
                        </p>
                        <input
                            type="file"
                            multiple
                            accept={acceptedTypes.join(',')}
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            Select Files
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Images: 4MB max, Documents: 16MB max
                        </p>
                    </div>

                    {/* Selected Files for Upload */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200">
                                Selected Files ({files.length})
                            </h4>
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="flex items-center gap-2">
                                        {getFileIcon(file.type)}
                                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {/* Upload Progress */}
                            {(isUploading || isImageUploading || isFileUploading) && (
                                <div className="space-y-2">
                                    <Progress value={uploadProgress} className="w-full" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Uploading... {Math.round(uploadProgress)}%
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading || isImageUploading || isFileUploading}
                                    className="flex-1"
                                >
                                    {isUploading || isImageUploading || isFileUploading ? (
                                        <>
                                            <Upload className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Files
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setFiles([])}
                                    disabled={isUploading || isImageUploading || isFileUploading}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200">
                                Uploaded Files ({uploadedFiles.length})
                            </h4>
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                    <div className="flex items-center gap-2">
                                        {getFileIcon(file.fileType)}
                                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                                            {file.originalName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatFileSize(file.fileSize)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(file.url, '_blank')}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeUploadedFile(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
} 