import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import CommonInputWrapper from "./CommonInputWrapper";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const EditProfileModal = ({ open, onClose }) => {
    const axiosInstance = useAxiosSecure();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()


    const updateProfilInfoMutation = useMutation({
        mutationKey: ["updte-profile-info"],
        mutationFn: async (formData) => {
            const respone = await axiosInstance.post(`/update-profile`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            return respone?.data?.data
        },
        onSuccess: (data) => {
            toast.success(data.message || "Profile update successfully")
        },
        onError: (err) => {
            toast.error(err?.respone?.data?.message || "Something went wrong!")
        }
    });


    const onSubmit = (data) => {
        console.log(data)
        // updateProfilInfoMutation.mutate()
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Modal box */}
                    <motion.div
                        className="bg-white rounded-lg p-6 w-[700px]"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            Edit Profile Information
                        </h2>

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
                                    placeholder="Enter your first name"
                                    register_as="last_name"
                                    register={register}
                                    errors={errors}
                                    validationRules={{ required: "Last name is required" }}
                                />
                                {/* address */}
                                <CommonInputWrapper
                                    label="Address"
                                    placeholder="Enter your address"
                                    register_as="address"
                                    register={register}
                                    errors={errors}
                                    validationRules={{ required: "Address is required" }}
                                />
                                {/* number */}
                                <CommonInputWrapper
                                    label="Phone"
                                    placeholder="Enter your number"
                                    register_as="phone"
                                    register={register}
                                    errors={errors}
                                    validationRules={{ required: "Address is required" }}
                                />
                            </div>

                            {/* biography */}
                            {/* Biography */}
                            <CommonInputWrapper
                                label="Biography"
                                type="textarea"
                                placeholder="Enter your biography"
                                register_as="biography"
                                register={register}
                                errors={errors}
                                validationRules={{ required: "Biography is required" }}
                            />
                        </form>

                        {/* close button */}
                        <div className="mt-5 w-full flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
                            >
                                Close
                            </button>

                            {/* update button */}
                            <button
                                disabled={updateProfilInfoMutation?.isPending}
                                className="cursor-pointer bg-primary text-white py-1.5 px-7 rounded-md border border-primary hover:bg-transparent hover:text-black hover:shadow-md transition-all duration-300"
                            >
                                {updateProfilInfoMutation?.isPending ? "Updating..." : "Update Info"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default EditProfileModal;