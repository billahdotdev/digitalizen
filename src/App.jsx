import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Finder from './components/Finder'
import Process from './components/Process'
import Packages from './components/Packages'
import Proof from './components/Proof'
import About from './components/About'
import BookCall from './components/BookCall'
import Resources from './components/Resources'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Finder />
        <Process />
        <Packages />
        <Proof />
        <About />
        <BookCall />
        <Resources />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
