import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import ScreenLoading from "@/components/common/ScreenLoading";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import {
  useGetSportsTypes,
  useGetTimeZones,
  useUpdateCamp,
  useGetCampEdit,
} from "@/hooks/api/director-hooks/useCamps";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import BackBtn from "@/components/common/BackBtn";

import CampLogoUploader from "@/page/dashboard/director-dashboard/create-new-camp/components/CampLogoUploader";
import LocationAutocomplete from "@/page/dashboard/director-dashboard/create-new-camp/components/LocationAutocomplete";
import RichTextEditor from "@/page/dashboard/director-dashboard/create-new-camp/components/RichTextEditor";

const libraries = ["places"];

const EditCampPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // ── Hooks ─────────────────────────────────────────────────────
  const { data: campData, isLoading } = useGetCampEdit(id);
  const data = campData || {};
  const convertedType = useGetSportsTypes()?.data ?? [];
  const { data: timeZones } = useGetTimeZones();

  const updateCampMutation = useUpdateCamp({
    onSuccess: () => {
      toast.success("Camp updated successfully");
      navigate("/director-dashboard");
    },
    onError: () => {
      toast.error("Failed to update camp");
    },
  });

  // ── Form ──────────────────────────────────────────────────────
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    values: {
      camp_name: data?.camp_name || "",
      location: data?.location || "",
      latitude: data?.latitude || null,
      longitude: data?.longitude || null,
      start_date: data?.start_date?.split("T")[0] || "",
      end_date: data?.end_date?.split("T")[0] || "",
      sports_type_id: data?.sport?.id || null,
      camp_details: data?.camp_details || "",
      price: data?.price || "",
      camp_logo: null,
      timezone: data?.timezone || "",
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

  const onSubmit = (formData) => {
    const payload = new FormData();
    payload.append("camp_name", formData.camp_name);
    payload.append("location", formData.location);
    if (formData.latitude != null && !isNaN(formData.latitude)) {
      payload.append("latitude", formData.latitude);
    }
    if (formData.longitude != null && !isNaN(formData.longitude)) {
      payload.append("longitude", formData.longitude);
    }
    payload.append("start_date", formData.start_date);
    payload.append("end_date", formData.end_date);
    payload.append("sports_type_id", formData.sports_type_id);
    payload.append("camp_details", formData.camp_details);
    payload.append("price", formData.price);
    payload.append("timezone", formData.timezone);

    if (formData.camp_logo?.[0]) {
      payload.append("camp_logo", formData.camp_logo[0]);
    }

    updateCampMutation.mutate({ id, formData: payload });
  };

  if (isLoading) return <ScreenLoading />;

  return (
    <LoadScript googleMapsApiKey={googleApiKey} libraries={libraries}>
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
            validationRules={{ required: "Camp name is required" }}
          />

          {/* Camp Logo */}
          <CampLogoUploader
            register={register}
            initialPreview={data?.camp_logo || null}
          />

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
                  if (!start) return true;
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
          <RichTextEditor
            setValue={setValue}
            errors={errors}
            initialContent={data?.camp_details || ""}
          />

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
              {sportsSoftwareFee && (
                <p className="font-medium whitespace-nowrap text-primary text-sm sm:text-base lg:text-lg">
                  +${sportsSoftwareFee} (software fee)
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-6">
            <CommonSubmitBtn
              variant="primary"
              className="w-full sm:flex-1 justify-center"
              type="submit"
              disabled={updateCampMutation.isPending}
            >
              {updateCampMutation.isPending ? <LoaderV2 /> : "Update Camp"}
            </CommonSubmitBtn>
          </div>
        </form>
      </div>
    </LoadScript>
  );
};

export default EditCampPage;
