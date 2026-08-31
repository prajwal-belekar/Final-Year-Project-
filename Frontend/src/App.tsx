import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import NewAnalysis from './pages/NewAnalysis'
import Results from './pages/Results'
import History from './pages/History'
import Methodology from './pages/Methodology'
import Architecture from './pages/Architecture'
import Dataset from './pages/Dataset'
import APIDocs from './pages/APIDocs'
import FutureScope from './pages/FutureScope'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis/new" element={<NewAnalysis />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/api-docs" element={<APIDocs />} />
          <Route path="/future-scope" element={<FutureScope />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
