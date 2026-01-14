/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import CommonInputWrapper from "./CommonInputWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useState, useRef } from "react";

// ── Google Maps Autocomplete ──────────────────────────────────────────────
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const EditProfileModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosSecure();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Track Google Maps script load state
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const autocompleteRef = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const updateProfilInfoMutation = useMutation({
    mutationKey: ["update-profile-info"],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(`/update-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userData"], exact: true });
      onClose(); // Close modal on success
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("biography", data.biography);

    // Optional: include lat/lng if your backend needs them
    // formData.append("latitude", data.latitude);
    // formData.append("longitude", data.longitude);

    // console.log("Onsubmit data : ---->", data);
    updateProfilInfoMutation.mutate(formData);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const fullAddress = place.formatted_address || place.name || "";

        setValue("address", fullAddress);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={googleApiKey}
      libraries={libraries}
      onLoad={() => setIsGoogleLoaded(true)}
      onError={() => {
        toast.error("Failed to load Google Maps. Using regular input.");
        setIsGoogleLoaded(true);
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal box */}
            <motion.div
              className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw]"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Edit Profile Information</h2>

              {/* modal content */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full grid grid-cols-1 gap-4"
              >
                <div className="w-full grid grid-cols-2 gap-4">
                  {/* first name */}
                  <CommonInputWrapper
                    label="First Name"
                    placeholder="Enter your first name"
                    register_as="first_name"
                    register={register}
                    errors={errors}
                    validationRules={{ required: "First name is required" }}
                  />
                  {/* last name */}
                  <CommonInputWrapper
                    label="Last Name"
                    placeholder="Enter your last name"
                    register_as="last_name"
                    register={register}
                    errors={errors}
                    validationRules={{ required: "Last name is required" }}
                  />
                  {/* address - Google Places Autocomplete */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>

                    {isGoogleLoaded ? (
                      <div className="relative">
                        <Autocomplete
                          onLoad={(ac) => (autocompleteRef.current = ac)}
                          onPlaceChanged={onPlaceChanged}
                          options={{
                            fields: ["formatted_address", "geometry", "name"],
                            types: ["geocode", "establishment"],
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Search address..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register("address", {
                              required: "Address is required",
                            })}
                          />
                        </Autocomplete>
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
                        Loading location search...
                      </div>
                    )}
                  </div>

                  {/* number */}
                  <CommonInputWrapper
                    label="Phone"
                    placeholder="Enter your number"
                    register_as="phone"
                    register={register}
                    errors={errors}
                    validationRules={{ required: "Phone is required" }}
                  />
                </div>

                {/* biography */}
                <CommonInputWrapper
                  label="Biography/Conferences"
                  type="textarea"
                  placeholder="Enter your biography"
                  register_as="biography"
                  register={register}
                  errors={errors}
                  validationRules={{ required: "Biography is required" }}
                />

                {/* close & update buttons */}
                <div className="w-full flex justify-between items-center mt-6">
                  <button
                    onClick={onClose}
                    type="button"
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Close
                  </button>

                  <button
                    disabled={updateProfilInfoMutation?.isPending}
                    type="submit"
                    className="cursor-pointer bg-primary text-white py-2 px-8 rounded-md border border-primary hover:bg-transparent hover:text-black hover:shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    {updateProfilInfoMutation?.isPending ? (
                      <>
                        Updating...
                      </>
                    ) : (
                      "Update Info"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadScript>
  );
};

export default EditProfileModal;