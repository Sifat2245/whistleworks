import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";

const CampLogoUploader = ({ register, initialPreview = null }) => {
  const [logoPreview, setLogoPreview] = useState(initialPreview);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setLogoPreview(previewURL);
  };

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-3">
      <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
        Camp Logo
      </label>
      <label className="cursor-pointer w-full h-28 sm:h-32 md:h-36 lg:h-40 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center border-[0.5px] border-primary rounded-xl sm:rounded-2xl hover:bg-primary/5 transition-colors duration-300 relative">
        {logoPreview ? (
          <img
            src={logoPreview}
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
            onChange: handleLogoChange,
          })}
        />
      </label>
    </div>
  );
};

export default CampLogoUploader;
