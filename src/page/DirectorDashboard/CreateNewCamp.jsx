import BackBtn from "@/components/common/BackBtn";
// import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import { useForm } from "react-hook-form";
import { AiOutlineUpload } from "react-icons/ai";

// seletc options list
const spostListOptions = [
    {
        id: 1,
        label: "Soccer"
    },
    {
        id: 2,
        label: "Basketball"
    },
    {
        id: 3,
        label: "Bolyball"
    },
]

const CreateNewCamp = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        control
    } = useForm();

    const onSubmit = (data) => {
        console.log("Create New Camp Data:", data);
        // TODO: Integrate create new camp API here
    };

    // Note: main ui component
    return (
        <div className="w-full">
            <BackBtn />
            {/* section title */}
            <div className="w-full flex items-center justify-between mt-4">
                {/* section title */}
                <CommonSectionTitle
                    text="Create New Camp"
                    subText="Set up a new referee camp with all the essential details"
                />
                <CommonSubmitBtn variant="primary">Game Rules</CommonSubmitBtn>
            </div>

            {/* camp add form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border border-[#CCCCCC] rounded-2xl p-4 my-10 grid grid-cols-1 gap-4"
            >
                {/* Camp Name */}
                <CommonInputWrapperV2
                    label="Camp Name"
                    type="text"
                    placeholder="e.g., Elite Officials Summer Camp 2024"
                    register_as="campName"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Camp name is required",
                    }}
                />

                {/* camp logo */}
                <div className="w-full flex flex-col gap-3">
                    <label className="capitalize font-medium text-[#333]">Camp Logo</label>
                    {/* label */}
                    <label htmlFor="camp_logo" className="cursor-pointer w-full h-36 flex gap-2 items-center justify-center border-[0.5px] border-primary rounded-2xl">
                        <AiOutlineUpload className="text-primary text-xl font-medium" />
                        <span className="text-primary font-semibold text-lg">Upload Camp Logo</span>
                        <input type="file" name="camp_logo" id="camp_logo" className="hidden" />
                    </label>
                </div>

                {/* location */}
                <CommonInputWrapperV2
                    label="Location"
                    type="text"
                    placeholder="e:g., Los.Ange!es, CA"
                    register_as="campName"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Location is required",
                    }}
                />

                {/* start date and end date */}
                <div className="w-full grid grid-cols-2 gap-5">
                    <CommonInputWrapperV2
                        label="Start Date"
                        type="text"
                        placeholder="10:10AM"
                        register_as="campName"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "Start date is required",
                        }}
                    />
                    <CommonInputWrapperV2
                        label="End Date"
                        type="text"
                        placeholder="10:10AM"
                        register_as="campName"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "End date is required",
                        }}
                    />
                </div>

                {/* sport type */}
                <CommonInputWrapperV2
                    control={control}
                    options={spostListOptions}
                    label="Sport Type"
                    type="select"
                    placeholder="Select sport"
                    register_as="campName"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Camp name is required",
                    }}
                />

                {/* camp details */}
                <CommonInputWrapperV2
                    label="Camp Details"
                    type="textarea"
                    placeholder="Enter camp details"
                    register_as="campName"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Camp details is required",
                    }}
                />

                {/* price and software value */}
                <div className="w-full flex items-center gap-4">
                    <CommonInputWrapperV2
                        label="Price"
                        type="text"
                        placeholder="Enter price"
                        register_as="campName"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "Price is required",
                        }}
                        innerWrapper="w-full"
                    />
                    <p className="font-medium whitespace-nowrap mt-2 text-primary text-base">+$35 (software fee)</p>
                </div>

                {/* submit buttons */}
                <div className="w-full flex items-center gap-5">
                    <CommonSubmitBtn link={true} path="/director-dashboard" variant="primary" className={"w-full"}>Submit</CommonSubmitBtn>
                    <CommonSubmitBtn variant="secondary" className={"w-full"}>Reset Form</CommonSubmitBtn>
                </div>
            </form>
        </div>
    );
};
export default CreateNewCamp;