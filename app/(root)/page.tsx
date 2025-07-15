import Hero from "@/components/hero"
import Services from "@/components/services"
import Projects from "@/components/projects"
import About from "@/components/about"
import Blog from "@/components/blog"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Projects />
      <Services />
      <About />
      <Blog />
      <Contact />
    </main>
  )
}
