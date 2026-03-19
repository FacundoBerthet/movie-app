import { BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from './pages/Home'
import MovieDetailPage from './pages/MovieDetailPage'

function App() {

  return (
    <BrowserRouter>

      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies/:id" element={<MovieDetailPage/>} />
      </Routes>

      <Footer/>

    </BrowserRouter>
  )
}

export default App
