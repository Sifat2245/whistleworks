import { cn } from "@/lib/utils"

const CommonTitle = ({ className, text = "" }) => {
    return (
        <h3 className={cn("lg:text-4xl md:text-3xl text-2xl font-medium", className)}>
            {text}
        </h3>
    )
}

export default CommonTitle