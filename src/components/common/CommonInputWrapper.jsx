/* eslint-disable no-unused-vars */
import ErrorText from "@/components/common/ErrorText";
import { useState, useMemo } from "react";
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
  disabled = false,
  value = "",
  control,
  selectMode = "single",
  editForm = false,
}) => {
  const [show, setShow] = useState(false);
  const errorMessage = errors[register_as]?.message;

  // Note: normalize value for RHF + AntD
  const normalizeValue = (val) => {
    if (selectMode === "multiple" || selectMode === "tags") {
      if (Array.isArray(val)) {
        return val.map((item) =>
          typeof item === "object" ? item.value : item,
        );
      }
      return val ? [typeof val === "object" ? val.value : val] : [];
    }
    return typeof val === "object" ? val?.value : val;
  };

  const normalizedValue = normalizeValue(value);

  // Note: detect JSX label (image case)
  const hasJSXLabel = useMemo(() => {
    return options?.some((opt) => typeof opt?.label === "object");
  }, [options]);

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-2 justify-start items-start relative text-base text-black",
        wrapperClass,
      )}
    >
      {/* Label */}
      {label && (
        <label
          className={cn("capitalize font-medium text-[#333]", labeClass)}
          htmlFor={register_as}
        >
          {label}
        </label>
      )}

      {/* Password toggle */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className={`absolute cursor-pointer right-5 top-[50%] text-neutral-500 transform ${errorMessage ? "translate-y-[-46%]" : "translate-y-[50%]"
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
            "w-full resize-none min-h-40 px-4 py-5 rounded-lg placeholder-[#5A5C5F] outline-none text-black border border-gray-300 shadow-input bg-[rgba(255,255,255,0.05)]",
            textareaClass,
          )}
          {...register(register_as, validationRules)}
        />
      ) : type === "select" ? (
        <div
          className={cn(
            "w-full text-black border border-black/20 rounded-lg bg-[rgba(255,255,255,0.05)] shadow-input flex items-center p-1.5",
            selectClass,
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
                bordered={false}
                variant="borderless"
                disabled={disabled}
                mode={selectMode !== "single" ? selectMode : undefined}
                placeholder={placeholder}
                options={options}
                value={
                  normalizeValue(field.value) === "" ||
                    normalizeValue(field.value)?.length === 0
                    ? undefined
                    : normalizeValue(field.value)
                }
                onChange={(selectedValue) => {
                  field.onChange(selectedValue);
                }}
                showSearch
                allowClear
                className="w-full bg-transparent placeholder-neutral-600 h-[40px] sm:h-[44px] flex items-center text-base"
                filterOption={(input, option) => {
                  const labelText =
                    typeof option?.label === "object"
                      ? option?.label?.props?.children?.[1]?.props?.children ||
                      ""
                      : option?.label;
                  const jerseyMatch = option?.value?.toString() || "";

                  return (
                    (labelText?.toLowerCase?.() || "").includes(
                      input.toLowerCase(),
                    ) || jerseyMatch.includes(input.toLowerCase())
                  );
                }}
                optionFilterProp="children"
                filterSort={null}
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
            "w-full px-4 sm:py-2.5 py-2.5 rounded-lg placeholder-[#5A5C5F] outline-none text-black shadow-input border border-black/20 bg-[rgba(255,255,255,0.05)]",
            inputClass,
          )}
          {...register(register_as, validationRules)}
        />
      )}
      {/* Error */}
      {errorMessage && <ErrorText error={errorMessage} />}
    </div>
  );
};
export default CommonInputWrapper;
