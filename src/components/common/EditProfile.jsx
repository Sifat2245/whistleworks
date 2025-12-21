import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import ActiveCmpsBackBtn from "./ActiveCmpsBackBtn";

export default function EditProfile() {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();
  const { userData } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      biography: userData?.biography || "",
    },
  });

  // 🔹 Update profile mutation
  const updateProfileMutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (payload) => {
      const response = await axiosInstance.put("/update-profile", payload);
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully");

      // refetch user data everywhere
      queryClient.invalidateQueries({ queryKey: ["userData"], exact: true });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Profile update failed"
      );
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <section className="container max-w-3xl mx-auto mt-10">
      <ActiveCmpsBackBtn label="Edit Profile" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-border rounded-[10px] p-6 space-y-5"
      >
        <h3 className="text-2xl font-medium mb-4">Edit Profile Info</h3>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email (readonly usually) */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            disabled
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            {...register("phone")}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            {...register("address")}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Address"
          />
        </div>

        {/* Biography */}
        <div>
          <label className="block mb-1 font-medium">Biography</label>
          <textarea
            {...register("biography")}
            rows={4}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Write something about you"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-5 py-2 rounded-md border"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || updateProfileMutation.isPending}
            className="px-5 py-2 rounded-md bg-primary text-white"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
