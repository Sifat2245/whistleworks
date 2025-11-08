/* eslint-disable no-unused-vars */
import ErrorText from "@/components/common/ErrorText";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
const CommonInputWrapper = ({
  wrapperClass,
  inputClass,
  labeClass,
  selectClass,
  textareaClass,
  label = "",
  type = "text",
  placeholder = "",
  register_as = "",
  register,
  name = "",
  options = [],
  errors = {},
  validationRules = {},
  readOnly = false,
  value = "",
  control,
  selectMode = "single",
  editForm = false,
}) => {
  const [show, setShow] = useState(false);
  const errorMessage = errors[register_as]?.message;
  // Function to normalize the value to always return primitive values
  const normalizeValue = (val) => {
    if (selectMode === "multiple" || selectMode === "tags") {
      if (Array.isArray(val)) {
        return val.map(item => typeof item === 'object' ? item.value : item);
      }
      return val ? [typeof val === 'object' ? val.value : val] : [];
    }
    return typeof val === 'object' ? val?.value : val;
  };
  // Normalize the initial value
  const normalizedValue = normalizeValue(value);
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-2 justify-start items-start relative text-base text-white",
        wrapperClass
      )}
    >
      {/* Label */}
      {label && (
        <label
          className={cn("capitalize font-medium", labeClass)}
          htmlFor={register_as}
        >
          {label}
        </label>
      )}

      {/* Eye Icon for Password */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow((prevState) => !prevState)}
          className={`absolute cursor-pointer right-5 top-[50%] transform ${errorMessage ? "translate-y-[-46%]" : "translate-y-[50%]"
            }`}
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}

      {/* Textarea */}
      {type === "textarea" ? (
        <textarea
          id={register_as}
          placeholder={placeholder}
          name={name}
          defaultValue={value}
          className={cn(
            "w-full resize-none min-h-48 px-4 py-5 rounded-lg placeholder-[#5A5C5F] outline-none text-white border border-dark shadow-input bg-[rgba(255,255,255,0.05)]",
            textareaClass
          )}
          {...register(register_as, validationRules)}
        />
      ) : type === "select" ? (
        <div
          className={cn(
            "w-full bg-[#d3d6da] text-black border-[rgba(31,39,48,0.10)] flex gap-2 px-4 py-2 sm:min-h-[66px] items-center border rounded-lg",
            selectClass
          )}
        >
          <Controller
            control={control}
            name={register_as}
            defaultValue={normalizedValue}
            rules={validationRules}
            render={({ field }) => (
              <Select
                {...field}
                mode={selectMode !== "single" ? selectMode : undefined}
                placeholder={placeholder}
                options={options}
                optionFilterProp="label"
                value={normalizeValue(field.value)}
                onChange={(selectedValue, option) => {
                  if (selectMode === "multiple" || selectMode === "tags") {
                    // For multiple select, return array of values
                    field.onChange(selectedValue);
                  } else {
                    // For single select, return just the value (not the object)
                    field.onChange(option?.value || selectedValue);
                  }
                }}
                className="w-full bg-transparent placeholder:text-dark"
                showSearch
                allowClear
              />
            )}
          />
        </div>
      ) : (
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          id={register_as}
          placeholder={placeholder}
          name={name}
          defaultValue={value}
          readOnly={readOnly}
          className={cn(
            "w-full px-4 sm:py-5 py-3 rounded-lg placeholder-[#5A5C5F] outline-none text-white shadow-input border border-dark bg-[rgba(255,255,255,0.05)]",
            inputClass
          )}
          {...register(register_as, validationRules)}
        />
      )}
      {/* Error Message */}
      {errorMessage && <ErrorText error={errorMessage} />}
    </div>
  );
};

export default CommonInputWrapper;




{
/**
import ErrorText from "@/components/common/ErrorText";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
const CommonInputWrapper = ({
  wrapperClass,
  inputClass,
  labeClass,
  selectClass,
  textareaClass,
  label = "",
  type = "text",
  placeholder = "",
  register_as = "",
  register,
  name = "",
  options = [],
  errors = {},
  validationRules = {},
  readOnly = false,
  value = "",
  control,
  selectMode = "single",
  editForm = false,
}) => {
  const [show, setShow] = useState(false);
  const errorMessage = errors[register_as]?.message;
  // Ensure value is an array when selectMode is "multiple" or "tags"
  const valueToPass =
    selectMode === "multiple" || selectMode === "tags"
      ? Array.isArray(value)
        ? value
        : [value]
      : value;
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-2 justify-start items-start relative text-base text-white",
        wrapperClass
      )}
    >
      {label && (
        <label
          className={cn("capitalize font-medium", labeClass)}
          htmlFor={register_as}
        >
          {label}
        </label>
      )}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow((prevState) => !prevState)}
          className={`absolute cursor-pointer right-5 top-[50%] transform ${
            errorMessage ? "translate-y-[-46%]" : "translate-y-[50%]"
          }`}
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
      {type === "textarea" ? (
        <textarea
          id={register_as}
          placeholder={placeholder}
          name={name}
          defaultValue={value}
          className={cn(
            "w-full resize-none min-h-48  px-4 py-5 rounded-lg placeholder-[#5A5C5F] outline-none  text-white border border-dark shadow-input bg-[rgba(255,255,255,0.05)]",
            textareaClass
          )}
          {...register(register_as, validationRules)}
        />
      ) : type === "select" ? (
        <div
          className={cn(
            " w-full bg-[#d3d6da] text-black border-[rgba(31,39,48,0.10)] flex gap-2 px-4 py-2 sm:min-h-[66px] items-center border rounded-lg",
            selectClass
          )}
        >
          {editForm ? (
            <Controller
              control={control}
              name={register_as}
              defaultValue={value}
              rules={validationRules}
              render={({ field }) => (
                <Select
                  {...field}
                  mode={selectMode !== "single" ? selectMode : undefined}
                  placeholder={placeholder}
                  options={options}
                  optionFilterProp="label"
                  defaultValue={
                    selectMode === "multiple" || selectMode === "tags"
                      ? valueToPass.length > 0
                        ? valueToPass
                        : undefined
                      : valueToPass || undefined
                  } 
                  className="w-full bg-transparent  placeholder:text-dark "
                  showSearch
                  allowClear
                />
              )}
            />
          ) : (
            <Controller
              control={control}
              name={register_as}
              rules={validationRules}
              render={({ field }) => (
                <Select
                  {...field}
                  mode={selectMode !== "single" ? selectMode : undefined}
                  placeholder={placeholder}
                  options={options}
                  optionFilterProp="label"
                  defaultValue={
                    selectMode === "multiple" || selectMode === "tags"
                      ? valueToPass.length > 0
                        ? valueToPass
                        : undefined
                      : valueToPass || undefined
                  } 
                  className="w-full bg-transparent placeholder:text-dark "
                  showSearch
                  allowClear
                />
              )}
            />
          )}
        </div>
      ) : (
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          id={register_as}
          placeholder={placeholder}
          name={name}
          defaultValue={value}
          readOnly={readOnly}
          className={cn(
            "w-full px-4 sm:py-5 py-3  rounded-lg placeholder-[#5A5C5F] outline-none text-white shadow-input border border-dark bg-[rgba(255,255,255,0.05)] ",
            inputClass
          )}
          {...register(register_as, validationRules)}
        />
      )}
      {errorMessage && <ErrorText error={errorMessage} />}
    </div>
  );
};
export default CommonInputWrapper;* 
*/
}