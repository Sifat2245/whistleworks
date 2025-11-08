import { cn } from "@/lib/utils"

const CommonText = ({ className, text = "" }) => {
    return (
        <h3 className={cn("text-2xl font-medium text-white", className)}>
            {text}
        </h3>
    )
}

export default CommonText