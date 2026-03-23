

const sections = [
    { id: 'sobre-filmr', label: 'Sobre filmR' },
    { id: 'creditos', label: 'Créditos y APIs' },
    { id: 'acerca-de', label: 'Acerca de' },
]

export default function AboutPage() {
    function scrollTo(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="bg-sala min-h-screen text-crema pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-6 flex gap-16">

                {/* sidebar — sticky */}
                <aside className="hidden md:flex flex-col gap-3 w-48 flex-shrink-0">
                    <div className="sticky top-28 flex flex-col gap-2">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className="text-left text-sm text-pergamino hover:text-reflector transition-colors py-1 border-l-2 border-transparent hover:border-reflector pl-3">
                                {s.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* contenido */}
                <div className="flex flex-col gap-16 flex-1">

                    {/* sobre filmR */}
                    <section id="sobre-filmr" className="flex flex-col gap-4">
                        <h2 className="font-display text-3xl text-reflector2">Sobre filmR</h2>
                        <div className="w-12 h-px bg-reflector/30" />
                        <p className="text-crema/80 leading-relaxed">
                            filmR es una plataforma para descubrir y explorar películas. Podés ver los próximos estrenos,
                            explorar tendencias, buscar títulos y acceder a información detallada de cada película,
                            incluyendo reparto, plataformas de streaming disponibles en Argentina y recomendaciones.
                        </p>
                        <p className="text-crema/80 leading-relaxed">
                            filmR nació de dos cosas simples: las ganas de aprender desarrollo fullstack y la costumbre de siempre querer saber qué películas se vienen. En lugar de practicar con ejemplos genéricos, construí algo que uso.
                        </p>
                        <p className="text-crema/80 leading-relaxed">
                            filmR está en construcción continua. Próximamente: búsqueda avanzada con filtros, 
                            páginas por categoría, tráilers, ratings de múltiples fuentes y más.
                        </p>
                    </section>

                    {/* créditos */}
                    <section id="creditos" className="flex flex-col gap-4">
                        <h2 className="font-display text-3xl text-reflector2">Créditos y APIs</h2>
                        <div className="w-12 h-px bg-reflector/30" />

                        <div className="flex flex-col gap-3">
                            <p className="text-crema/80 leading-relaxed">
                                filmR utiliza las siguientes fuentes de datos:
                            </p>

                            {/* TMDB */}
                            <div className="flex flex-col gap-2 p-4 border border-reflector/10 rounded-xl bg-terciopelo/30">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                                        alt="TMDB"
                                        className="h-5"
                                    />
                                    <a href="https://www.themoviedb.org"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-reflector text-sm hover:text-reflector2 transition-colors">
                                        themoviedb.org →
                                    </a>
                                </div>
                                <p className="text-crema/60 text-sm leading-relaxed">
                                    This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* acerca de */}
                    <section id="acerca-de" className="flex flex-col gap-4">
                        <h2 className="font-display text-3xl text-reflector2">Acerca de</h2>
                        <div className="w-12 h-px bg-reflector/30" />
                        <p className="text-crema/80 leading-relaxed">
                            Desarrollado por <span className="text-crema font-medium">Facundo Berthet</span>,
                            estudiante de Ciencias de la Computación.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a href="https://github.com/TU_USUARIO" target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 text-sm text-pergamino hover:text-reflector transition-colors border border-reflector/20 px-4 py-2 rounded-full hover:border-reflector/50">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}