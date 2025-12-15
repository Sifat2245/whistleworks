import CommonSubmitBtn from "../common/CommonSubmitBtn";
import CommonText from "../common/CommonText";
import CommonTitle from "../common/CommonTitle";

const ReadyToTrasform = () => {
  return (
    <div className="bg-border py-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <CommonTitle text="Ready to Transform Your Operations?" />
        <CommonText
          text="Join hundreds of sports organizations using Whistle Works
streamline their Referee camp management"
          className={"md:w-2/3 xl:w-1/3 mx-auto mt-5 text-neutral-500 text-lg"}
        />
      </div>

      <div className="flex justify-center items-center">
        <CommonSubmitBtn variant="primary">Get Started Now</CommonSubmitBtn>
      </div>
    </div>
  );
};
export default ReadyToTrasform;