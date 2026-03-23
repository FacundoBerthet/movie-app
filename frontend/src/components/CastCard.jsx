export default function CastCard({ member }) {
    return (
        <div className="flex-shrink-0 flex flex-col gap-2">

            {/* foto o iniciales */}
            {member.profile_url ? (
                <img
                    src={member.profile_url}
                    alt={member.name}
                    className="rounded-lg w-40 md:w-44 md:h-30"
                />
            ) : (
                <div className="rounded-lg md:w-44 md:h-[27vh] bg-cortina border border-reflector/20 flex items-center justify-center">
                    <span className="text-reflector text-4xl font-display font-bold">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                </div>
            )}

            {/* nombre + personaje */}
            <div className="flex flex-col gap-1.5">
                <span className="text-crema text-lg md:text-xl font-sans leading-tight">
                    {member.name}
                </span>
                <span className="text-pergamino text-base md:text-lg leading-tight">
                    {member.character}
                </span>
            </div>

        </div>
    )
}