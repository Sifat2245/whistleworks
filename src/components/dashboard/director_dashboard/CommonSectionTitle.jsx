import { cn } from "@/lib/utils";

const CommonSectionTitle = ({ text = "", subText = "", titleClass = "", subClass = "" }) => {
    return (
        <div className="flex flex-col gap-3 items-start justify-start">
            <h3 className={cn("text-[#333] text-[30px] font-medium", titleClass)}>{text}</h3>
            <p className={cn("text-base text-[#666]", subClass)}>{subText}</p>
        </div>
    );
};
export default CommonSectionTitle;