import BackBtn from "@/components/common/BackBtn";
import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import { useGetSportsType } from "@/hooks/get-sports-type";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const CreateNewCamp = () => {
    const axiosSecure = useAxiosSecure();
    const { getSportsType } = useGetSportsType();
    const [campLogoPreview, setCampLogoPreview] = useState(null);
    const navigate = useNavigate();

    // Note: convert the sports name and id to lavel and value
    const convertedType = getSportsType?.map((item) => ({
        label: item?.sports_name,
        value: item?.id
    }));

    // Note: react hook form
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        watch,
        reset
    } = useForm();


    const handleCampLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Create preview URL
        const previewURL = URL.createObjectURL(file);
        setCampLogoPreview(previewURL);
    };

    // Note: creatte new camp mutation
    const createNewCampMutation = useMutation({
        mutationKey: ["create-new-camp"],
        mutationFn: async (formData) => {
            const response = await axiosSecure.post(`/v1/camp/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response?.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Camp created successfully.");
            setTimeout(() => {
                navigate("/director-dashboard")
            }, 1500);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    });

    // Note: on Submit
    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append("camp_name", data.camp_name);
        formData.append("location", data.location);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        formData.append("sports_type_id", data.sports_type_id);
        formData.append("camp_details", data.camp_details);
        formData.append("price", data.price);

        // Note: file input must take the first file
        if (data?.camp_logo?.[0]) {
            formData.append("camp_logo", data.camp_logo[0]);
        }
        console.log([...formData]);
        createNewCampMutation.mutate(formData, {
            onSuccess: () => {
                reset();
                setCampLogoPreview(null)
            }
        });
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
                    register_as="camp_name"
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
                        className="cursor-pointer w-full h-28 sm:h-32 md:h-36 lg:h-40 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center border-[0.5px] border-primary rounded-xl sm:rounded-2xl hover:bg-primary/5 transition-colors duration-300 relative"
                    >
                        {/* Preview */}
                        {campLogoPreview ? (
                            <img
                                src={campLogoPreview}
                                alt="Camp Logo Preview"
                                className="absolute inset-0 w-full h-full object-contain p-4 rounded-xl"
                            />
                        ) : (
                            <>
                                <AiOutlineUpload className="text-primary text-xl sm:text-2xl font-medium" />
                                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                    <span className="text-primary font-semibold text-base sm:text-lg lg:text-xl text-center sm:text-left">
                                        Upload Camp Logo
                                    </span>
                                    <span className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                                        (PNG, JPG up to 5MB)
                                    </span>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            name="camp_logo"
                            id="camp_logo"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg"
                            {...register("camp_logo", {
                                required: true,
                                onChange: (e) => {
                                    handleCampLogoChange(e);
                                }
                            })}
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
                        type="date"
                        placeholder="Select start date"
                        register_as="start_date"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "Start date is required",
                        }}
                    />
                    <CommonInputWrapperV2
                        label="End Date"
                        type="date"
                        placeholder="Select end date"
                        register_as="end_date"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "End date is required",
                            validate: (value) => {
                                const start = watch("start_date");
                                if (!start) return;
                                return new Date(value) >= new Date(start) || "End date must be the same or after the start date"
                            }
                        }}
                    />
                </div>

                {/* sport type */}
                <CommonInputWrapperV2
                    control={control}
                    options={convertedType}
                    label="Sport Type"
                    type="select"
                    placeholder="Select sport"
                    register_as="sports_type_id"
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
                    register_as="camp_details"
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
                    <div className="flex items-center gap-2 mt-2 sm:mt-7">
                        <p className="font-medium whitespace-nowrap text-primary text-sm sm:text-base lg:text-lg">
                            +$25 (software fee)
                        </p>
                    </div>
                </div>

                {/* submit buttons link={true}  path="/director-dashboard" */}
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-6">
                    <CommonSubmitBtn
                        variant="primary"
                        className="w-full sm:flex-1 justify-center"
                        type="submit"
                        disabled={createNewCampMutation.isPending}
                    >
                        {createNewCampMutation.isPending ? <LoaderV2 /> : "Create Camp"}
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