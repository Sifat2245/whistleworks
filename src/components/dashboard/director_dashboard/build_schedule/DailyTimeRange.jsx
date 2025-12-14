import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useForm } from "react-hook-form";
import { RiDeleteBinLine } from "react-icons/ri";

const rangesData = [
    {
        id: 1,
        monthName: "January",
        monthDateTime: 20
    },
    {
        id: 2,
        monthName: "January",
        monthDateTime: 25
    },
    {
        id: 3,
        monthName: "January",
        monthDateTime: 20
    },
];

const DailyTimeRange = () => {

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Sign Up Data:", data);
        // TODO: Integrate sign-up API here
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10"
        >
            <p className="text-[#333] text-lg sm:text-xl md:text-2xl font-medium">Daily Time Ranges:</p>

            {/* time schedule */}
            <div className="flex flex-col gap-2 sm:gap-3 bg-[rgba(245,245,245,0.50)] rounded-xl sm:rounded-2xl">
                {rangesData.map((range) => {
                    return (
                        <div
                            key={range.id}
                            className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-10 px-3 sm:px-4 md:px-5 py-3 sm:py-4"
                        >
                            {/* Date display */}
                            <div className="w-full sm:w-auto min-w-[180px]">
                                <p className="text-[#333] text-base sm:text-lg font-normal">
                                    {range.monthName} {range.monthDateTime}
                                </p>
                            </div>
                            {/* Time inputs */}
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {/* start time */}
                                    <CommonInputWrapper
                                        type="time"
                                        placeholder="Start Time"
                                        className="w-full text-sm sm:text-base"
                                        name="startTime"
                                        register={register}
                                        register_as="time"
                                        errors={errors}
                                    />
                                    <p className="text-[#333] font-medium text-sm sm:text-base px-1 sm:px-2">To</p>
                                    {/* end time */}
                                    <CommonInputWrapper
                                        type="time"
                                        placeholder="End Time"
                                        className="w-full text-sm sm:text-base"
                                        name="endTime"
                                        register={register}
                                        register_as="time"
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* game duration */}
            <div className="w-full flex flex-col items-start gap-2 sm:gap-3 md:gap-4">
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#333]">Game Duration:</p>

                {/* input field */}
                <div className="w-full bg-[rgba(245,245,245,0.50)] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
                    <CommonInputWrapper
                        type="number"
                        placeholder="Game Duration (minutes)"
                        className="w-full text-sm sm:text-base"
                        name="gameDuration"
                        register={register}
                        register_as="gameDuration"
                        errors={errors}
                    />
                </div>
            </div>

            {/* location and courts */}
            <div className="w-full flex flex-col items-start gap-2 sm:gap-3 md:gap-4">
                {/* title and add location */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#333]">Location & Courts</p>
                    <button
                        type="button"
                        className="text-base sm:text-lg md:text-xl font-semibold text-[#00AEEF] hover:text-[#0098d6] transition-colors cursor-pointer"
                    >
                        + Add Location
                    </button>
                </div>

                {/* location and number of courts */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 bg-[rgba(245,245,245,0.50)] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
                    {/* location name */}
                    <CommonInputWrapper
                        type="text"
                        placeholder="Location Name"
                        className="w-full text-sm sm:text-base"
                        name="location"
                        register={register}
                        register_as="location"
                        errors={errors}
                    />
                    {/* court number */}
                    <CommonInputWrapper
                        type="number"
                        placeholder="Number of Courts"
                        className="w-full text-sm sm:text-base"
                        name="courtName"
                        register={register}
                        register_as="courtName"
                        errors={errors}
                    />
                </div>
            </div>

            {/* buttons */}
            <div className="w-full mt-4 sm:mt-6 md:mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0">
                {/* delete and select location button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                        className="cursor-pointer border border-red-500 rounded-md p-3 hover:bg-gray-100 transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
                        type="button"
                    >
                        <RiDeleteBinLine className="text-lg sm:text-xl text-red-500" />
                    </button>
                    <CommonSubmitBtn variant="primary" className="w-full sm:w-auto justify-center">
                        Select Location
                    </CommonSubmitBtn>
                </div>

                {/* create schedule button */}
                <CommonSubmitBtn
                    variant="primary"
                    type="submit"
                    link={true}
                    path="/director-dashboard/court-list"
                    className="w-full sm:w-auto justify-center"
                >
                    Generate Schedule
                </CommonSubmitBtn>
            </div>
        </form>
    );
};
export default DailyTimeRange;