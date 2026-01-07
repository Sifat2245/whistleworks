import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { formatDate } from "@/utils/formatDate";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

const libraries = ["places"];

const DailyTimeRange = ({ getDateRange }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const { start_date, end_date, dates = [] } = getDateRange || {};

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      locations: [{ location_name: "", court_count: "", latitude: "", longitude: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const createScheduleMutation = useMutation({
    mutationKey: ["create-schedule"],
    mutationFn: async (data) => {
      const response = await axiosSecure.post(`/v1/camp/${id}/schedule/create`, data);
      return response?.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data?.message || "Schedule created successfully.",
        confirmButtonColor: "#00AEEF",
      });
      navigate("/director-dashboard");
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Please fill all fields properly",
        confirmButtonColor: "#00AEEF",
      });
    },
  });

  const onSubmit = (data) => {
    const validLocations = data.locations.filter(
      (loc) => loc.location_name && loc.court_count && loc.latitude && loc.longitude
    );

    if (validLocations.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Location Required",
        text: "Please select at least one valid location with court count",
      });
      return;
    }

    const body = {
      game_duration: Number(data.game_duration),
      time_ranges: (data.time_ranges || []).filter((r) => r.start_time && r.end_time),
      locations: validLocations.map((loc) => ({
        location_name: loc.location_name,
        court_count: Number(loc.court_count),
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
      })),
      max_referees_per_slot: Number(data.max_referees_per_slot),
    };

    createScheduleMutation.mutate(body);
  };

  const LocationInput = ({ index }) => {
    const autocompleteRef = useRef(null);

    const onPlaceChanged = () => {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const name = place.formatted_address || place.name || "";

          setValue(`locations.${index}.location_name`, name);
          setValue(`locations.${index}.latitude`, lat.toFixed(8));
          setValue(`locations.${index}.longitude`, lng.toFixed(8));
        }
      }
    };

    return (
      <div className="w-full">
          <div className="relative">
            <Autocomplete
              onLoad={(ac) => (autocompleteRef.current = ac)}
              onPlaceChanged={onPlaceChanged}
              options={{
                fields: ["formatted_address", "geometry", "name"],
                types: ["establishment", "geocode"],
              }}
            >
              <input
                type="text"
                placeholder="Search location (gym, stadium, park...)"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] text-base bg-white shadow-sm transition-all duration-200"
                {...register(`locations.${index}.location_name`, {
                  required: "Please select a valid location",
                })}
              />
            </Autocomplete>

            <input type="hidden" {...register(`locations.${index}.latitude`)} />
            <input type="hidden" {...register(`locations.${index}.longitude`)} />
          </div>

        {errors.locations?.[index]?.location_name && (
          <p className="text-red-600 text-sm mt-2 pl-1">
            {errors.locations[index].location_name.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {/* Camp Date Header */}
      <div className="my-12 w-full bg-linear-to-r from-[#00AEEF]/5 to-blue-50 rounded-2xl p-8 border border-[#00AEEF]/20 shadow-sm">
        <p className="text-2xl font-semibold text-[#333]">Camp Date Range:</p>
        <p className="text-xl text-[#333] mt-3 font-medium">
          {formatDate(start_date)} — {formatDate(end_date)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-10">
        {/* Daily Time Ranges */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-[#00AEEF] text-white px-8 py-5">
            <p className="text-2xl font-semibold">Daily Time Ranges</p>
          </div>
          <div className="p-8 space-y-6">
            {dates?.map((range, index) => (
              <div
                key={range.id}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="font-semibold text-lg text-[#333] min-w-[180px] text-center sm:text-left">
                  {range.formatted}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div>
                    <CommonInputWrapper
                      type="time"
                      register={register}
                      register_as={`time_ranges.${index}.start_time`}
                      validationRules={{ required: "Start time required" }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-500">→</span>
                  <div>
                    <CommonInputWrapper
                      type="time"
                      register={register}
                      register_as={`time_ranges.${index}.end_time`}
                      validationRules={{ required: "End time required" }}
                    />
                  </div>
                </div>
                <input
                  type="hidden"
                  {...register(`time_ranges.${index}.date`)}
                  value={range.date}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Game Duration & Max Referees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <p className="text-xl font-semibold text-[#333] mb-6">Game Duration</p>
            <CommonInputWrapper
              type="number"
              placeholder="e.g. 40"
              register={register}
              register_as="game_duration"
              validationRules={{
                required: "Game duration required",
                min: { value: 1, message: "Minimum 1 minute" },
              }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <p className="text-xl font-semibold text-[#333] mb-6">Max Referees per Slot</p>
            <CommonInputWrapper
              type="number"
              placeholder="e.g. 3"
              register={register}
              register_as="max_referees_per_slot"
              validationRules={{
                required: "Required",
                min: { value: 1, message: "At least 1" },
              }}
            />
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-[#00AEEF] text-white px-8 py-5 flex justify-between items-center">
            <p className="text-2xl font-semibold">Location & Courts</p>
            <button
              type="button"
              onClick={() =>
                append({ location_name: "", court_count: "", latitude: "", longitude: "" })
              }
              className="bg-white text-[#00AEEF] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow"
            >
              + Add Location
            </button>
          </div>

          <div className="p-8 space-y-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="flex-1">
                  <LocationInput index={index} />
                </div>

                <div className="w-full md:w-64">
                  <CommonInputWrapper
                    type="number"
                    placeholder="Number of courts"
                    register={register}
                    register_as={`locations.${index}.court_count`}
                    validationRules={{
                      required: "Court count required",
                      min: { value: 1, message: "At least 1 court" },
                    }}
                  />
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:bg-red-50 p-4 rounded-xl transition mt-4 md:mt-0"
                  >
                    <RiDeleteBinLine size={32} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mb-16">
          <CommonSubmitBtn
            type="submit"
            variant="primary"
            disabled={createScheduleMutation.isPending}
          >
            {createScheduleMutation.isPending ? (
              <>
                <LoaderV2 /> Generating Schedule...
              </>
            ) : (
              "Generate Schedule"
            )}
          </CommonSubmitBtn>
        </div>
      </form>
    </LoadScript>
  );
};

export default DailyTimeRange;