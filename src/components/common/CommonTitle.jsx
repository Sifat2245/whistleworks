import { cn } from "@/lib/utils"

const CommonTitle = ({ className, text = "" }) => {
    return (
        <h3 className={cn("text-4xl font-medium", className)}>
            {text}
        </h3>
    )
}

export default CommonTitle