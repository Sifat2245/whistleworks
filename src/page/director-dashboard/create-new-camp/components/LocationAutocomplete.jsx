import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

const LocationAutocomplete = ({ register, setValue, errors }) => {
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

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-3">
      <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
        Location <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
          options={{
            fields: ["formatted_address", "geometry", "name"],
            types: ["geocode", "establishment"],
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

        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />
      </div>
    </div>
  );
};

export default LocationAutocomplete;
