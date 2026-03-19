import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-noche py-16 mt-20">
            <div className="max-w-6xl mx-auto px-6">

                {/* contenido principal */}
                <div className="flex justify-between items-start gap-12">

                    {/* logo */}
                    <Link to="/"> 
                        <div className="flex items-center">
                            <span className="text-4xl md:text-5xl font-bold tracking-widest text-reflector2">
                                film<span className="text-bordo2">R</span>
                            </span>
                        </div>
                    </Link>
                    
                    {/* links */}
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/about#sobre-filmr"
                            className="text-pergamino hover:text-reflector transition-colors">
                            Sobre filmR
                        </Link>
                        <Link
                            to="/about#creditos"
                            className="text-pergamino hover:text-reflector transition-colors">
                            Créditos y APIs
                        </Link>
                        <Link
                            to="/about#acerca-de"
                            className="text-pergamino hover:text-reflector transition-colors">
                            Acerca de
                        </Link>
                    </div>

                </div>

                {/* divisor */}
                <div className="border-t border-reflector/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* créditos TMDB */}
                    <img
                        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                        alt="TMDB Logo"
                        className="h-5 opacity-60"
                    />
                    <p className="text-sombra text-base">
                        This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
                    </p>

                    {/* copyright */}
                    <p className="text-sombra text-xs flex-shrink-0">
                        © 2025 filmR
                    </p>

                </div>

            </div>
        </footer>
    )
}