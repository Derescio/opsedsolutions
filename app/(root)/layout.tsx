// //import '@/app/assets/styles/globals.css'
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"


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
                    {children}
                </main>
                {/* </SessionProvider> */}
                {/* <Footer /> */}
            </div>

        </>
    );
}
