
import { cn } from "@/lib/utils";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating, className = "" }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
        <div className={cn("flex justify-start items-center gap-1", className)}>
            {Array.from({ length: 5 }, (_, i) => {
                if (i < fullStars) return <FaStar key={i} />;
                if (i === fullStars && hasHalfStar) return <FaStarHalfAlt key={i} />;
                return <FaRegStar key={i} />;
            })}
        </div>
    );
};

export default StarRating;
