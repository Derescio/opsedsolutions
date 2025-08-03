// //import '@/app/assets/styles/globals.css'
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import ThemePopup from "@/components/ThemePopup"


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="min-h-screen bg-white">
                {/* <SessionProvider> */}
                {/* <Navbar /> */}

                <main>
                    <ThemePopup />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </main>
                {/* </SessionProvider> */}
                {/* <Footer /> */}
            </div>

        </>
    );
}
