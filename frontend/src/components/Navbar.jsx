import { useState, useEffect } from 'react'
import { Search, EllipsisVertical, X } from "lucide-react"

import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 180)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    function handleSearch(e) {
        if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50  h-16 md:h-20 w-full px-0 md:px-10 transition-colors duration-300
            ${scrolled ? 'bg-noche' : 'bg-trasparent'}`}>

            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">
                {/* izquierda — logo */}
                <Link to="/">
                    <div className="flex items-center">
                        <span className="text-4xl md:text-5xl font-bold tracking-widest text-reflector2">
                            film<span className="text-bordo2">R</span>
                        </span>
                    </div>
                </Link>

                {/* derecha — acciones */}
                <div className="flex items-center gap-4">
                    
                    {/* overlay cierra el buscador al clickear afuera */}
                    {searchOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
                    )}
                    
                    {/* buscador desktop */}
                    <div className="relative z-50 hidden items-center md:flex">
                        <div
                            className={`flex items-center overflow-hidden rounded-3xl transition-all duration-300 ${
                                searchOpen
                                    ? 'w-80 border-transparent bg-transparent/25'
                                    : 'w-8 border-transparent'
                            }`}>
                            <button onClick={() => setSearchOpen(!searchOpen)}>
                                <Search className='text-reflector hover:text-reflector2' size={30} strokeWidth={3}/>
                            </button>
                            <input
                                type="text"
                                placeholder="Buscar películas..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className={`bg-transparent px-2 py-1 text-m text-crema placeholder:text-sombra focus:outline-none ${
                                    searchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'
                                }`}
                            />
                        </div>
                    </div>

                    {/* nav desktop */}
                    <nav className="hidden items-center gap-6 md:flex text-2xl font-normal">
                        <button
                            onClick={() => navigate('/discover?type=upcoming')}
                            className="text-reflector transition-colors hover:text-reflector2">
                            Próximamente
                        </button>

                    </nav>

                    {/* hamburguesa — solo mobile */}
                    <button
                        className="text-xl text-reflector transition-colors hover:text-reflector2 md:hidden"
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        {openMenu ? <X/> : <EllipsisVertical />}
                    </button>
                </div>
            </div>

            {/* menú mobile desplegable */}
            {openMenu && (
                <div className="absolute top-16 left-0 right-0 flex flex-col gap-4  bg-sala px-6 py-4 md:hidden">
                    <input
                        type="text"
                        placeholder="Buscar películas..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="rounded-2xl bg-transparent/25 px-3 py-2 text-sm text-reflector2 placeholder:text-reflector2/40 focus:border-[#f5e642] focus:outline-none"
                    />
                    <button className="text-left text-sm text-reflector transition-colors hover:text-reflector2">
                        Inicio
                    </button>
                    <button
                        onClick={() => {
                            navigate('/discover?type=upcoming')
                            setOpenMenu(false)
                        }}
                        className="text-left text-sm text-reflector transition-colors hover:text-reflector2">
                        Próximamente
                    </button>
                </div>
            )}

        </header>
    )
}