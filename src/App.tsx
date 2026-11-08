import { BackgroundVideo } from './components/BackgroundVideo'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Contact, Experience, Skills, Tldr, Work } from './components/Sections'

export default function App() {
  return (
    <main className="relative min-h-screen bg-black">
      <BackgroundVideo />
      <Navbar />
      <Hero />
      {/* Content below the hero sits on a dark glass layer so the scrubbing video stays visible but readable. */}
      <div className="relative z-[1] bg-black/75 backdrop-blur-xl">
        <Tldr />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </div>
    </main>
  )
}
