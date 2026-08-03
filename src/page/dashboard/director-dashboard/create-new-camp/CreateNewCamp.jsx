import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import BackBtn from "@/components/common/BackBtn";
import {
  useGetSportsTypes,
  useGetTimeZones,
  useCreateCamp,
} from "@/hooks/api/director-hooks/useCamps";

import CampLogoUploader from "./components/CampLogoUploader";
import LocationAutocomplete from "./components/LocationAutocomplete";
import RichTextEditor from "./components/RichTextEditor";

const libraries = ["places"];

const CreateNewCamp = () => {
  const navigate = useNavigate();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Hooks
  const convertedType = useGetSportsTypes()?.data ?? [];
  const { data: timeZones } = useGetTimeZones();


  const createCampMutation = useCreateCamp({
    onSuccess: (data) => {
      toast.success(data?.message || "Camp created successfully.");
      setTimeout(() => navigate("/director-dashboard"), 1500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      camp_details: "",
      location: "",
      latitude: "",
      longitude: "",
      timezone: "",
    },
  });

  // Selected sport's software fee (dynamic)
  const selectedSportId = watch("sports_type_id");
  const selectedSport = convertedType?.find(
    (s) => Number(s.value) === Number(selectedSportId)
  );
  const sportsSoftwareFee =
    selectedSport && Number(selectedSport.sports_fee) > 0
      ? selectedSport.sports_fee
      : null;

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("camp_name", data.camp_name);
    formData.append("location", data.location);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("sports_type_id", data.sports_type_id);
    formData.append("camp_details", data.camp_details);
    formData.append("price", data.price);
    formData.append("timezone", data.timezone);

    if (data?.camp_logo?.[0]) {
      formData.append("camp_logo", data.camp_logo[0]);
    }

    createCampMutation.mutate(formData);
  };

  return (
    <LoadScript googleMapsApiKey={googleApiKey} libraries={libraries}>
      <div className="w-full">
        {/* Back + Header */}
        <div className="mb-4 sm:mb-6">
          <BackBtn />
        </div>

        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CommonSectionTitle
            text="Create New Camp"
            subText="Set up a new referee camp with all the essential details"
          />
          {/* <div className="w-full sm:w-auto">
            <CommonSubmitBtn
              variant="primary"
              className="w-full sm:w-auto justify-center"
            >
              Game Rules
            </CommonSubmitBtn>
          </div> */}
        </div>

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
            validationRules={{ required: "Camp name is required" }}
          />

          {/* Camp Logo */}
          <CampLogoUploader register={register} />

          {/* Location */}
          <LocationAutocomplete
            register={register}
            setValue={setValue}
            errors={errors}
          />

          {/* Timezone */}
          <CommonInputWrapperV2
            control={control}
            options={timeZones}
            label="Timezone"
            type="select"
            placeholder="Select timezone"
            register_as="timezone"
            register={register}
            errors={errors}
            validationRules={{ required: "Timezone is required" }}
          />

          {/* Start & End Date */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <CommonInputWrapperV2
              label="Start Date"
              type="date"
              register_as="start_date"
              register={register}
              errors={errors}
              validationRules={{ required: "Start date is required" }}
            />
            <CommonInputWrapperV2
              label="End Date"
              type="date"
              register_as="end_date"
              register={register}
              errors={errors}
              validationRules={{
                required: "End date is required",
                validate: (value) => {
                  const start = watch("start_date");
                  if (!start) return;
                  return (
                    new Date(value) >= new Date(start) ||
                    "End date must be after start date"
                  );
                },
              }}
            />
          </div>

          {/* Sport Type */}
          <CommonInputWrapperV2
            control={control}
            options={convertedType}
            label="Sport Type"
            type="select"
            placeholder="Select sport"
            register_as="sports_type_id"
            register={register}
            errors={errors}
            validationRules={{ required: "Sport type is required" }}
          />

          {/* Camp Details — Rich Text Editor */}
          <RichTextEditor setValue={setValue} errors={errors} />

          {/* Price */}
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
                  min: { value: 0, message: "Price must be positive" },
                }}
                prefix="$"
              />
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-7">
              {sportsSoftwareFee ? (
                <p className="font-medium whitespace-nowrap text-primary text-sm sm:text-base lg:text-lg">
                  +${sportsSoftwareFee} (software fee)
                </p>
              ) : (
                <p className="font-medium whitespace-nowrap text-primary text-sm sm:text-base lg:text-lg">
                  +$0 (software fee)
                </p>
              )}
            </div>
          </div>

          {/* Submit / Reset */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-6">
            <CommonSubmitBtn
              variant="primary"
              className="w-full sm:flex-1 justify-center"
              type="submit"
              disabled={createCampMutation.isPending}
            >
              {createCampMutation.isPending ? <LoaderV2 /> : "Create Camp"}
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
    </LoadScript>
  );
};

export default CreateNewCamp;
