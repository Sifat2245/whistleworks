import BackBtn from "@/components/common/BackBtn";
import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineUpload } from "react-icons/ai";

const EditCampPage = ({ convertedType = [] }) => {
  const campData = useLoaderData();
  const data = campData?.data?.data;
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();

  const [campLogoPreview, setCampLogoPreview] = useState(data?.camp_logo || "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      camp_name: data?.camp_name || "",
      location: data?.location || "",
      start_date: data?.start_date?.split("T")[0] || "",
      end_date: data?.end_date?.split("T")[0] || "",
      sports_type_id: data?.sport?.id || null,
      camp_details: data?.camp_details || "",
      price: data?.price || "",
      camp_logo: null,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        camp_name: data.camp_name,
        location: data.location,
        start_date: data.start_date?.split("T")[0],
        end_date: data.end_date?.split("T")[0],
        sports_type_id: data.sport?.id,
        camp_details: data.camp_details,
        price: data.price,
        camp_logo: null,
      });
      setCampLogoPreview(data.camp_logo || "");
    }
  }, [data, reset]);

  const handleCampLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCampLogoPreview(previewUrl);
  };

  // React Query mutation for updating camp (v4 syntax)
  const updateCampMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = new FormData();
      payload.append("camp_name", formData.camp_name);
      payload.append("location", formData.location);
      payload.append("start_date", formData.start_date);
      payload.append("end_date", formData.end_date);
      payload.append("sports_type_id", formData.sports_type_id);
      payload.append("camp_details", formData.camp_details);
      payload.append("price", formData.price);

      if (formData.camp_logo?.[0]) {
        payload.append("camp_logo", formData.camp_logo[0]);
      }

      return axiosInstance.post(`/v1/camp/update/${data.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Camp updated successfully");
      navigate("/director-dashboard");
    },
    onError: () => {
      toast.error("Failed to update camp");
    },
  });

  const onSubmit = (formData) => {
    updateCampMutation.mutate(formData);
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <BackBtn />
      </div>

      {/* section title */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <CommonSectionTitle
          text="Edit Camp"
          subText="Update referee camp details"
        />
      </div>

      {/* camp edit form */}
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
          value={data?.camp_name}
          validationRules={{ required: "Camp name is required" }}
        />

        {/* camp logo */}
        <div className="w-full flex flex-col gap-2 sm:gap-3">
          <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
            Camp Logo
          </label>
          <label className="cursor-pointer w-full h-28 sm:h-32 md:h-36 lg:h-40 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center border-[0.5px] border-primary rounded-xl sm:rounded-2xl hover:bg-primary/5 transition-colors duration-300 relative">
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
              {...register("camp_logo", { onChange: handleCampLogoChange })}
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
          value={data?.location}
          validationRules={{ required: "Location is required" }}
        />

        {/* start date and end date */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <CommonInputWrapperV2
            label="Start Date"
            type="date"
            register_as="start_date"
            register={register}
            errors={errors}
            value={data?.start_date?.split("T")[0]}
            validationRules={{ required: "Start date is required" }}
          />
          <CommonInputWrapperV2
            label="End Date"
            type="date"
            register_as="end_date"
            register={register}
            errors={errors}
            value={data?.end_date?.split("T")[0]}
            validationRules={{
              required: "End date is required",
              validate: (value) => {
                const start = watch("start_date");
                if (!start) return true;
                return (
                  new Date(value) >= new Date(start) ||
                  "End date must be the same or after the start date"
                );
              },
            }}
          />
        </div>

        {/* sport type */}
        <CommonInputWrapperV2
          control={control}
          options={convertedType}
          label="Sport Type"
          type="select"
          register_as="sports_type_id"
          errors={errors}
          value={data?.sport?.id}
          validationRules={{ required: "Sport type is required" }}
        />

        {/* camp details */}
        <CommonInputWrapperV2
          label="Camp Details"
          type="textarea"
          register_as="camp_details"
          register={register}
          errors={errors}
          value={data?.camp_details}
          validationRules={{ required: "Camp details are required" }}
          rows={4}
        />

        {/* price */}
        <CommonInputWrapperV2
          label="Price"
          type="number"
          register_as="price"
          register={register}
          errors={errors}
          value={data?.price}
          validationRules={{
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
          }}
          prefix="$"
        />

        {/* submit */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-6">
          <CommonSubmitBtn
            isLoading={updateCampMutation.isPending}
            disabled={updateCampMutation.isPending}
            variant="primary"
            className="w-full sm:flex-1 justify-center"
            type="submit"
          >
            {updateCampMutation.isPending ? <LoaderV2 /> : "Update Camp"}
          </CommonSubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default EditCampPage;
