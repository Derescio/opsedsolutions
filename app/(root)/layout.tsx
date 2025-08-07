// //import '@/app/assets/styles/globals.css'
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
'use client'
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider"
import ThemePopup from "@/components/ThemePopup"
import { GoogleAnalytics } from '@next/third-parties/google';


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [showThemePopup, setShowThemePopup] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowThemePopup(true);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <div className="min-h-screen bg-white">
                {/* <SessionProvider> */}
                {/* <Navbar /> */}

                <main>
                    {/* Theme Popup after 2 seconds */}
                    {showThemePopup && <ThemePopup />}
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                    <GoogleAnalytics gaId={process.env.GOOGLE_TAG_ID || ''} />
                </main>
                {/* </SessionProvider> */}
                {/* <Footer /> */}
            </div>

        </>
    );
}
