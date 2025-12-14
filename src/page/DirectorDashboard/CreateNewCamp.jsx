import BackBtn from "@/components/common/BackBtn";
import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import { useForm } from "react-hook-form";
import { AiOutlineUpload } from "react-icons/ai";

// select options list
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
        label: "Volleyball"
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
        <div className="w-full ">
            <div className="mb-4 sm:mb-6">
                <BackBtn />
            </div>
            
            {/* section title */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* section title */}
                <CommonSectionTitle
                    text="Create New Camp"
                    subText="Set up a new referee camp with all the essential details"
                />
                <div className="w-full sm:w-auto">
                    <CommonSubmitBtn variant="primary" className="w-full sm:w-auto justify-center">
                        Game Rules
                    </CommonSubmitBtn>
                </div>
            </div>

            {/* camp add form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border border-[#CCCCCC] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 my-6 sm:my-8 lg:my-10 grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6"
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
                <div className="w-full flex flex-col gap-2 sm:gap-3">
                    <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
                        Camp Logo
                    </label>
                    {/* Upload area */}
                    <label 
                        htmlFor="camp_logo" 
                        className="cursor-pointer w-full h-28 sm:h-32 md:h-36 lg:h-40 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center border-[0.5px] border-primary rounded-xl sm:rounded-2xl hover:bg-primary/5 transition-colors duration-300"
                    >
                        <AiOutlineUpload className="text-primary text-xl sm:text-2xl font-medium" />
                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                            <span className="text-primary font-semibold text-base sm:text-lg lg:text-xl text-center sm:text-left">
                                Upload Camp Logo
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                                (PNG, JPG up to 5MB)
                            </span>
                        </div>
                        <input 
                            type="file" 
                            name="camp_logo" 
                            id="camp_logo" 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/jpg"
                        />
                    </label>
                </div>

                {/* location */}
                <CommonInputWrapperV2
                    label="Location"
                    type="text"
                    placeholder="e.g., Los Angeles, CA"
                    register_as="location"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Location is required",
                    }}
                />

                {/* start date and end date */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <CommonInputWrapperV2
                        label="Start Date"
                        type="text"
                        placeholder="Select start date"
                        register_as="startDate"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "Start date is required",
                        }}
                    />
                    <CommonInputWrapperV2
                        label="End Date"
                        type="text"
                        placeholder="Select end date"
                        register_as="endDate"
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
                    register_as="sportType"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Sport type is required",
                    }}
                />

                {/* camp details */}
                <CommonInputWrapperV2
                    label="Camp Details"
                    type="textarea"
                    placeholder="Enter camp details, schedule, objectives, etc."
                    register_as="campDetails"
                    register={register}
                    errors={errors}
                    validationRules={{
                        required: "Camp details are required",
                    }}
                    rows={4}
                    className="min-h-[100px] sm:min-h-[120px]"
                />

                {/* price and software value */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-5">
                    <div className="w-full sm:flex-1">
                        <CommonInputWrapperV2
                            label="Price"
                            type="number"
                            placeholder="Enter price"
                            register_as="price"
                            register={register}
                            errors={errors}
                            validationRules={{
                                required: "Price is required",
                                min: { value: 0, message: "Price must be positive" }
                            }}
                            prefix="$"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <p className="font-medium whitespace-nowrap text-primary text-sm sm:text-base lg:text-lg">
                            +$35 (software fee)
                        </p>
                        <span className="text-xs text-gray-500 hidden sm:inline">
                            per participant
                        </span>
                    </div>
                </div>

                {/* submit buttons */}
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-6">
                    <CommonSubmitBtn 
                        link={true} 
                        path="/director-dashboard" 
                        variant="primary" 
                        className="w-full sm:flex-1 justify-center"
                        type="submit"
                    >
                        Create Camp
                    </CommonSubmitBtn>
                    <CommonSubmitBtn 
                        variant="secondary" 
                        className="w-full sm:flex-1 justify-center"
                        type="button"
                        onClick={() => window.location.reload()}
                    >
                        Reset Form
                    </CommonSubmitBtn>
                </div>
            </form>
        </div>
    );
};
export default CreateNewCamp;