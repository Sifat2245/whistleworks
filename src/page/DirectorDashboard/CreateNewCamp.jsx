import CommonInputWrapperV2 from "@/components/common/CommonInputWrapperV2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import { useGetSportsType } from "@/hooks/get-sports-type";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  RiBold,
  RiItalic,
  RiH2,
  RiListUnordered,
  RiListOrdered,
} from "react-icons/ri";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import BackBtn from "@/components/common/BackBtn";

const libraries = ["places"];

const CreateNewCamp = () => {
  const axiosSecure = useAxiosSecure();
  const { getSportsType } = useGetSportsType();
  const [campLogoPreview, setCampLogoPreview] = useState(null);
  const navigate = useNavigate();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const convertedType = getSportsType?.map((item) => ({
    label: item?.sports_name,
    value: item?.id,
  }));

  const { data: timeZones } = useQuery({
    queryKey: ["get-timezones"],
    queryFn: async () => {
      const res = await axiosSecure.get("/v1/timezones/available");
      return res?.data?.data?.timezones || [];
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
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

  const autocompleteRef = useRef(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const fullAddress = place.formatted_address || place.name || "";

        setValue("location", fullAddress);
        setValue("latitude", lat.toFixed(8));
        setValue("longitude", lng.toFixed(8));
      }
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc ml-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-6" } },
      }),
    ],
    content: watch("camp_details"),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4 border border-gray-300 border-t-0 rounded-b-xl bg-white",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("camp_details", editor.getHTML(), { shouldValidate: true });
    },
  });

  const handleCampLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setCampLogoPreview(previewURL);
  };

  const createNewCampMutation = useMutation({
    mutationKey: ["create-new-camp"],
    mutationFn: async (formData) => {
      const response = await axiosSecure.post(`/v1/camp/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Camp created successfully.");
      setTimeout(() => navigate("/director-dashboard"), 1500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

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

    createNewCampMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setCampLogoPreview(null);
        editor?.commands.clearContent();
      },
    });
  };

  return (
    <LoadScript googleMapsApiKey={googleApiKey} libraries={libraries}>
      <div className="w-full">
        <div className="mb-4 sm:mb-6">
          <BackBtn />
        </div>

        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CommonSectionTitle
            text="Create New Camp"
            subText="Set up a new referee camp with all the essential details"
          />
          <div className="w-full sm:w-auto">
            <CommonSubmitBtn
              variant="primary"
              className="w-full sm:w-auto justify-center"
            >
              Game Rules
            </CommonSubmitBtn>
          </div>
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
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                {...register("camp_logo", {
                  required: false,
                  onChange: handleCampLogoChange,
                })}
              />
            </label>
          </div>

          {/* ── Location with Google Places Autocomplete ────────────────────── */}
          <div className="w-full flex flex-col gap-2 sm:gap-3">
            <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
              Location <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={onPlaceChanged}
                options={{
                  fields: ["formatted_address", "geometry", "name"],
                  types: ["geocode", "establishment"], // gym, stadium, park, etc.
                }}
              >
                <input
                  type="text"
                  placeholder="e.g., Los Angeles, CA or search gym/stadium..."
                  className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] text-base bg-white shadow-sm transition-all duration-200"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              </Autocomplete>

              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}

              {/* Hidden fields for lat/lng */}
              <input type="hidden" {...register("latitude")} />
              <input type="hidden" {...register("longitude")} />
            </div>
          </div>

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

          {/* Camp Details - Tiptap */}
          <div className="w-full flex flex-col">
            <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
              Camp Details{" "}
              <span className="text-neutral-400 text-sm">(Optional)</span>
            </label>

            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 border border-gray-300 rounded-t-xl">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("bold") ? "bg-gray-300" : ""}`}
                title="Bold"
              >
                <RiBold size={20} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("italic") ? "bg-gray-300" : ""}`}
                title="Italic"
              >
                <RiItalic size={20} />
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
                title="Heading 2"
              >
                <RiH2 size={20} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("bulletList") ? "bg-gray-300" : ""}`}
                title="Bullet List"
              >
                <RiListUnordered size={20} />
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("orderedList") ? "bg-gray-300" : ""}`}
                title="Numbered List"
              >
                <RiListOrdered size={20} />
              </button>
            </div>

            <div className="border border-gray-300 rounded-b-xl overflow-hidden bg-white">
              <EditorContent editor={editor} />
            </div>

            {errors.camp_details && (
              <p className="text-red-500 text-sm mt-1">
                {errors.camp_details.message}
              </p>
            )}

            <input type="hidden" {...register("camp_details")} />
          </div>

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
              <p className="font-medium whitespace-nowrap text-primary text-sm sm:text-base lg:text-lg">
                +$25 (software fee)
              </p>
            </div>
          </div>

          {/* Submit */}
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
    </LoadScript>
  );
};

export default CreateNewCamp;
