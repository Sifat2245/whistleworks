import { cn } from "@/lib/utils"

const CommonTitle = ({ className, text = "" }) => {
    return (
        <h3 className={cn("text-6xl font-medium text-white", className)}>
            {text}
        </h3>
    )
}

export default CommonTitle