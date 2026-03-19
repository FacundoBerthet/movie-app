export default function CastCard({ member }) {
    return (
        <div className="flex-shrink-0 w-44 flex flex-col gap-2">

            {/* foto o iniciales */}
            {member.profile_url ? (
                <img
                    src={member.profile_url}
                    alt={member.name}
                    className="rounded-lg"
                />
            ) : (
                <div className="rounded-lg bg-cortina border border-reflector/20 flex items-center justify-center">
                    <span className="text-reflector text-4xl font-display font-bold">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                </div>
            )}

            {/* nombre + personaje */}
            <div className="flex flex-col gap-1.5">
                <span className="text-crema text-xl font-sans leading-tight">
                    {member.name}
                </span>
                <span className="text-pergamino text-lg leading-tight">
                    {member.character}
                </span>
            </div>

        </div>
    )
}