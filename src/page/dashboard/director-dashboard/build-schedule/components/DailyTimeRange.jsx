import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import SectionCard from "@/components/common/SectionCard";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useMemo } from "react";
import { useCreateSchedule } from "@/hooks/api/director-hooks/useBuildSchedule";
import {
  LuClock,
  LuMapPin,
  LuPlus,
  LuTrash2,
  LuCalendarDays,
  LuTriangleAlert,
  LuTimer,
} from "react-icons/lu";

const libraries = ["places"];

const DailyTimeRange = ({ getDateRange }) => {
  const { id } = useParams();
  const createScheduleMutation = useCreateSchedule(id);
  const autocompleteRefs = useRef({});

  const { timezone, timezoneName, dates = [] } = getDateRange || {};

  const onPlaceChanged = (index) => {
    const autocomplete = autocompleteRefs.current[index];
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.formatted_address || place.name || "";

      setValue(`locations.${index}.location_name`, name);
      setValue(`locations.${index}.latitude`, lat.toFixed(8));
      setValue(`locations.${index}.longitude`, lng.toFixed(8));
    }
  };

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
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

  /* CommonInputWrapper reads errors by flat dot-path, so flatten RHF errors */
  const flatErrors = useMemo(() => {
    const flat = {};
    const walk = (obj, path = "") => {
      if (!obj || typeof obj !== "object") return;
      Object.entries(obj).forEach(([key, value]) => {
        const nextPath = path ? `${path}.${key}` : key;
        if (value && typeof value === "object" && "message" in value) {
          flat[nextPath] = value;
        } else {
          walk(value, nextPath);
        }
      });
    };
    walk(errors);
    return flat;
  }, [errors]);

  const onSubmit = (data) => {
    const validLocations = data.locations.filter(
      (loc) =>
        loc.location_name && loc.court_count && loc.latitude && loc.longitude,
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
      time_ranges: (data.time_ranges || []).filter(
        (r) => r.start_time && r.end_time,
      ),
      locations: validLocations.map((loc) => ({
        location_name: loc.location_name,
        court_count: Number(loc.court_count),
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
        address: loc.address,
      })),
      max_referees_per_slot: Number(data.max_referees_per_slot),
    };
    createScheduleMutation.mutate(body);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6 sm:gap-8 mt-8"
      >
        {/* Daily Time Ranges */}
        <SectionCard
          icon={<LuClock />}
          title="Daily Time Ranges"
          description="Set the playing hours for each day of the camp"
        >
          <div className="p-5 sm:p-7 space-y-4">
            {dates?.length ? (
              dates.map((range, index) => (
                <div
                  key={range.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 sm:p-5 bg-[#FAFAFA] border border-border rounded-[10px]"
                >
                  <div className="flex items-center gap-3 md:w-48 shrink-0">
                    <span className="w-9 h-9 rounded-lg bg-white border border-border text-primary flex items-center justify-center shrink-0">
                      <LuCalendarDays />
                    </span>
                    <div>
                      <p className="font-medium text-[#333] leading-tight">
                        {range.formatted}
                      </p>
                      <p className="text-xs text-[#666] mt-0.5">
                        Day {index + 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 flex-1">
                    <div className="flex-1">
                      <CommonInputWrapper
                        label="Start Time"
                        type="time"
                        register={register}
                        register_as={`time_ranges.${index}.start_time`}
                        errors={flatErrors}
                        validationRules={{ required: "Start time required" }}
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden sm:block text-xl text-[#BBB] pb-3"
                    >
                      →
                    </span>
                    <div className="flex-1">
                      <CommonInputWrapper
                        label="End Time"
                        type="time"
                        register={register}
                        register_as={`time_ranges.${index}.end_time`}
                        errors={flatErrors}
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
              ))
            ) : (
              <p className="text-sm text-[#666] text-center py-6">
                No camp dates are available to schedule yet.
              </p>
            )}
          </div>
        </SectionCard>

        {/* Game Setup: Duration & Referees */}
        <SectionCard
          icon={<LuTimer />}
          title="Game Setup"
          description="Configure game length and referee coverage per time slot"
        >
          <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <CommonInputWrapper
              label="Game Duration (minutes)"
              type="number"
              placeholder="e.g. 60"
              register={register}
              register_as="game_duration"
              errors={flatErrors}
              validationRules={{
                required: "Game duration required",
                min: { value: 1, message: "Minimum 1 minute" },
              }}
            />
            <CommonInputWrapper
              label="Referees per Slot"
              type="number"
              placeholder="e.g. 3"
              register={register}
              register_as="max_referees_per_slot"
              errors={flatErrors}
              validationRules={{
                required: "Required",
                min: { value: 1, message: "At least 1" },
              }}
            />
          </div>
        </SectionCard>

        {/* Locations & Courts */}
        <SectionCard
          icon={<LuMapPin />}
          title="Locations & Courts"
          description="Add the venues where the games will take place"
        >
          {/* Timezone notice */}
          <div className="mx-5 sm:mx-7 mt-5 sm:mt-7 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <LuTriangleAlert className="text-amber-500 text-xl shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">
                Location & Timezone Consistency
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Make sure all locations are within the camp&apos;s timezone:{" "}
                <span className="font-semibold text-amber-800">
                  {timezoneName} ({timezone})
                </span>
                . Incorrect timezone settings may display wrong times for
                referees and affect time synchronization.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-border rounded-[10px] overflow-hidden"
              >
                {/* Location header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAFAFA] border-b border-border">
                  <div className="flex items-center gap-2">
                    <LuMapPin className="text-primary" />
                    <p className="font-medium text-[#333] text-sm">
                      Location {index + 1}
                    </p>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition cursor-pointer"
                    >
                      <LuTrash2 /> Remove
                    </button>
                  )}
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <div className="w-full">
                      <label
                        htmlFor={`location-address-${index}`}
                        className="capitalize font-medium text-[#333] text-base"
                      >
                        Location Address
                      </label>
                      <div className="mt-2">
                        <Autocomplete
                          onLoad={(ac) =>
                            (autocompleteRefs.current[index] = ac)
                          }
                          onPlaceChanged={() => onPlaceChanged(index)}
                          options={{
                            fields: ["formatted_address", "geometry", "name"],
                            types: ["establishment", "geocode"],
                          }}
                        >
                          <input
                            id={`location-address-${index}`}
                            type="text"
                            placeholder="Search & select the exact venue address"
                            className="w-full px-4 py-3 rounded-lg placeholder-[#5A5C5F] outline-none text-black border border-black/20 bg-[rgba(255,255,255,0.05)] focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                            {...register(
                              `locations.${index}.location_name`,
                              {
                                required: "Please select a valid location",
                              },
                            )}
                          />
                        </Autocomplete>
                        <input
                          type="hidden"
                          {...register(`locations.${index}.latitude`)}
                        />
                        <input
                          type="hidden"
                          {...register(`locations.${index}.longitude`)}
                        />
                        <p className="text-xs text-[#999] mt-1.5">
                          Coordinates are captured automatically when you
                          select a place.
                        </p>
                      </div>

                      {errors.locations?.[index]?.location_name && (
                        <p className="text-red-600 text-sm mt-2">
                          {errors.locations[index].location_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <CommonInputWrapper
                    label="Venue Name"
                    type="text"
                    placeholder="e.g. Downtown Sports Arena"
                    register={register}
                    register_as={`locations.${index}.address`}
                    errors={flatErrors}
                    validationRules={{
                      required: "Venue name required",
                    }}
                  />
                  <CommonInputWrapper
                    label="Number of Courts"
                    type="number"
                    placeholder="e.g. 4"
                    register={register}
                    register_as={`locations.${index}.court_count`}
                    errors={flatErrors}
                    validationRules={{
                      required: "Court count required",
                      min: { value: 1, message: "At least 1 court" },
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Add location */}
            <button
              type="button"
              onClick={() =>
                append({
                  location_name: "",
                  court_count: "",
                  latitude: "",
                  longitude: "",
                })
              }
              className="w-full border-2 border-dashed border-border rounded-[10px] py-4 text-[#666] hover:text-primary hover:border-primary transition flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <LuPlus className="text-lg" /> Add another location
            </button>
          </div>
        </SectionCard>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <p className="text-sm text-[#666]">
            {createScheduleMutation.isPending
              ? "Generating your schedule — this may take a moment..."
              : "Your schedule will be generated and you&apos;ll be able to review & assign referees before publishing."}
          </p>
          <CommonSubmitBtn
            type="submit"
            variant="primary"
            isLoading={createScheduleMutation.isPending}
            className="px-8 justify-center"
          >
            Generate Schedule
          </CommonSubmitBtn>
        </div>
      </form>
    </LoadScript>
  );
};

export default DailyTimeRange;
