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
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useState } from "react";

const libraries = ["places"];

const DailyTimeRange = ({ getDateRange }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const { start_date, end_date, dates = [] } = getDateRange || {};

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      locations: [
        { location_name: "", court_count: "", latitude: "", longitude: "" },
      ],
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
    const filteredTimeRanges = (data.time_ranges || []).filter(
      (range) => range?.start_time && range?.end_time
    );

    if (filteredTimeRanges.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please provide at least one valid time range",
      });
      return;
    }

    const validLocations = data.locations.filter(
      (loc) =>
        loc.location_name &&
        loc.court_count &&
        loc.latitude &&
        loc.longitude
    );

    if (validLocations.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Location Required",
        text: "Please select valid locations with coordinates and court count",
      });
      return;
    }

    const body = {
      game_duration: Number(data.game_duration),
      time_ranges: filteredTimeRanges,
      locations: validLocations.map((loc) => ({
        location_name: loc.location_name,
        court_count: Number(loc.court_count),
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
      })),
      max_referees_per_slot: Number(data.max_referees_per_slot),
    };

    console.log("Final Body with Lat/Lng:", body);
    createScheduleMutation.mutate(body);
  };

  // Google Places Autocomplete with Lat/Lng Capture
  const LocationAutocomplete = ({ index }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const {
      ready,
      value,
      suggestions: { status, data },
      setValue: setPlaceValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: { types: ["establishment", "geocode"] },
      debounce: 300,
      initOnMount: isLoaded,
    });

    const handleInputChange = (e) => {
      const val = e.target.value;
      setPlaceValue(val);
      setValue(`locations.${index}.location_name`, val);
      setShowSuggestions(val.length > 0);
    };

    const handleSelect = async (description) => {
      setPlaceValue(description, false);
      clearSuggestions();
      setValue(`locations.${index}.location_name`, description);
      setShowSuggestions(false);

      try {
        const results = await getGeocode({ address: description });
        const { lat, lng } = await getLatLng(results[0]);

        // Save latitude and longitude to the form
        setValue(`locations.${index}.latitude`, lat.toString());
        setValue(`locations.${index}.longitude`, lng.toString());

        console.log("Location Saved:", {
          address: description,
          lat,
          lng,
        });
      } catch (err) {
        console.error("Geocode error:", err);
        Swal.fire({
          icon: "warning",
          title: "Location Error",
          text: "Could not get coordinates for this address.",
        });
      }
    };

    return (
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          disabled={!ready}
          placeholder="Search location (gym, stadium, park...)"
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00AEEF] text-base bg-white"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {showSuggestions && status === "OK" && data.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-64 overflow-y-auto">
            {data.map(({ place_id, description }) => (
              <div
                key={place_id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(description);
                }}
                className="px-5 py-3 hover:bg-[#f0f9ff] cursor-pointer text-base transition"
              >
                {description}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="my-10 w-full flex flex-col gap-5">
        <p className="text-xl font-medium text-[#333]">Camp Date Range:</p>
        <p className="text-[#333] text-base font-normal">
          {formatDate(start_date)} / {formatDate(end_date)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
        {/* Daily Time Ranges */}
        <div className="flex flex-col gap-4 bg-[rgba(245,245,245,0.50)] rounded-2xl p-6">
          <p className="text-2xl font-medium text-[#333]">Daily Time Ranges:</p>

          {dates?.map((range, index) => {
            const startField = `time_ranges.${index}.start_time`;
            const endField = `time_ranges.${index}.end_time`;

            return (
              <div
                key={range.id}
                className="flex items-center gap-3 py-5 px-6 rounded-xl "
              >
                <div className="font-medium text-[#333] text-lg min-w-[180px]">
                  {range?.formatted}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  <div className="">
                    <CommonInputWrapper
                      type="time"
                      register={register}
                      register_as={startField}
                      validationRules={{
                        required: "Start time is required",
                        validate: {
                          beforeEnd: (v) => {
                            const end = getValues(endField);
                            return !end || !v || v < end || "Start must be before end time";
                          },
                        },
                      }}
                    />
                    {errors.time_ranges?.[index]?.start_time && (
                      <p className="text-red-600 text-sm mt-1 pl-1">
                        {errors.time_ranges[index].start_time.message}
                      </p>
                    )}
                  </div>

                  <span className="text-gray-600 font-semibold">To</span>

                  <div className="">
                    <CommonInputWrapper
                      type="time"
                      register={register}
                      register_as={endField}
                      validationRules={{
                        required: "End time is required",
                        validate: {
                          afterStart: (v) => {
                            const start = getValues(startField);
                            return !start || !v || v > start || "End must be after start time";
                          },
                        },
                      }}
                    />
                    {errors.time_ranges?.[index]?.end_time && (
                      <p className="text-red-600 text-sm mt-1 pl-1">
                        {errors.time_ranges[index].end_time.message}
                      </p>
                    )}
                  </div>
                </div>

                <input type="hidden" {...register(`time_ranges.${index}.date`)} value={range.date} />
              </div>
            );
          })}
        </div>

        {/* Game Duration */}
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-medium text-[#333]">Game Duration:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[rgba(245,245,245,0.50)] rounded-2xl p-6">
            <CommonInputWrapper
              type="number"
              placeholder="Game Duration (minutes)"
              register={register}
              register_as="game_duration"
              validationRules={{
                required: "Game duration is required",
                min: { value: 1, message: "Minimum 1 minute" },
              }}
            />
            <CommonInputWrapper
              type="number"
              placeholder="Max Referees per Slot"
              register={register}
              register_as="max_referees_per_slot"
              validationRules={{
                required: "Max referees is required",
                min: { value: 1, message: "Minimum 1" },
              }}
            />
          </div>
        </div>

        {/* Locations Section */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-semibold text-[#333]">Location & Courts</p>
            <button
              type="button"
              onClick={() =>
                append({ location_name: "", court_count: "", latitude: "", longitude: "" })
              }
              className="text-xl font-semibold text-[#00AEEF] hover:text-[#0098d6] transition"
            >
              + Add Location
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-[rgba(245,245,245,0.50)] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-1">
                  {!isLoaded ? (
                    <p className="text-gray-500">Loading Google Places...</p>
                  ) : (
                    <LocationAutocomplete index={index} />
                  )}
                  {errors.locations?.[index]?.location_name && (
                    <p className="text-red-600 text-sm mt-2">Location is required</p>
                  )}
                </div>

                <div className="w-full md:w-64">
                  <CommonInputWrapper
                    type="number"
                    placeholder="Number of Courts"
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
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <RiDeleteBinLine size={28} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-12">
          <CommonSubmitBtn
            type="submit"
            variant="primary"
            disabled={createScheduleMutation.isPending}
          >
            {createScheduleMutation.isPending ? <LoaderV2 /> : "Generate Schedule"}
          </CommonSubmitBtn>
        </div>
      </form>
    </>
  );
};

export default DailyTimeRange;