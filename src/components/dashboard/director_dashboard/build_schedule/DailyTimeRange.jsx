import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { formatDate } from "@/utils/formatDate";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const DailyTimeRange = ({ getDateRange }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const { start_date, end_date, dates = [] } = getDateRange || {};

  // Note: react hook form
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Note: create schedule mutation
  const createScheduleMutation = useMutation({
    mutationKey: ["create-schedule"],
    mutationFn: async (data) => {
      const response = await axiosSecure.post(
        `/v1/camp/${id}/schedule/create`,
        data
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule created successfully.");
      navigate("/director-dashboard/court-list");
    },
    onError: (err) => {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          "Please field the all input field properly"
      );
    },
  });

  // Note: onSubmit
  const onSubmit = (data) => {
    const body = {
      game_duration: Number(data.game_duration),
      time_ranges: data.time_ranges,
      locations: data.locations,
    };
    console.log("Final Body:", body);
    createScheduleMutation.mutate(body);
  };

  // Note: main ui component
  return (
    <>
      <div className="my-10 w-full flex flex-col gap-5">
        <p className="text-xl font-medium text-[#333]">Camp Date Range:</p>
        <p className="text-[#333] text-base font-normal">
          {formatDate(start_date)} / {formatDate(end_date)}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10"
      >
        <p className="text-[#333] text-lg sm:text-xl md:text-2xl font-medium">
          Daily Time Ranges:
        </p>

        {/* time schedule */}
        <div className="flex flex-col gap-2 sm:gap-3 bg-[rgba(245,245,245,0.50)] rounded-xl sm:rounded-2xl">
          {dates?.map((range, index) => {
            return (
              <div
                key={range.id}
                className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-10 px-3 sm:px-4 md:px-5 py-3 sm:py-4"
              >
                {/* Date display */}
                <div className="w-full sm:w-auto min-w-[180px]">
                  <p className="text-[#333] text-base sm:text-lg font-normal">
                    {/* {range.monthName} {range.monthDateTime} */}
                    {range?.formatted}
                  </p>
                </div>
                {/* Time inputs */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CommonInputWrapper
                      type="time"
                      register={register}
                      register_as={`time_ranges.${index}.start_time`}
                    />

                    <p className="text-[#333] font-medium text-sm sm:text-base px-1 sm:px-2">
                      To
                    </p>

                    <CommonInputWrapper
                      type="time"
                      register={register}
                      register_as={`time_ranges.${index}.end_time`}
                    />
                    {/* Hidden date field */}
                    <input
                      type="hidden"
                      value={range.date}
                      {...register(`time_ranges.${index}.date`)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* game duration */}
        <div className="w-full flex flex-col items-start gap-2 sm:gap-3 md:gap-4">
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#333]">
            Game Duration:
          </p>

          {/* input field */}
          <div className="w-full bg-[rgba(245,245,245,0.50)] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            <CommonInputWrapper
              type="number"
              placeholder="Game Duration (minutes)"
              className="w-full text-sm sm:text-base"
              name="game_duration"
              register={register}
              register_as="game_duration"
              errors={errors}
            />
          </div>
        </div>

        {/* location and courts */}
        <div className="w-full flex flex-col items-start gap-2 sm:gap-3 md:gap-4">
          {/* title and add location */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#333]">
              Location & Courts
            </p>
            <button
              type="button"
              className="text-base sm:text-lg md:text-xl font-semibold text-[#00AEEF] hover:text-[#0098d6] transition-colors cursor-pointer"
            >
              + Add Location
            </button>
          </div>

          {/* location and number of courts */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 bg-[rgba(245,245,245,0.50)] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            {/* location name */}
            <CommonInputWrapper
              type="text"
              name="locations[0].location_name"
              register={register}
              register_as="locations.0.location_name"
              placeholder="Location Name"
            />
            {/* Number of court */}
            <CommonInputWrapper
              type="number"
              name="locations[0].court_count"
              register={register}
              register_as="locations.0.court_count"
              placeholder="Number of Courts"
            />
          </div>
        </div>

        {/* buttons */}
        <div className="w-full mt-4 sm:mt-6 md:mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0">
          {/* delete and select location button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              className="cursor-pointer border border-red-500 rounded-md p-3 hover:bg-gray-100 transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
              type="button"
            >
              <RiDeleteBinLine className="text-lg sm:text-xl text-red-500" />
            </button>
            <CommonSubmitBtn
              type="button"
              variant="primary"
              className="w-full sm:w-auto justify-center"
            >
              Select Location
            </CommonSubmitBtn>
          </div>

          {/* create schedule button link={true} path="/director-dashboard/court-list"*/}
          <CommonSubmitBtn
            variant="primary"
            type="submit"
            className="w-full sm:w-auto justify-center"
          >
            {createScheduleMutation?.isPending ? (
              <LoaderV2 />
            ) : (
              "Generate Schedule"
            )}
          </CommonSubmitBtn>
        </div>
      </form>
    </>
  );
};
export default DailyTimeRange;
