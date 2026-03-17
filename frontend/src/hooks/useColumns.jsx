import { useState, useEffect } from "react"

export default function useColumns() {
    const [cols, setCols] = useState(5)

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            if (w < 640)  setCols(2)       // default (< sm)
            else if (w < 768)  setCols(3)  // sm
            else if (w < 1024) setCols(4)  // md
            else setCols(5)                // lg+
        }
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    return cols
}