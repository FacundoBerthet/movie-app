import { BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from './pages/Home'
import MovieDetailPage from './pages/MovieDetailPage'
import SearchPage from "./pages/SearchPage"
import DiscoverPage from "./pages/DiscoverPage"
import AboutPage from "./pages/AboutPage"


function App() {

  return (
    <BrowserRouter>

      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies/:id" element={<MovieDetailPage/>} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <Footer/>

    </BrowserRouter>
  )
}

export default App
