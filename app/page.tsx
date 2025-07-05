import Hero from "@/components/hero"
import Services from "@/components/services"
import Projects from "@/components/projects"
import About from "@/components/about"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Projects />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
