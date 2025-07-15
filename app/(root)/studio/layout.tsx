export const metadata = {
    title: 'Opsed Solutions - Content Studio',
    description: 'Content management for Opsed Solutions blog',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen w-full">
            {children}
        </div>
    )
} 