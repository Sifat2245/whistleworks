import CommonSubmitBtn from "../common/CommonSubmitBtn";
import CommonText from "../common/CommonText";
import CommonTitle from "../common/CommonTitle";

const ReadyToTrasform = ({operationData}) => {
  return (
    <div className="bg-border py-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <CommonTitle text={`${operationData?.title}`} />
        <CommonText
          text={`${operationData?.description}`}
          className={"md:w-2/3 xl:w-1/3 mx-auto mt-5 text-neutral-500 text-lg"}
        />
      </div>

      <div className="flex justify-center items-center">
        <CommonSubmitBtn link path="/auth/signup" variant="primary">Create Your Account</CommonSubmitBtn>
      </div>
    </div>
  );
};
export default ReadyToTrasform;