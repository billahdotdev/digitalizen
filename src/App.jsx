import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
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
import InstallButton from './components/InstallButton'
import FreeResources from './components/FreeResources'
import Access from './components/Access'   // ← new
import Beauty from './components/beauty/Beauty'
import Wellness from './components/wellness/Wellness'


import GrowthHub from './components/GrowthHub'

function MainLayout() {
  return (
    <>
      <InstallButton />
      <Nav />
      <main>
        <Hero />
        <GrowthHub />
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

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"               element={<MainLayout />} />
        <Route path="/free-resources" element={<FreeResources />} />
        <Route path="/access"         element={<Access />} />   {/* ← new */}
        
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/wellness" element={<Wellness />} />
      </Routes>
    </HashRouter>
  )
}
