import { cn } from "@/lib/utils"

const CommonText = ({ className, text = "" }) => {
    return (
        <h3 className={cn("md:text-xl", className)}>
            {text}
        </h3>
    )
}

export default CommonText