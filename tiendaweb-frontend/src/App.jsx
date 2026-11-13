import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AvisosProvider } from './context/AvisosContext';
import { SesionProvider } from './context/SesionContext';
import { TareasProvider } from './context/TareasContext';
import Avisos from './components/Avisos';
import RutaPrivada from './components/RutaPrivada';
import PaginaAcceso from './pages/PaginaAcceso';
import PaginaRegistro from './pages/PaginaRegistro';
import PaginaTareas from './pages/PaginaTareas';
import PaginaMatriz from './pages/PaginaMatriz';
import PaginaCalendario from './pages/PaginaCalendario';
import PaginaMaterias from './pages/PaginaMaterias';

export default function App() {
  return (
    <AvisosProvider>
      <SesionProvider>
        {/* Patrón Context: tareas y sesión envuelven todas las pantallas. */}
        <TareasProvider>
          <BrowserRouter>
            <Avisos />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<PaginaAcceso />} />
              <Route path="/registro" element={<PaginaRegistro />} />
              <Route path="/tareas" element={<RutaPrivada><PaginaTareas /></RutaPrivada>} />
              <Route path="/matriz" element={<RutaPrivada><PaginaMatriz /></RutaPrivada>} />
              <Route path="/calendario" element={<RutaPrivada><PaginaCalendario /></RutaPrivada>} />
              <Route path="/materias" element={<RutaPrivada><PaginaMaterias /></RutaPrivada>} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </TareasProvider>
      </SesionProvider>
    </AvisosProvider>
  );
}
