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
            className="w-full flex flex-col gap-3 mb-10">
            <p className="text-[#333] text-xl font-medium">Daily Time Ranges:</p>

            {/* time schedule */}
            <div className="flex flex-col gap-3 bg-[rgba(245,245,245,0.50)] rounded-2xl">
                {rangesData.map((range) => {
                    return (
                        <div

                            key={range.id} className="w-full flex items-center gap-10 px-5 py-3"
                        >
                            <p className="text-[#333] text-base font-normal">{range.monthName} {range.monthDateTime}</p>
                            <div className="flex items-center gap-2">
                                {/* start time */}
                                <CommonInputWrapper
                                    type="time"
                                    placeholder="Start Time"
                                    className="w-full"
                                    name="startTime"
                                    register={register}
                                    register_as="time"
                                    errors={errors}
                                />
                                <p className="text-[#333] font-">To</p>
                                {/* end time */}
                                <CommonInputWrapper
                                    type="time"
                                    placeholder="End Time"
                                    className="w-full"
                                    name="endTime"
                                    register={register}
                                    register_as="time"
                                    errors={errors}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* game duration */}
            <div className="w-full flex flex-col items-start gap-3">
                <p className="text-xl font-medium text-[#333]">Game Duration:</p>

                {/* input fied */}
                <div className="w-full bg-[rgba(245,245,245,0.50)] rounded-2xl p-5">
                    <CommonInputWrapper
                        type="number"
                        placeholder="Game Duration"
                        className="w-full"
                        name="gameDuration"
                        register={register}
                        register_as="gameDuration"
                        errors={errors}
                    />
                </div>
            </div>

            {/* location and courts */}
            <div className="w-full flex flex-col items-start gap-3">
                {/* title and add location */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl font-semibold text#333]">Location & Courts(l)</p>
                    <p className="text-xl font-semibold text-[#00AEEF]">+ Add Location</p>
                </div>

                {/* location and number of courts*/}
                <div className="w-full flex items-center gap-5 bg-[rgba(245,245,245,0.50)] rounded-2xl p-5">
                    {/* location name */}
                    <CommonInputWrapper
                        type="text"
                        placeholder="Location Name"
                        className="w-full"
                        name="location"
                        register={register}
                        register_as="location"
                        errors={errors}
                    />

                    {/* court number */}
                    <CommonInputWrapper
                        type="number"
                        placeholder="Number of Courts"
                        className="w-full"
                        name="courtName"
                        register={register}
                        register_as="courtName"
                        errors={errors}
                    />

                </div>

            </div>

            {/* buttons */}
            <div className="w-full mt-4 flex items-center justify-between">
                {/* delete and select location button */}
                <div className="flex items-center gap-4">
                    <button className="cursor-pointer border border-red-500 rounded-md p-3 hover:bg-gray-100 transition-all duration-300" type="button"> <RiDeleteBinLine className="text-xl text-red-500" /> </button>
                    <CommonSubmitBtn variant="primary">Select Location</CommonSubmitBtn>
                </div>

                {/* create schedule button */}
                <CommonSubmitBtn variant="primary" type="submit" link={true} path="/director-dashboard/court-list">Generate Schedule</CommonSubmitBtn>
            </div>
        </form>
    );
};
export default DailyTimeRange;