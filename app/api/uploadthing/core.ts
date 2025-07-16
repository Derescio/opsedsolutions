import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getCurrentUser } from "@/lib/auth"

const f = createUploadthing()

// FileRouter for the app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on the server before the user uploads
            const user = await getCurrentUser()

            // If no user, throw an error
            if (!user) throw new UploadThingError("Unauthorized")

            // Return metadata to be stored with the file
            return { userId: user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code runs on the server after the user uploads
            console.log("Upload complete for userId:", metadata.userId)
            console.log("file url", file.url)

            // Return data to be sent to the client
            return { uploadedBy: metadata.userId }
        }),
    
    // File uploader for documents and other files
    fileUploader: f({ 
        "application/pdf": { maxFileSize: "16MB", maxFileCount: 3 },
        "text/plain": { maxFileSize: "4MB", maxFileCount: 3 },
        "application/msword": { maxFileSize: "16MB", maxFileCount: 3 },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "16MB", maxFileCount: 3 },
    })
        .middleware(async () => {
            const user = await getCurrentUser()
            if (!user) throw new UploadThingError("Unauthorized")
            return { userId: user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("File upload complete for userId:", metadata.userId)
            console.log("file url", file.url)
            return { uploadedBy: metadata.userId }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter 