import Icon from "@/components/common/Icon";
import { Button, Divider } from "antd";
import { BiArrowBack } from "react-icons/bi";
import check from "@/assets/svg/circel-check.svg";

export default function PreviousCampsCard({ camp }) {
  const { title, location_icon, calendar_icon, location, date } = camp || {}    ;
  return (
    <div className="border border-border rounded-[10px] p-5">
      <div className="flex items-center justify-between">
        <h3>{title}</h3>
        <Icon src={check} className="size-5" />
      </div>
      <Button
        type="primary"
        className="mt-3 bg-primary! text-base! font-medium! rounded-[10px]! py-2! px-3!"
      >
        Professional
      </Button>
      <p className="my-3.5">
        <Icon src={location_icon} className="size-5 inline-block mr-2.5" />
        <span className="text-[#666666]">{location}</span>
      </p>
      <p>
        <Icon
          src={calendar_icon}
          className="size-4 inline-block mr-2.5 text-primary"
        />
        <span className="text-[#666666]">{date}</span>
      </p>
      <Divider className="my-4!" />
      <div className="flex justify-between items-center">
        <Button
          type="outline"
          className="text-[#666666]! text-base! font-normal!"
        >
          View Performance
        </Button>
        <BiArrowBack className="inline-block ml-2 text-xl text-primary" />
      </div>
    </div>
  );
}
