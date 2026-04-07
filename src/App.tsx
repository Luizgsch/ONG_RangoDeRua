import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Voluntario from './pages/Voluntario'
import Doacoes from './pages/Doacoes'
import Noticias from './pages/Noticias'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/voluntario"          element={<Voluntario />} />
          <Route path="/doacoes"             element={<Doacoes />} />
          <Route path="/noticias"            element={<Noticias />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
