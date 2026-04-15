import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Voluntario from './pages/Voluntario'
import Doacoes from './pages/Doacoes'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'
import Admin from './pages/Admin'
import { HEALTH_ENDPOINT } from './config/api'

export default function App() {
  useEffect(() => {
    void fetch(HEALTH_ENDPOINT, { method: 'GET', mode: 'cors' }).catch(() => {
      /* cold start / offline — ignorado; objetivo é só acordar o host (ex.: Render free) */
    })
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/noticias"            element={<Navigate to="/" replace />} />
          <Route path="/voluntario"          element={<Voluntario />} />
          <Route path="/doacoes"             element={<Doacoes />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
