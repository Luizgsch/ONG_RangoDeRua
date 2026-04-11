import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Voluntario from './pages/Voluntario'
import Doacoes from './pages/Doacoes'
import Noticias from './pages/Noticias'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter basename="/ONG_RangoDeRua">
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/voluntario"          element={<Voluntario />} />
          <Route path="/doacoes"             element={<Doacoes />} />
          <Route path="/noticias"            element={<Noticias />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
