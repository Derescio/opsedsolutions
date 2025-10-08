// 'use client'

// import { NextStudio } from 'next-sanity/studio'
// import config from '../../../../sanity.config'

// export default function StudioPage() {
//     return (
//         <div className="h-screen w-full">
//             <NextStudio config={config} />
//         </div>
//     )
// } 



import { requireAdmin } from "@/lib/auth";
import StudioClient from "./studio-client";

export default async function StudioPage() {
    // This will redirect if user is not authenticated or not an admin
    await requireAdmin();

    return <StudioClient />;
} 