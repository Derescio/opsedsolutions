import { requireAdmin } from "@/lib/auth";
import StudioClient from "./studio-client";

export default async function StudioPage() {
    // This will redirect if user is not authenticated or not an admin
    await requireAdmin();

    return <StudioClient />;
} 